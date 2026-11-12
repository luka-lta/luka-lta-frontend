import { createHmac } from 'node:crypto';
import { getChallengeFailure, issueChallengeToken, MIN_FILL_TIME_MS } from './challengeToken.js';
import { parseContactSubmission, type ContactSubmission } from './contactSubmission.js';
import type { RateLimiter } from './rateLimiter.js';

/** Für Menschen unsichtbares Feld; ein Wert darin kennzeichnet einen Bot */
export const HONEYPOT_FIELD = 'topic_confirm';

/** 16 KiB in bytes */
export const MAX_BODY_BYTES = 16 * 1024;

/** Maximale POST-Anfragen pro Client und Zeitfenster */
export const RATE_LIMIT_MAX_REQUESTS = 5;

/** Zeitfenster des Rate-Limits: 10 Minuten in Millisekunden */
export const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

type HeaderValue = string | string[] | undefined;

export interface ContactRequest {
  method: string;
  headers: Record<string, HeaderValue>;
  body: unknown;
}

export interface ContactResponse {
  status: number;
  headers: Record<string, string>;
  body: Record<string, unknown>;
  /** Grund einer Ablehnung fürs Logging — enthält nie personenbezogene Daten */
  rejectionReason: string | null;
}

export interface ContactDependencies {
  secret: string;
  rateLimiter: RateLimiter;
  sendMail: (submission: ContactSubmission) => Promise<void>;
  now: () => number;
}

function getHeader(headers: Record<string, HeaderValue>, name: string): string | null {
  const value = headers[name];
  if (Array.isArray(value)) return value[0] ?? null;

  return value ?? null;
}

function reject(
  status: number,
  error: string,
  rejectionReason: string,
  extra: Record<string, unknown> = {},
  headers: Record<string, string> = {},
): ContactResponse {
  return { status, headers, body: { error, ...extra }, rejectionReason };
}

function isSameOrigin(headers: Record<string, HeaderValue>): boolean {
  const origin = getHeader(headers, 'origin');
  if (origin === null) return false;
  if (!URL.canParse(origin)) return false;

  const originHost = new URL(origin).host;

  return originHost === getHeader(headers, 'host') || originHost === getHeader(headers, 'x-forwarded-host');
}

/**
 * Schlüssel fürs Rate-Limit. Die IP wird nur als HMAC im Arbeitsspeicher gehalten,
 * nie im Klartext gespeichert oder geloggt.
 */
function getClientKey(headers: Record<string, HeaderValue>, secret: string): string {
  const forwardedFor = getHeader(headers, 'x-forwarded-for')?.split(',')[0].trim();
  const ip = getHeader(headers, 'x-real-ip') ?? forwardedFor ?? 'unknown';

  return createHmac('sha256', secret).update(`contact-client:${ip}`).digest('base64url');
}

function isBodyTooLarge(headers: Record<string, HeaderValue>): boolean {
  const contentLength = Number(getHeader(headers, 'content-length') ?? '0');

  return Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isHoneypotFilled(body: Record<string, unknown>): boolean {
  const value = body[HONEYPOT_FIELD];
  if (value === undefined || value === null) return false;

  return String(value).trim() !== '';
}

async function handleSubmission(request: ContactRequest, dependencies: ContactDependencies): Promise<ContactResponse> {
  const now = dependencies.now();

  if (!isSameOrigin(request.headers)) return reject(403, 'forbidden', 'foreign_origin');

  const rateLimit = dependencies.rateLimiter.consume(getClientKey(request.headers, dependencies.secret), now);
  if (!rateLimit.isAllowed) {
    return reject(429, 'rate_limited', 'rate_limited', {}, { 'Retry-After': String(rateLimit.retryAfterSeconds) });
  }

  if (isBodyTooLarge(request.headers)) return reject(413, 'payload_too_large', 'payload_too_large');
  if (!isRecord(request.body)) return reject(400, 'invalid_body', 'invalid_body');

  // Bots bekommen eine Erfolgsantwort, damit sie den Honeypot nicht erkennen — es geht keine Mail raus.
  if (isHoneypotFilled(request.body)) {
    return { status: 200, headers: {}, body: { success: true }, rejectionReason: 'honeypot' };
  }

  const challengeFailure = getChallengeFailure(request.body.token, dependencies.secret, now);
  if (challengeFailure !== null) return reject(400, 'challenge_failed', `challenge_${challengeFailure}`);

  const parsed = parseContactSubmission(request.body);
  if (!parsed.isValid) {
    return reject(422, 'invalid_input', 'invalid_input', { fields: parsed.invalidFields });
  }

  await dependencies.sendMail(parsed.submission);

  return { status: 200, headers: {}, body: { success: true }, rejectionReason: null };
}

/**
 * Kernlogik des Kontakt-Endpunkts, unabhängig von Vercel-Request/-Response.
 * GET gibt ein signiertes Zeit-Token aus, POST prüft und versendet die Anfrage.
 */
export async function handleContactRequest(
  request: ContactRequest,
  dependencies: ContactDependencies,
): Promise<ContactResponse> {
  if (request.method === 'GET') {
    return {
      status: 200,
      headers: { 'Cache-Control': 'no-store' },
      body: {
        token: issueChallengeToken(dependencies.secret, dependencies.now()),
        minFillTimeMs: MIN_FILL_TIME_MS,
      },
      rejectionReason: null,
    };
  }

  if (request.method === 'POST') return handleSubmission(request, dependencies);

  return reject(405, 'method_not_allowed', 'method_not_allowed', {}, { Allow: 'GET, POST' });
}

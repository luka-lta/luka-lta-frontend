import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

const CONTACT_ENDPOINT = '/api/contact';

/** Puffer auf die vom Server geforderte Mindestzeit, damit Netzwerk-Jitter keine Ablehnung auslöst */
const CHALLENGE_MARGIN_MS = 250;

/** Für Menschen unsichtbares Feld — muss dem Namen in `api/_contact/handleContactRequest.ts` entsprechen */
export const HONEYPOT_FIELD = 'topic_confirm';

// Grenzen entsprechen der serverseitigen Prüfung in `api/_contact/contactSubmission.ts`.
export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 100;
export const EMAIL_MAX_LENGTH = 254;
export const PHONE_MAX_LENGTH = 30;
export const PHONE_MIN_DIGITS = 6;
export const PHONE_MAX_DIGITS = 15;
export const MESSAGE_MIN_LENGTH = 10;
export const MESSAGE_MAX_LENGTH = 5000;
export const PHONE_PATTERN = /^\+?[0-9 ()/.-]+$/;

export function isPhoneNumber(value: string): boolean {
  const digits = value.replace(/\D/g, '').length;

  return PHONE_PATTERN.test(value) && digits >= PHONE_MIN_DIGITS && digits <= PHONE_MAX_DIGITS;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  [HONEYPOT_FIELD]?: string;
}

const ChallengeSchema = z.object({
  token: z.string().min(1),
  minFillTimeMs: z.number().nonnegative(),
});

const ErrorResponseSchema = z.object({
  error: z.enum(['rate_limited', 'invalid_input', 'challenge_failed']),
});

export type ContactFormErrorCode = z.infer<typeof ErrorResponseSchema>['error'] | 'unknown';

export class ContactFormError extends Error {
  readonly code: ContactFormErrorCode;

  constructor(code: ContactFormErrorCode) {
    super(`Contact request failed: ${code}`);
    this.code = code;
  }
}

interface Challenge {
  token: string;
  /** Zeitpunkt, ab dem der Server das Token akzeptiert (Client-Uhr) */
  usableAt: number;
}

let pendingChallenge: Promise<Challenge> | null = null;

async function loadErrorCode(response: Response): Promise<ContactFormErrorCode> {
  const payload: unknown = await response.json().catch(() => null);
  const parsed = ErrorResponseSchema.safeParse(payload);
  if (!parsed.success) return 'unknown';

  return parsed.data.error;
}

async function loadChallenge(): Promise<Challenge> {
  const response = await fetch(CONTACT_ENDPOINT, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new ContactFormError(await loadErrorCode(response));

  const payload: unknown = await response.json();
  const challenge = ChallengeSchema.parse(payload);

  return { token: challenge.token, usableAt: Date.now() + challenge.minFillTimeMs + CHALLENGE_MARGIN_MS };
}

function getChallenge(): Promise<Challenge> {
  if (pendingChallenge !== null) return pendingChallenge;

  const challenge = loadChallenge();
  pendingChallenge = challenge;
  challenge.catch(() => {
    // Fehlgeschlagene Abrufe nicht cachen, der nächste Versuch lädt neu.
    if (pendingChallenge === challenge) pendingChallenge = null;
  });

  return challenge;
}

/**
 * Holt das Zeit-Token vorab, sobald jemand das Formular anfasst. So ist die
 * Mindestzeit beim Absenden normalerweise längst verstrichen.
 */
export function prepareContactChallenge(): void {
  getChallenge().catch(() => undefined);
}

function waitUntil(timestamp: number): Promise<void> {
  const remaining = timestamp - Date.now();
  if (remaining <= 0) return Promise.resolve();

  return new Promise((resolve) => setTimeout(resolve, remaining));
}

async function submit(data: ContactFormData): Promise<Response> {
  const challenge = await getChallenge();
  await waitUntil(challenge.usableAt);

  return fetch(CONTACT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, token: challenge.token }),
  });
}

async function submitContactForm(data: ContactFormData): Promise<void> {
  let response = await submit(data);
  // Nächste Absendung holt ein frisches Token.
  pendingChallenge = null;

  if (!response.ok && (await loadErrorCode(response.clone())) === 'challenge_failed') {
    // Token abgelaufen (Tab lange offen) — einmal mit frischem Token wiederholen.
    response = await submit(data);
    pendingChallenge = null;
  }

  if (!response.ok) throw new ContactFormError(await loadErrorCode(response));
}

export function useContactForm() {
  return useMutation<void, Error, ContactFormData>({ mutationFn: submitContactForm });
}

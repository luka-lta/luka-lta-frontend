import { createHmac, timingSafeEqual } from 'node:crypto';

/** Mindestzeit zwischen Token-Ausgabe und Absenden: 3 Sekunden in Millisekunden */
export const MIN_FILL_TIME_MS = 3 * 1000;

/** Maximale Gültigkeit eines Tokens: 2 Stunden in Millisekunden */
export const MAX_TOKEN_AGE_MS = 2 * 60 * 60 * 1000;

export type ChallengeFailure = 'malformed' | 'bad_signature' | 'too_fast' | 'expired';

function sign(issuedAt: string, secret: string): Buffer {
  return createHmac('sha256', secret).update(`contact-challenge:${issuedAt}`).digest();
}

/**
 * Erzeugt ein zustandsloses, signiertes Token mit dem Ausgabezeitpunkt.
 * Der Zeitstempel kommt vom Server und ist durch die Signatur nicht fälschbar.
 */
export function issueChallengeToken(secret: string, now: number): string {
  const issuedAt = String(now);

  return `${issuedAt}.${sign(issuedAt, secret).toString('base64url')}`;
}

/** Gibt den Grund zurück, aus dem das Token abgelehnt wird, oder `null` bei gültigem Token. */
export function getChallengeFailure(token: unknown, secret: string, now: number): ChallengeFailure | null {
  if (typeof token !== 'string') return 'malformed';

  const parts = token.split('.');
  if (parts.length !== 2) return 'malformed';

  const [issuedAt, signature] = parts;
  if (!/^\d{1,15}$/.test(issuedAt)) return 'malformed';

  const expected = sign(issuedAt, secret);
  const actual = Buffer.from(signature, 'base64url');
  if (actual.length !== expected.length) return 'bad_signature';
  if (!timingSafeEqual(actual, expected)) return 'bad_signature';

  const age = now - Number(issuedAt);
  if (age < MIN_FILL_TIME_MS) return 'too_fast';
  if (age > MAX_TOKEN_AGE_MS) return 'expired';

  return null;
}

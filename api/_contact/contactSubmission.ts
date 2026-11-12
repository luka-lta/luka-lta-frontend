import { z } from 'zod';

export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 100;
/** Maximale Länge einer E-Mail-Adresse laut RFC 5321 */
export const EMAIL_MAX_LENGTH = 254;
export const PHONE_MAX_LENGTH = 30;
/** Minimale und maximale Ziffernanzahl einer Telefonnummer (Obergrenze laut E.164) */
export const PHONE_MIN_DIGITS = 6;
export const PHONE_MAX_DIGITS = 15;
export const MESSAGE_MIN_LENGTH = 10;
export const MESSAGE_MAX_LENGTH = 5000;
/** Mehr Links in einer Nachricht gelten als Spam-Merkmal */
export const MESSAGE_MAX_LINKS = 5;

const CONTROL_CHARACTER = /\p{Cc}/u;
const CONTROL_CHARACTER_EXCEPT_NEWLINE_AND_TAB = /[^\P{Cc}\n\t]/gu;
const LINK = /https?:\/\/|www\./gi;
const PHONE = /^\+?[0-9 ()/.-]+$/;

function countDigits(value: string): number {
  return value.replace(/\D/g, '').length;
}

function countLinks(value: string): number {
  return value.match(LINK)?.length ?? 0;
}

const ContactSubmissionSchema = z.object({
  // Keine Steuerzeichen (insb. CR/LF): der Name landet in Subject und Reply-To.
  name: z.string()
    .trim()
    .min(NAME_MIN_LENGTH)
    .max(NAME_MAX_LENGTH)
    .refine((value) => !CONTROL_CHARACTER.test(value))
    .refine((value) => countLinks(value) === 0),
  email: z.string().trim().max(EMAIL_MAX_LENGTH).email(),
  phone: z.preprocess(
    (value) => (value === null || (typeof value === 'string' && value.trim() === '') ? undefined : value),
    z.string()
      .trim()
      .max(PHONE_MAX_LENGTH)
      .regex(PHONE)
      .refine((value) => countDigits(value) >= PHONE_MIN_DIGITS && countDigits(value) <= PHONE_MAX_DIGITS)
      .optional(),
  ),
  message: z.string()
    .transform((value) => value.replace(/\r\n?/g, '\n').replace(CONTROL_CHARACTER_EXCEPT_NEWLINE_AND_TAB, '').trim())
    .pipe(
      z.string()
        .min(MESSAGE_MIN_LENGTH)
        .max(MESSAGE_MAX_LENGTH)
        .refine((value) => countLinks(value) <= MESSAGE_MAX_LINKS),
    ),
});

export type ContactSubmission = z.infer<typeof ContactSubmissionSchema>;

export type ContactSubmissionResult =
  | { isValid: true; submission: ContactSubmission }
  | { isValid: false; invalidFields: string[] };

/** Parst den Request-Body zu einer bereinigten Anfrage oder nennt die ungültigen Felder. */
export function parseContactSubmission(body: unknown): ContactSubmissionResult {
  const result = ContactSubmissionSchema.safeParse(body);
  if (result.success) return { isValid: true, submission: result.data };

  const invalidFields = [...new Set(result.error.issues.map((issue) => String(issue.path[0] ?? 'body')))];

  return { isValid: false, invalidFields };
}

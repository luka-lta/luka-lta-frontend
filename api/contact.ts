import { createHmac } from 'node:crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';
import { buildContactMail } from './_contact/contactMail.js';
import {
  handleContactRequest,
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_WINDOW_MS,
} from './_contact/handleContactRequest.js';
import { RateLimiter } from './_contact/rateLimiter.js';

const SMTP_HOST = 'smtp.hostinger.com';
const SMTP_PORT = 587;
const DEFAULT_RECIPIENT = 'luka@luka-lta.dev';

// Lebt so lange wie die Function-Instanz (Fluid Compute verwendet Instanzen wieder).
const rateLimiter = new RateLimiter(RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOW_MS);

/**
 * Signaturschlüssel für Zeit-Token und Rate-Limit-Keys. Ohne `CONTACT_FORM_SECRET`
 * wird ein eigener Schlüssel aus `SMTP_PASS` abgeleitet, damit das Formular ohne
 * zusätzliche Konfiguration weiterläuft.
 */
function getFormSecret(smtpPass: string): string {
  const configured = process.env.CONTACT_FORM_SECRET;
  if (configured) return configured;

  return createHmac('sha256', smtpPass).update('contact-form-secret').digest('hex');
}

// Usage: curl https://luka-lta.dev/api/contact
// Usage: curl https://luka-lta.dev/api/contact --header 'Origin: https://luka-lta.dev' --json \
//   '{"name":"Erika Mustermann","email":"erika@example.com","message":"Hallo, ich habe ein Projekt.","token":"<token>"}'
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpUser || !smtpPass) {
    console.error('Missing SMTP env vars');
    return res.status(500).json({ error: 'server_misconfigured' });
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false,
    auth: { user: smtpUser, pass: smtpPass },
  });

  let body: unknown;
  try {
    // Der Body-Getter von Vercel wirft bei ungültigem JSON.
    body = req.body;
  } catch {
    console.warn('Contact request rejected', { reason: 'invalid_body' });
    return res.status(400).json({ error: 'invalid_body' });
  }

  try {
    const result = await handleContactRequest(
      { method: req.method ?? '', headers: req.headers, body },
      {
        secret: getFormSecret(smtpPass),
        rateLimiter,
        now: Date.now,
        sendMail: async (submission) => {
          await transporter.sendMail(
            buildContactMail(submission, smtpUser, process.env.CONTACT_TO ?? DEFAULT_RECIPIENT),
          );
        },
      },
    );

    if (result.rejectionReason !== null) {
      console.warn('Contact request rejected', { reason: result.rejectionReason });
    }

    for (const [name, value] of Object.entries(result.headers)) res.setHeader(name, value);

    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error('Contact request failed', { reason: err instanceof Error ? err.message : 'unknown' });
    return res.status(500).json({ error: 'send_failed' });
  }
}

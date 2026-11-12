import type { ContactSubmission } from './contactSubmission.js';

const SENDER_NAME = 'Luka Dev Studio';
const MISSING_PHONE = '–';

export interface ContactMailAddress {
  name: string;
  address: string;
}

export interface ContactMail {
  from: ContactMailAddress;
  to: string;
  replyTo: ContactMailAddress;
  subject: string;
  headers: Record<string, string>;
  html: string;
  text: string;
}

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => HTML_ESCAPES[character]);
}

/**
 * Baut die Mail aus einer bereits geparsten Anfrage.
 * Adressen gehen als Objekte an nodemailer, nie als zusammengesetzter Header-String.
 */
export function buildContactMail(submission: ContactSubmission, sender: string, recipient: string): ContactMail {
  const phone = submission.phone ?? MISSING_PHONE;

  return {
    from: { name: SENDER_NAME, address: sender },
    to: recipient,
    replyTo: { name: submission.name, address: submission.email },
    subject: `Kontaktanfrage: ${submission.name}`,
    headers: {
      'X-Mailer': 'Luka Dev Studio Mailer',
      'X-Priority': '3',
    },
    html: [
      '<h2>Neue Anfrage über luka-lta.dev</h2>',
      `<p><b>Name:</b> ${escapeHtml(submission.name)}</p>`,
      `<p><b>E-Mail:</b> ${escapeHtml(submission.email)}</p>`,
      `<p><b>Telefon:</b> ${escapeHtml(phone)}</p>`,
      '<hr>',
      '<p><b>Nachricht:</b></p>',
      `<p>${escapeHtml(submission.message).replace(/\n/g, '<br>')}</p>`,
    ].join('\n'),
    text: `Name: ${submission.name}\nE-Mail: ${submission.email}\nTelefon: ${phone}\n\n${submission.message}`,
  };
}

import { describe, expect, test } from 'bun:test';
import { buildContactMail, escapeHtml } from './contactMail.js';
import { parseContactSubmission, type ContactSubmission } from './contactSubmission.js';

const SENDER = 'mailer@example.com';
const RECIPIENT = 'inbox@example.com';

function parse(overrides: Record<string, unknown>): ContactSubmission {
  const result = parseContactSubmission({
    name: 'Erika Mustermann',
    email: 'erika.mustermann@example.com',
    message: 'Guten Tag, ich suche Unterstützung für einen neuen Onlineshop.',
    ...overrides,
  });
  if (!result.isValid) throw new Error(`Unexpected invalid fields: ${result.invalidFields.join(', ')}`);

  return result.submission;
}

describe('escapeHtml', () => {
  test.each([
    ['<script>alert(1)</script>', '&lt;script&gt;alert(1)&lt;/script&gt;'],
    ['"quoted" & \'single\'', '&quot;quoted&quot; &amp; &#39;single&#39;'],
    ['Müller & Söhne', 'Müller &amp; Söhne'],
    ['', ''],
  ])('shouldEscape %p', (input, expected) => {
    expect(escapeHtml(input)).toBe(expected);
  });
});

describe('buildContactMail', () => {
  test('shouldPassAddressesAsObjectsInsteadOfHeaderStrings', () => {
    const mail = buildContactMail(parse({ name: 'Erika" <victim@example.com>' }), SENDER, RECIPIENT);

    expect(mail.replyTo).toEqual({ name: 'Erika" <victim@example.com>', address: 'erika.mustermann@example.com' });
    expect(mail.from).toEqual({ name: 'Luka Dev Studio', address: SENDER });
    expect(mail.to).toBe(RECIPIENT);
  });

  test('shouldEscapeMarkupInEveryHtmlField', () => {
    const mail = buildContactMail(
      parse({ name: '<b>Erika</b>', message: 'Hallo <img src=x onerror=alert(1)> & Grüße' }),
      SENDER,
      RECIPIENT,
    );

    expect(mail.html).toContain('&lt;b&gt;Erika&lt;/b&gt;');
    expect(mail.html).toContain('Hallo &lt;img src=x onerror=alert(1)&gt; &amp; Grüße');
    expect(mail.html).not.toContain('<img');
    expect(mail.html).not.toContain('<b>Erika');
  });

  test('shouldKeepLineBreaksOfMessage', () => {
    const mail = buildContactMail(parse({ message: 'Erste Zeile\r\nZweite Zeile' }), SENDER, RECIPIENT);

    expect(mail.html).toContain('Erste Zeile<br>Zweite Zeile');
    expect(mail.text).toEndWith('Erste Zeile\nZweite Zeile');
  });

  test('shouldShowPlaceholderForMissingPhone', () => {
    const mail = buildContactMail(parse({}), SENDER, RECIPIENT);

    expect(mail.html).toContain('<b>Telefon:</b> –');
  });

  test('shouldNeverContainLineBreaksInSubject', () => {
    const mail = buildContactMail(parse({ name: '  Erika Mustermann  ' }), SENDER, RECIPIENT);

    expect(mail.subject).toBe('Kontaktanfrage: Erika Mustermann');
  });
});

describe('parseContactSubmission', () => {
  test.each([
    ['non-ASCII name', { name: 'Łukasz Żółć-Müller' }],
    ['shortest name', { name: 'Li' }],
    ['longest name', { name: 'a'.repeat(100) }],
    ['shortest message', { message: 'a'.repeat(10) }],
    ['longest message', { message: 'a'.repeat(5000) }],
    ['message with a few links', { message: 'Meine Seite: https://example.com und www.example.org' }],
    ['phone with separators', { phone: '(030) 123-45.67 / 8' }],
    ['phone as null', { phone: null }],
  ])('shouldAccept %s', (_label, overrides) => {
    expect(() => parse(overrides)).not.toThrow();
  });

  test('shouldStripControlCharactersFromMessage', () => {
    const submission = parse({ message: 'Hallo\u0000 Welt\u001B[31m, bitte\tmelden' });

    expect(submission.message).toBe('Hallo Welt[31m, bitte\tmelden');
  });

  test('shouldDropUnknownFields', () => {
    const submission = parse({ token: 'abc', isAdmin: true });

    expect(Object.keys(submission).sort()).toEqual(['email', 'message', 'name']);
  });

  test('shouldReportEveryInvalidField', () => {
    const result = parseContactSubmission({ name: '', email: 'nope', message: 'kurz' });

    expect(result).toEqual({ isValid: false, invalidFields: ['name', 'email', 'message'] });
  });
});

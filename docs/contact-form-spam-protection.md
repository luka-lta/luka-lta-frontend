# Spam-Schutz Kontaktformular

Schutz des Endpunkts `/api/contact` (Vercel Function) gegen automatisierte Absendungen.
Ohne Drittanbieter, ohne Cookies, ohne neue Dependencies.

## Ablauf

1. Besucher fokussiert das Formular → Client holt per `GET /api/contact` ein signiertes Zeit-Token.
2. Absenden → `POST /api/contact` mit Feldern, Honeypot-Feld und Token.
3. Server prüft in dieser Reihenfolge; erst wenn alles besteht, geht eine Mail raus:

| # | Prüfung | Antwort bei Verstoß |
|---|---|---|
| 1 | `Origin` muss zum `Host` der Anfrage passen | `403 forbidden` |
| 2 | Rate-Limit: 5 POSTs / 10 Minuten pro Client | `429 rate_limited` + `Retry-After` |
| 3 | Body ≤ 16 KiB und ein JSON-Objekt | `413` / `400 invalid_body` |
| 4 | Honeypot-Feld `topic_confirm` leer | `200 { success: true }`, **keine Mail** |
| 5 | Zeit-Token: Signatur gültig, 3 s ≤ Alter ≤ 2 h | `400 challenge_failed` |
| 6 | Feldvalidierung (siehe unten) | `422 invalid_input` + `fields` |

Honeypot-Treffer bekommen bewusst eine Erfolgsantwort, damit Bots den Mechanismus nicht erkennen.
Alle abgelehnten Anfragen zählen ins Rate-Limit. Es gibt keine Datenbank im Pfad — abgelehnte
Anfragen werden nirgends gespeichert.

## Feldregeln (serverseitig, `api/_contact/contactSubmission.ts`)

| Feld | Regel |
|---|---|
| `name` | 2–100 Zeichen, keine Steuerzeichen (CR/LF), keine Links |
| `email` | gültige Einzeladresse, max. 254 Zeichen |
| `phone` | optional; nur Ziffern, `+ ( ) / . -` und Leerzeichen, 6–15 Ziffern, max. 30 Zeichen |
| `message` | 10–5000 Zeichen nach Bereinigung, max. 5 Links; Steuerzeichen außer `\n`/`\t` werden entfernt |

Der Client (`src/api/contact/useContactForm.ts`) spiegelt diese Grenzen nur für schnelles Feedback.
Bei Änderungen **beide** Stellen anpassen; maßgeblich ist der Server.

## Injection-Schutz (`api/_contact/contactMail.ts`)

- `From` und `Reply-To` gehen als `{ name, address }`-Objekte an nodemailer, nie als zusammengesetzter String.
- Name ohne Zeilenumbrüche → Subject nicht manipulierbar.
- Alle Werte im HTML-Teil werden escaped (`& < > " '`), auch E-Mail und Telefon.

## Zeit-Token

`<issuedAtMs>.<HMAC-SHA256>` — zustandslos, vom Server signiert, daher vom Client nicht rückdatierbar.
Der Client wartet vor dem Absenden nötigenfalls die Restzeit ab und wiederholt bei `challenge_failed`
einmal mit frischem Token (z. B. Tab > 2 h offen). Echte Besucher bemerken davon nichts.

Grenze: Ein Token ist innerhalb seiner Gültigkeit mehrfach verwendbar. Einmal-Token bräuchten einen
geteilten Speicher; das Rate-Limit fängt Wiederholungen ab.

## Rate-Limit — Reichweite

Der Zähler liegt im Arbeitsspeicher der Function-Instanz (`api/_contact/rateLimiter.ts`). Er bremst
Bursts zuverlässig, gilt aber **pro Instanz**: nach Kaltstart oder bei parallelen Instanzen/Regionen
beginnt er neu. Für eine harte, instanzübergreifende Grenze zusätzlich eine der Optionen:

- **Vercel WAF Rate-Limit-Regel** auf Pfad `/api/contact` (Dashboard → Firewall). Kein Code, greift vor der Function.
- Geteilter Speicher (z. B. Upstash Redis über den Vercel Marketplace) — neue Dependency.

## Umgebungsvariablen

| Name | Pflicht | Zweck |
|---|---|---|
| `SMTP_USER` | ja | SMTP-Login und Absenderadresse (unverändert) |
| `SMTP_PASS` | ja | SMTP-Passwort (unverändert) |
| `CONTACT_TO` | nein | Empfänger der Anfragen (unverändert) |
| `CONTACT_FORM_SECRET` | nein | Signaturschlüssel für Zeit-Token und Rate-Limit-Keys. Empfohlen: zufällig, ≥ 32 Zeichen |

Ohne `CONTACT_FORM_SECRET` leitet die Function einen eigenen Schlüssel per HMAC aus `SMTP_PASS` ab.
Das Deployment funktioniert also ohne neue Konfiguration. Ein eigener Wert entkoppelt Token-Gültigkeit
vom SMTP-Passwort. Setzen: `vercel env add CONTACT_FORM_SECRET` (Production + Preview). Werte nie committen.

Stellschrauben als Konstanten: `MIN_FILL_TIME_MS`, `MAX_TOKEN_AGE_MS` (`challengeToken.ts`),
`RATE_LIMIT_MAX_REQUESTS`, `RATE_LIMIT_WINDOW_MS`, `MAX_BODY_BYTES` (`handleContactRequest.ts`).

## Datenschutz

- Keine Drittanbieter-Requests, keine Cookies, kein Fingerprinting.
- Die IP dient nur als Rate-Limit-Schlüssel: als HMAC im Arbeitsspeicher, max. bis Fensterende, nie persistiert.
- Logs enthalten nur den Ablehnungsgrund (`honeypot`, `rate_limited`, …), keine Formularinhalte, keine IP.

## Barrierefreiheit

- Honeypot: `aria-hidden`, `tabIndex={-1}`, `autoComplete="off"` — für Screenreader und Tastatur nicht erreichbar.
- Kein CAPTCHA, keine Interaktion. Erfolgs-/Fehlermeldung haben `role="status"` bzw. `role="alert"`.

## Cloudflare Turnstile — bewusst nicht umgesetzt

Technisch möglich (Widget im Formular, `siteverify` per `fetch` in der Function, keine npm-Dependency).
Dagegen spricht aktuell: Drittanbieter-Script mit IP-Übermittlung an Cloudflare (Datenschutzerklärung
anpassen, Consent-Frage klären), zusätzliches Script auf der Landingpage, Cloudflare-Konto und zwei
weitere Secrets. Die Seite liegt auf Vercel, nicht hinter Cloudflare. Empfehlung: erst nachrüsten, wenn
trotz der obigen Maßnahmen Spam durchkommt — dann als Schritt 7 mit Pflicht-Serververifizierung in
`handleContactRequest.ts`. Plattformnahe Alternative: Vercel BotID.

## Tests

```bash
bun test          # api/_contact/*.test.ts
```

Abgedeckt: normale Anfrage, Honeypot-Treffer, zu schnelle/abgelaufene/gefälschte Token, ungültige
Eingaben je Feld, Header-/HTML-Injection, fremde Origin, Übergröße, Rate-Limit inkl. Fensterablauf.
Nicht abgedeckt: echter SMTP-Versand und der Browser-Flow — nach dem Deploy einmal im Preview absenden.

## Dateien

- `api/contact.ts` — dünner Vercel-Handler (Env, Transporter, Response).
- `api/_contact/` — Kernlogik; der Unterstrich verhindert, dass Vercel daraus eigene Routen macht.
  Relative Imports dort brauchen die Endung `.js` (ESM-Function, `"type": "module"`).
- `src/api/contact/useContactForm.ts`, `src/components/Landing/ContactForm.tsx` — Token-Abruf, Honeypot-Feld, Fehlermeldungen.
- `tsconfig.api.json` — `api/` läuft jetzt im Type-Check von `bun run build` mit.

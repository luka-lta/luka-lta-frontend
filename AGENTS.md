# AGENTS.md

Leitfaden für Codex in diesem Repo. Gesamtsystem-Überblick: ../luka-lta-api/CLAUDE.md

## Zweck

Öffentliches Portfolio ("Luka Dev Studio") für **potenzielle Kunden**. Jede Änderung wird daran
gemessen: lädt sie schnell, ist sie indexierbar, ist sie bedienbar, sieht sie sauber aus.
Das Repo heißt `luka-lta-frontend`, das Verzeichnis `luka-lta`.

## Befehle

```bash
bun run dev       # Vite-Dev-Server (Port 5173)
bun run build     # tsc -b (Type-Check) + vite build → dist/
bun run lint      # ESLint
bun run preview   # Produktions-Build lokal servieren
```

Kein Test-Runner eingerichtet — Verifikation läuft über `bun run build` (Type-Check) + `bun run lint`
+ Blick in den Browser. Nicht behaupten, etwas sei getestet.

**Lockfile-Falle**: `bun.lock` und `package-lock.json` liegen beide im Repo. `bun` ist gesetzt;
`package-lock.json` ist Altlast und wird nicht gepflegt.

## Architektur-Eigenheiten

- `src/components/Landing/` — Sektionen der Startseite; `src/feature/<name>/` — in sich geschlossene
  Unterseiten; `src/components/ui/` — shadcn/Radix-Primitives (generiert, nicht händisch umbauen).
- `src/lib/projects-data.ts` — Portfolio-Projekte sind hier **hardcodiert**. Die API hat inzwischen
  `GET /api/v1/projects`; solange die Umstellung nicht passiert ist, ist diese Datei die Quelle.
- `src/lib/fetchWrapper.ts` — HTTP-Client, setzt `X-Api-Key`. **Bug-Falle**: prüft
  `response.status > 400`, ein echter 400 rutscht als Erfolg durch und scheitert erst am Zod-Parse.
- `api/contact.ts` — Vercel Serverless Function (Node), **nicht** Teil des Vite-Builds. Versendet
  per nodemailer über SMTP. Läuft nicht im `vite dev`-Server, nur auf Vercel bzw. `vercel dev`.
- `vercel.json` rewritet alles außer `/api/*` auf `/` (SPA-Fallback). Neue serverlose Route →
  Rewrite prüfen.
- Analytics zweigleisig: Vercel Analytics/Speed Insights + `@trackspire/sdk` (Init in `src/App.tsx`),
  dazu Google-Tag über `vite-plugin-radar`, gated durch das Cookie-Consent in
  `src/components/blocks/cookie-consent`. Neues Tracking **immer** hinter Consent.

## Konventionen

- **TypeScript strict, kein `any`** (aktuell null Vorkommen — so halten). Unbekannte Daten als
  `unknown` annehmen und mit Zod parsen (`src/lib/ApiSchema.ts`).
- Imports über `@/` (Alias auf `src/`), nicht relativ hochnavigieren.
- 2 Spaces, Semikolons, Imports ohne Datei-Endung bei neuen Dateien.
- Farben über CSS-Variablen in `src/index.css`, nicht in `tailwind.config.js` hart eintragen.
  Dark/Light über `ThemeProvider` in `src/assets/providers/`, Tailwind-Strategie `class`.

### SEO (manuell gepflegt — nichts generiert das)

- Jede Seite rendert `<SEO>` (`src/components/SEO.tsx`): Title, Description, Canonical, hreflang,
  OG/Twitter. Neue Route ohne `<SEO>` = unvollständig.
- `public/sitemap.xml` und `public/robots.txt` sind handgeschrieben. Neue öffentliche Route →
  Sitemap-Eintrag ergänzen; interne/technische Routen `noIndex` setzen.
- `BASE_URL` in `SEO.tsx` ist hardcodiert.

### i18n

- i18next, Default **de**, Fallback **en**, Sprache in `localStorage` (`i18n-lang`).
- Neuer Text → Key in **beide** `src/i18n/locales/{de,en}/translation.json`. Keine Strings
  fest in Komponenten.

### Performance / Barrierefreiheit

- Three.js / React Three Fiber, Framer Motion und tsparticles sind die schweren Brocken.
  Neue schwere Abhängigkeit oder 3D-Szene: lazy laden und Bundle-Auswirkung nennen.
- Animationen `prefers-reduced-motion` respektieren.
- Interaktive Elemente brauchen erreichbaren Fokus und Accessible Name; Radix-Primitives nutzen
  statt `div` mit `onClick`.
- Bilder in `public/static/` mit Dimensionen einbinden (kein Layout-Shift).

## Nicht tun

- Keine neuen Dependencies ohne Rückfrage — hier zählt jedes KB im Bundle.
- `.env*` nie anfassen; Keys/SMTP-Daten nie in Code, Doku oder Commit. Alles Client-seitige
  (`VITE_*`) ist im Bundle sichtbar — keine Geheimnisse dort ablegen.
- Keine `noIndex`-Flags oder Robots-Regeln auf öffentlichen Seiten setzen.
- `src/components/ui/`-Primitives nicht umschreiben; Varianten per `cva`/Wrapper ergänzen.
- Kein Tracking vor Consent, keine personenbezogenen Daten in Analytics-Props.
- `AGENTS.md` ist die Codex-Kopie dieser Datei — bei Änderungen hier mitziehen oder darauf verweisen.

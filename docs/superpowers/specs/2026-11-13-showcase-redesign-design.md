# Showcase-Redesign der Portfolio-Startseite

Stand: 2026-11-13 · Status: freigegeben

## Absicht

Die öffentliche Portfolio-Seite (`luka-lta-frontend`) bekommt den Look und das Interaktionsgefühl von
[niessen.dev](https://niessen.dev/): dunkel, cineastisch, ein 3D-Objekt als Mittelpunkt im Hero,
technische Mono-Labels als Deko, riesige Display-Typografie, eigener Cursor, Smooth Scroll.

**Warum:** Luka hat niessen.dev gesehen und will, dass potenzielle Kunden beim Besuch denselben
„Wow, der kann was“-Moment erleben. Die Seite soll handwerklich hochwertig wirken, nicht wie ein
Template.

**Was gleich bleibt:** Branding und Funktionsumfang. Es ist ein visueller Umbau, kein inhaltlicher.

## Ziele

- Visueller Stil im Sinne von niessen.dev, Variante „A — Showcase“ (siehe Mockup unten).
- Alle bestehenden Features funktionieren danach genauso wie vorher.
- Die Seite bleibt schnell, indexierbar und barrierearm (Maßstab aus `CLAUDE.md`).

## Nicht-Ziele

- Keine neuen Inhalte, keine neuen Texte über das hinaus, was neue UI-Elemente brauchen
  (z. B. Mono-Labels wie `01 / PROJEKTE`, Cursor-Labels, „Motion pausieren“).
- Kein neues Branding, kein neues Logo, keine neuen Farben oder Schriften.
- Kein Umbau von `api/contact.ts` oder der Spam-Schutz-Logik in `api/_contact/`.
- Keine Migration auf ein anderes Framework (bleibt Vite + React 18 + Tailwind).
- Unterseiten (`/links`, `/privacy`, `/impressum`, `/redirect/:clickTag`) werden nur so weit
  angepasst, dass sie im neuen Dark-Look nicht kaputt aussehen; kein Showcase-Treatment dort.

## Anti-Ziele (wäre ein Fehlschlag, selbst wenn es technisch läuft)

- Inhalt ist hinter einer Schranke versteckt: **kein** „Tap to enter“, **kein** Sound-Gate.
- Spürbar langsamere Ladezeit oder Layout-Shift im Hero. Text muss sofort lesbar sein; 3D kommt
  nach.
- 1:1-Kopie von niessens Signatur-Elementen (Glas-„D“, Holo-„Let’s connect“-Footer, seine Texte,
  „Build things that move people“). Stil ja, Identität nein.
- Tracking vor Consent, `noIndex` auf öffentlichen Seiten, verlorene SEO-Tags.
- Animationen, die `prefers-reduced-motion` ignorieren.

## Entschieden (von Luka)

| Thema | Entscheidung |
|---|---|
| Richtung | **A — Showcase**: 3D-Glas-Logo zentral im Hero, großer Name dahinter, Deko-Material-Panel, eigener Cursor, Section-Rail |
| Branding | bleibt: Electric Blue `#3D5CFF`, Cyber Teal `#00D4AA`, Midnight `#0D0D0F`, Sora + DM Mono, „LUKA LIEBENTHAL“, „Your idea, shipped.“, „Luka Dev Studio“ |
| Features | alle bleiben (Liste unten) |
| Theme | **nur noch dunkel**. Hell/Dunkel-Umschalter entfällt. Einzelne helle Sektionen als Kontrast-Akzent erlaubt |
| Hero-Zeichen | **das bestehende Logo** (`public/lds-icon.svg`: 2×2-Raster abgerundeter Quadrate, oben links Blue, oben rechts/unten links Blue 40 %, unten rechts Teal) als 3D-Objekt. **Kein** „L“-Monogramm |
| Intro | kurzes Lade-Intro mit dem Logo, **ohne** Tap-to-enter, **ohne** Sound |
| Mobil | statisches Bild statt 3D; Custom Cursor nur auf Geräten mit feinem Zeiger |
| Motion | `prefers-reduced-motion` schaltet Animationen ab; zusätzlich sichtbarer Button „Motion pausieren“ |
| Smooth Scroll | **Lenis** als neue Dependency freigegeben (~4 KB gz) |

## Bestehende Features, die erhalten bleiben müssen

Aus `src/pages/LandingPage.tsx` und `src/AppRouter.tsx`:

- **Header**: Navigation zu Anchors (`about`, `services`, `projects`, `skills`, `contact`), Link `/links`,
  externer Link Status-Seite, Sprachumschalter DE/EN (`i18n-lang` in `localStorage`),
  `FullScreenMenu` für Mobil. Der `ModeToggle` entfällt (Theme fix dunkel).
- **Hero**: Verfügbarkeits-Badge, Name, Rolle, Beschreibung, CTAs „Kontakt aufnehmen“ /
  „Projekte ansehen“, Ort „Hameln, DE“, Tagline, Social-Links.
- **About**: Text + Kennzahlen (Jahre Erfahrung, Projekte, Technologien).
- **Projects**: Projekte aus der API (`GET /api/v1/projects`), Klick navigiert auf
  `/project/:slug`. Detailseite bleibt eigene Route (SEO, Canonical) – **kein** Umbau auf Dialog.
- **Skills**, **Services** (inkl. CTA), **Timeline**, **Marquee**.
- **ContactForm** mit Honeypot, Challenge-Token, Validierung – nur Optik ändern, Logik und
  Feld-Namen nicht anfassen.
- **Footer**: Rechtliches (Privacy, Impressum), Tagline, Newsletter-Feld, Copyright.
- **Cookie-Consent** (`src/components/blocks/cookie-consent.tsx`), Analytics hinter Consent.
- `FloatingScrollToTop`, `<SEO>` auf jeder Seite, i18n für jeden neuen String in `de` **und** `en`.
- Projekt-Detailseite `/project/:projectId` bekommt den neuen Look (gleiche Tokens, Typo, Cursor).

## Gestaltung im Detail

### Globale Elemente

- **Tokens**: Farben bleiben als CSS-Variablen in `src/index.css`. Da es kein Light-Theme mehr
  gibt, werden die `.dark`-Werte zu den `:root`-Werten; zusätzlich eine `.section-light`-Variante
  für helle Kontrast-Sektionen (heller Hintergrund, dunkler Text, dieselben Akzentfarben).
- **Typografie**: Sora für Display und Fließtext, DM Mono für Labels. Display-Überschriften sehr
  groß über `clamp()`. Mono-Labels in Versalien mit Laufweite, Format `NN / ABSCHNITT`.
- **Section-Header**: jede Sektion bekommt oben eine Zeile mit zwei Mono-Labels
  (links `01 / ÜBER MICH`, rechts ein kurzer Kontext-Satz), wie bei niessen.dev.
- **Section-Rail**: schmale vertikale Navigation am rechten Rand (Desktop), markiert aktive
  Sektion. Echte Links mit Accessible Name.
- **Custom Cursor**: Kreis, der dem Zeiger folgt, mit Kontext-Label (`OPEN` über Projekten,
  `DRAG` über dem 3D-Objekt / Karussell, Pfeil über Links). Nur bei `(pointer: fine)`, nativer
  Cursor bleibt für Tastatur/Fokus unberührt, `aria-hidden`.
- **Smooth Scroll**: Lenis global; Anchor-Links laufen über Lenis. Scrollbare Bereiche (Menü,
  Dialoge) mit `data-lenis-prevent`. Bei reduzierter Bewegung oder „Motion pausieren“ aus.
- **Reveal-Animationen**: Überschriften und Blöcke blenden beim Scrollen ein (Framer Motion ist
  vorhanden).
- **Motion pausieren**: fester Button (unten), stoppt 3D-Rotation, Hintergrund-Animationen,
  Lenis-Smoothing. Zustand pro Besucher in `localStorage`.
- **Lade-Intro** *(Claudes Entscheidung)*: **kein** Vollbild-Overlay. Das Logo zeichnet
  sich an seiner Hero-Position als SVG-Kontur (vier Quadrate) (Ziel unter ~1,5 s), daneben ein kleiner Mono-Zähler
  `000 / 100`, der den Ladezustand des 3D-Chunks spiegelt. Hero-Text ist von Anfang an sichtbar
  (LCP unberührt). Sobald die 3D-Szene bereit ist, blendet sie über die Linienzeichnung. Läuft
  einmal pro Session (`sessionStorage`), danach steht direkt das statische Zeichen da. Bei
  reduzierter Bewegung kein Intro.

### Hero

- Großer Name „LUKA“ / „LIEBENTHAL“ als Hintergrund-Ebene, davor das **Logo als 3D-Objekt**:
  vier abgerundete Quader im 2×2-Raster mit Abstand, glasartig (React Three Fiber,
  `MeshPhysicalMaterial` mit Transmission), eingefärbt in den Logo-Farben inkl. der 40-%-Abstufung,
  langsam rotierend, per Maus drehbar. Die vier Teile dürfen sich leicht unabhängig bewegen
  (z. B. auseinanderdriften beim Drehen), solange das Logo erkennbar bleibt.
- Dekoratives Material-Panel und Achsen-Werte (wie niessen.dev) als „Engineer“-Signal.
- Hintergrund: feines Raster, das zur Mitte hin sichtbar ist.
- Unten: „scroll to explore ↓“-Hinweis, Rolle, Ort, Tagline, Socials, CTAs.
- Die 3D-Szene wird **lazy** geladen (eigener Chunk) und erst nach dem ersten Paint gestartet.
  Bis dahin und auf Mobil: statisches Bild des Logos mit festen Dimensionen (kein Layout-Shift).

### Sektionen

- **Projects**: horizontales Karussell großer Karten (Embla ist vorhanden) mit Drag, Pfeil-Buttons,
  Zähler `01 / 05`. Karte zeigt Cover/Logo, Kicker-Label, Titel; Klick → `/project/:slug`.
  *(Claudes Entscheidung)*: **alle** API-Projekte im Karussell, „Alle anzeigen“ entfällt. Das erste
  Projekt bleibt Startkarte; das Tracking-Prop `featured` in `track('project_click', …)` bleibt
  erhalten (`true` für das erste Projekt), damit bestehende Auswertungen weiter stimmen.
- **About**: helle Kontrast-Sektion, große Begrüßung, Kennzahlen als Mono-Stats.
- **Services / Skills / Timeline**: dunkel, große Überschrift, Inhalte als Listen/Raster mit
  Mono-Labels und feinen Linien statt Karten-Boxen.
- **Marquee**: bleibt, im neuen Stil.
- **Contact**: großes Abschluss-Statement (eigener Text aus bestehenden Keys, z. B.
  `contact.headline_1/2`), darunter das bestehende Formular im neuen Look.
- **Footer**: im neuen Stil, gleiche Inhalte.

### Mockup

Gewählte Richtung A: `.superpowers/brainstorm/80415-1794524846/content/hero-direction-v2.html`
(lokal, per `.gitignore` ausgeschlossen). Achtung: Im Mockup ist das Objekt eine Glas-Kachel mit
„L“ – maßgeblich ist das Logo (Zeile „Hero-Zeichen“).

## Randbedingungen

- Vite + React 18 + TypeScript strict, kein `any`, Tailwind, shadcn-Primitives in
  `src/components/ui/` nicht umschreiben.
- Keine weiteren neuen Dependencies außer Lenis ohne Rückfrage. `three`, `@react-three/fiber`,
  `@react-three/drei`, `framer-motion`, `embla-carousel-react` sind bereits installiert.
- **Bundle**: `three`/R3F werden derzeit nirgends importiert, landen also durch den Hero neu im
  Bundle. Pflicht: eigener Lazy-Chunk, nicht im Initial-Bundle. Größe des Chunks im Ergebnis nennen.
  *(Claudes Entscheidung)*: Budget für den 3D-Chunk ≤ 250 KB gzip; Initial-Bundle darf nicht
  wachsen außer um Lenis. Kein `drei`-`<Environment preset>` (lädt von externem CDN, vor Consent):
  Umgebungslicht lokal erzeugen (z. B. `RoomEnvironment` + `PMREMGenerator`), keine HDR-Datei.
  `drei` nur, wenn ein Helper klar Code spart; sonst reines R3F.
- Bilder in `public/static/` mit Dimensionen.
- Barrierefreiheit: Skip-Link, Fokus sichtbar, alle Interaktionen per Tastatur, ARIA am Karussell,
  Deko (`canvas`, Cursor, Panel) `aria-hidden`.
- SEO unverändert vollständig; `sitemap.xml` braucht keine Änderung (keine neuen Routen).

## Dem Builder überlassen

- Exakte Abstände, Größen, Easing-Kurven, Intro-Timing (im Rahmen der Anti-Ziele).
- Ob die Quader als `RoundedBox`-artige Geometrie, Extrusion oder Modell entstehen.
- Wie die Section-Rail die aktive Sektion erkennt.
- Aufteilung in Komponenten und Reihenfolge der Umsetzung.
- Welche Sektion(en) außer About hell werden (höchstens zwei).

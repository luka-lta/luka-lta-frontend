# Showcase-Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Die Portfolio-Startseite bekommt den dunklen Showcase-Look (3D-Glas-Logo im Hero, Mono-Labels, Section-Rail, Custom Cursor, Smooth Scroll), ohne Branding oder Funktionsumfang zu ändern.

**Architecture:** Eine kleine Motion-Schicht (`src/lib/motion/`) entscheidet zentral, ob Bewegung erlaubt ist (System-Einstellung + „Motion pausieren“), und steuert Framer Motion, Lenis, Cursor und 3D. Gemeinsame Sektions-Bausteine (`SectionHeader`, `SectionRail`, Sektionsliste) ersetzen die bisherigen `— 0N`-Labels. Die 3D-Szene ist ein eigener Lazy-Chunk; davor und auf Mobil steht das Logo als SVG.

**Tech Stack:** Vite, React 18, TypeScript strict, Tailwind, Framer Motion, React Three Fiber 8 / three 0.171, Embla (über `src/components/ui/carousel.tsx`), Lenis (neu), i18next, `bun test` für reine Logik.

**Spec:** `docs/superpowers/specs/2026-11-13-showcase-redesign-design.md`

## Global Constraints

- Branding unverändert: Electric Blue `#3D5CFF`, Cyber Teal `#00D4AA`, Midnight `#0D0D0F`, Sora + DM Mono, „LUKA LIEBENTHAL“, „Your idea, shipped.“, „Luka Dev Studio“.
- Nur noch dunkles Theme; helle Sektionen nur über `.section-light`, höchstens zwei (About ist gesetzt).
- Kein „Tap to enter“, kein Sound, kein Vollbild-Overlay. Hero-Text ist ab dem ersten Paint sichtbar.
- Einzige neue Dependency: `lenis`. Sonst nichts installieren.
- 3D-Chunk ≤ 250 KB gzip, nicht im Initial-Bundle; Initial-Bundle wächst nur um Lenis. Kein `<Environment preset>`, keine HDR-Datei, nichts von externen Hosts.
- Jeder neue String als Key in `src/i18n/locales/de/translation.json` **und** `en/translation.json`.
- TypeScript strict, kein `any`, Imports über `@/`, 2 Spaces, Semikolons, keine Datei-Endung bei Imports in neuen Dateien.
- `src/components/ui/*` nicht umschreiben; Varianten über Wrapper/`className`.
- Kontaktformular: nur Optik. Feldnamen, Honeypot, Challenge-Logik, `useContactForm` bleiben unangetastet.
- Tracking-Attribute (`data-trackspire-*`) und `track(...)`-Aufrufe bleiben mit identischen Event-Namen und Props erhalten.
- Deko (`canvas`, Cursor, Material-Panel, Achsen-Werte) ist `aria-hidden`. Jede Interaktion per Tastatur erreichbar, Fokus sichtbar.
- Jede Animation ist aus, wenn `isMotionEnabled === false`.
- Lint-Gate: `bun run lint` hat vorab 5 Fehler in unberührten Dateien (`chart.tsx`, `use-toast.ts`, `links/*`). Maßstab: keine **neuen** Fehler, geprüft mit `bunx eslint <geänderte Dateien>`.

## Review Focus

1. **Nur Tastatur**: Tab durch Header → Hero-CTAs → Karussell (Pfeile + Karten) → Formular; Section-Rail-Links springen korrekt (Lenis-Offset unter dem Header), Fokusring immer sichtbar, Custom Cursor stört nie. → Task 3, Task 7 (manuelle Prüfschritte), Task 12.
2. **„Bewegung reduzieren“ an**: kein Intro, kein Lenis, keine Auto-Rotation, keine Reveal-Verschiebung, Cursor aus. → Tests in Task 1 und Task 5 (`isMotionEnabled`, `shouldPlayIntro`).
3. **Kein WebGL / Kontextverlust / schwaches Gerät**: Hero zeigt das statische Logo, kein Fehler, kein Layout-Shift. → Test in Task 6 (`canRender3D`), Error-Boundary-Schritt in Task 6.
4. **Storage blockiert** (privates Fenster, `localStorage` wirft): Seite rendert, Intro läuft einfach, Motion-Pause funktioniert für die Sitzung. → Tests in Task 1 und Task 5 mit werfendem Storage.
5. **API liefert Fehler, 0 oder 1 Projekt**: Projekte-Sektion fehlt bzw. Karussell zeigt `01 / 01` mit deaktivierten Pfeilen; Rail lässt fehlende Sektionen aus. → Test in Task 3 (`pickActiveSection` mit fehlenden IDs), Test in Task 7 (`formatCounter(1, 1)`), Schritt in Task 7.

---

## Dateistruktur

| Datei | Verantwortung |
|---|---|
| `src/lib/motion/motionPreference.ts` | reine Logik: Motion an/aus, Pause-Präferenz laden/speichern |
| `src/lib/motion/MotionProvider.tsx` | Context `useMotion()`, setzt Framer `MotionConfig`, startet/stoppt Lenis |
| `src/lib/motion/smoothScroll.ts` | Lenis-Instanz, `scrollToSection()`, `scrollToTop()` |
| `src/components/MotionToggle.tsx` | fester Button „Motion pausieren / fortsetzen“ |
| `src/components/Landing/sections.ts` | geordnete Liste der Startseiten-Sektionen + Nummern |
| `src/components/Landing/Section/sectionFormat.ts` | `formatSectionIndex`, `formatCounter` |
| `src/components/Landing/Section/SectionHeader.tsx` | Mono-Labelzeile + große Überschrift |
| `src/components/Landing/Section/Reveal.tsx` | Einblenden beim Scrollen |
| `src/components/Landing/SectionRail/activeSection.ts` | reine Logik: aktive Sektion bestimmen |
| `src/components/Landing/SectionRail/SectionRail.tsx` | rechte Rail-Navigation |
| `src/components/Cursor/cursorVariant.ts` | `parseCursorVariant` |
| `src/components/Cursor/CustomCursor.tsx` | folgender Kreis mit Label |
| `src/components/Landing/Hero/LogoMark.tsx` | Logo als SVG (`solid` / `outline`-Zeichnung) |
| `src/components/Landing/Hero/intro.ts` | `shouldPlayIntro`, `markIntroSeen`, `formatProgress` |
| `src/components/Landing/Hero/sceneSupport.ts` | `canRender3D`, Erkennung der Umgebung |
| `src/components/Landing/Hero/LogoScene.tsx` | R3F-Szene (Lazy-Chunk) |
| `src/components/Landing/Hero/HeroVisual.tsx` | wählt SVG ↔ 3D, Intro, Zähler, Deko-Panel |
| `src/components/Landing/Hero.tsx` | Umbau auf neues Layout (bestehende Datei) |
| übrige `src/components/Landing/*.tsx` | Restyle |

Tests liegen neben der Datei als `*.test.ts` und laufen mit `bun test`.

---

### Task 1: Dark-only, Motion-Schicht, Test-Setup

**Files:**
- Modify: `src/index.css` (Token-Blöcke), `index.html` (`<html lang="de" class="dark">`), `src/App.tsx`, `src/components/Landing/Header.tsx` (nur Theme-Button entfernen), `tsconfig.app.json`
- Delete: `src/assets/providers/ThemeProvider.tsx`, `src/components/mode-toggle.tsx`
- Create: `src/lib/motion/motionPreference.ts`, `src/lib/motion/MotionProvider.tsx`, `src/components/MotionToggle.tsx`
- Test: `src/lib/motion/motionPreference.test.ts`

**Interfaces:**
- Produces:
  - `MOTION_PAUSED_STORAGE_KEY = 'motion-paused'`
  - `isMotionEnabled(prefersReducedMotion: boolean, isPausedByUser: boolean): boolean`
  - `loadPausedPreference(storage: Storage | null): boolean`
  - `savePausedPreference(storage: Storage | null, isPaused: boolean): void`
  - `useMotion(): { isMotionEnabled: boolean; isPausedByUser: boolean; setPausedByUser: (isPaused: boolean) => void }`
  - `<MotionProvider>` (in `App.tsx` an der Stelle von `ThemeProvider`)
  - CSS-Klasse `.section-light`

- [ ] **Step 1: Test-Setup.** In `tsconfig.app.json` `"exclude": ["src/**/*.test.ts"]` ergänzen (sonst bricht `tsc -b` an `bun:test`-Imports).

- [ ] **Step 2: Failing tests schreiben** (`src/lib/motion/motionPreference.test.ts`):

```ts
import { describe, expect, test } from 'bun:test';
import { isMotionEnabled, loadPausedPreference, savePausedPreference, MOTION_PAUSED_STORAGE_KEY } from './motionPreference';

const memoryStorage = (initial: Record<string, string> = {}): Storage => {
  const data = new Map(Object.entries(initial));
  return {
    get length() { return data.size; },
    clear: () => data.clear(),
    getItem: (key) => data.get(key) ?? null,
    key: (index) => [...data.keys()][index] ?? null,
    removeItem: (key) => { data.delete(key); },
    setItem: (key, value) => { data.set(key, value); },
  };
};
const throwingStorage = (): Storage => ({
  ...memoryStorage(),
  getItem: () => { throw new Error('SecurityError'); },
  setItem: () => { throw new Error('QuotaExceededError'); },
});

describe('isMotionEnabled', () => {
  test.each([
    [false, false, true],
    [true, false, false],
    [false, true, false],
    [true, true, false],
  ])('reduced=%p paused=%p → %p', (reduced, paused, expected) => {
    expect(isMotionEnabled(reduced, paused)).toBe(expected);
  });
});

describe('pause preference', () => {
  test('shouldDefaultToNotPausedWhenNothingStored', () => {
    expect(loadPausedPreference(memoryStorage())).toBe(false);
  });
  test('shouldRoundTripPausedState', () => {
    const storage = memoryStorage();
    savePausedPreference(storage, true);
    expect(storage.getItem(MOTION_PAUSED_STORAGE_KEY)).toBe('1');
    expect(loadPausedPreference(storage)).toBe(true);
  });
  test('shouldTreatUnknownValueAsNotPaused', () => {
    expect(loadPausedPreference(memoryStorage({ [MOTION_PAUSED_STORAGE_KEY]: 'yes' }))).toBe(false);
  });
  test('shouldNotThrowWhenStorageIsBlocked', () => {
    expect(loadPausedPreference(throwingStorage())).toBe(false);
    expect(() => savePausedPreference(throwingStorage(), true)).not.toThrow();
  });
  test('shouldHandleMissingStorage', () => {
    expect(loadPausedPreference(null)).toBe(false);
  });
});
```

- [ ] **Step 3: Test laufen lassen.** `bun test src/lib/motion` → FAIL (Modul fehlt).

- [ ] **Step 4: `motionPreference.ts` implementieren.** Gespeichert wird `'1'` / Key entfernt; jeder Storage-Zugriff in `try/catch`.

- [ ] **Step 5: Test laufen lassen.** `bun test src/lib/motion` → PASS.

- [ ] **Step 6: `MotionProvider.tsx`.** Liest `prefers-reduced-motion` per `matchMedia` (inkl. Change-Listener) und die Pause-Präferenz aus `window.localStorage` (Zugriff auf `window.localStorage` selbst in `try/catch`, sonst `null`). Rendert `<MotionConfig reducedMotion={isMotionEnabled ? 'never' : 'always'}>`. Setzt `data-motion="on|off"` auf `document.documentElement` (für CSS-Animationen wie Marquee).

- [ ] **Step 7: `MotionToggle.tsx`.** Fester Button unten links (`fixed bottom-6 left-6 z-50`), DM Mono, Versalien, `aria-pressed={isPausedByUser}`, Text aus `motion.pause` / `motion.resume`. Neue i18n-Keys: `motion.pause` „Motion pausieren“ / „Pause motion“, `motion.resume` „Motion fortsetzen“ / „Resume motion“. In `App.tsx` neben `FloatingScrollToTop` einhängen.

- [ ] **Step 8: Dark-only.** In `src/index.css`: Werte aus `.dark` werden die `:root`-Werte; der bisherige `:root`-(Light-)Block wird zu `.section-light { … }` (gleiche Variablennamen, plus `color: hsl(var(--foreground)); background: hsl(var(--background));`). `.dark`-Block entfernen. `index.html`: `class="dark"` am `<html>` (hält die `dark:`-Varianten in `ContactForm.tsx` aktiv). `ThemeProvider` und `mode-toggle.tsx` löschen, Theme-Button und `useTheme`/`MoonIcon`/`SunIcon`-Imports aus `Header.tsx` entfernen.

- [ ] **Step 9: Verifizieren.** `bun test` → alle PASS. `bun run build` → ohne Fehler. `bunx eslint src/lib/motion src/components/MotionToggle.tsx src/App.tsx src/components/Landing/Header.tsx` → keine Fehler. `bun run dev`: Seite dunkel, kein Theme-Button, Motion-Button schaltet `data-motion` am `<html>` um.

- [ ] **Step 10: Commit.** `git commit -m "feat: dark-only theme and central motion preference"`

---

### Task 2: Smooth Scroll mit Lenis

**Files:**
- Create: `src/lib/motion/smoothScroll.ts`
- Modify: `package.json`/`bun.lock` (via `bun add lenis`), `src/lib/motion/MotionProvider.tsx`, `src/main.tsx` (CSS-Import), `src/components/Landing/Header.tsx` (`scrollToSection`), `src/components/FloatingScrollToTop.tsx`

**Interfaces:**
- Consumes: `useMotion()` aus Task 1.
- Produces:
  - `HEADER_OFFSET_PX = 80` (Doc-Comment: Höhe des fixen Headers)
  - `startSmoothScroll(): void`, `stopSmoothScroll(): void`
  - `scrollToSection(id: string): void` — Lenis `scrollTo('#id', { offset: -HEADER_OFFSET_PX })` wenn aktiv, sonst `element.scrollIntoView({ behavior: 'auto' })` + `scroll-margin-top`.
  - `scrollToTop(): void`

- [ ] **Step 1: Dependency.** `bun add lenis` (aktuelle 1.x). `import 'lenis/dist/lenis.css'` in `src/main.tsx`.
- [ ] **Step 2: `smoothScroll.ts`** mit einer modulweiten Instanz und `requestAnimationFrame`-Loop; `stopSmoothScroll` ruft `destroy()` und beendet den Loop.
- [ ] **Step 3: MotionProvider** startet Lenis bei `isMotionEnabled === true`, stoppt bei `false` und beim Unmount.
- [ ] **Step 4: Aufrufer umstellen.** `Header.scrollToSection` und `FloatingScrollToTop` nutzen `scrollToSection` / `scrollToTop`. Der bestehende Routen-Wechsel (`navigate('/')` + `setTimeout`) bleibt. Scrollbare Overlays (Mobilmenü) bekommen `data-lenis-prevent`.
- [ ] **Step 5: Verifizieren.** `bun run build` ohne Fehler. Im Browser: Mausrad scrollt weich; Nav-Klick landet mit Überschrift sichtbar unter dem Header; Motion pausieren → natives Scrollen; Tab-Fokus auf Elemente unterhalb des Viewports scrollt sie in Sicht. Größe des Haupt-Chunks vorher/nachher aus der Build-Ausgabe notieren (Erwartung: + ≤ 6 KB gzip).
- [ ] **Step 6: Commit.** `git commit -m "feat: smooth scrolling with lenis"`

---

### Task 3: Sektions-Bausteine und Section-Rail

**Files:**
- Create: `src/components/Landing/sections.ts`, `src/components/Landing/Section/sectionFormat.ts`, `src/components/Landing/Section/SectionHeader.tsx`, `src/components/Landing/Section/Reveal.tsx`, `src/components/Landing/SectionRail/activeSection.ts`, `src/components/Landing/SectionRail/SectionRail.tsx`
- Modify: `src/pages/LandingPage.tsx` (Rail einhängen), `src/components/Landing/Hero.tsx` (`id="top"` an der Section), `src/components/Landing/Timeline.tsx` (`id="timeline"`), beide `translation.json`
- Test: `src/components/Landing/Section/sectionFormat.test.ts`, `src/components/Landing/SectionRail/activeSection.test.ts`

**Interfaces:**
- Produces:
  - `type LandingSectionId = 'top' | 'about' | 'projects' | 'skills' | 'services' | 'timeline' | 'contact'`
  - `LANDING_SECTIONS: ReadonlyArray<{ id: LandingSectionId; navKey: string }>` in genau dieser Reihenfolge (entspricht `LandingPage`).
  - `getSectionNumber(id: LandingSectionId): number` (`about` → 1 … `contact` → 6; `top` → 0)
  - `formatSectionIndex(position: number): string` → `'01'`
  - `formatCounter(current: number, total: number): string` → `'01 / 05'`
  - `pickActiveSection(entries: ReadonlyArray<{ id: string; ratio: number }>, fallbackId: string): string`
  - `<SectionHeader id: LandingSectionId; title: ReactNode; className?: string />` — Zeile: links `{NN} / {sections.<id>.label}`, rechts `sections.<id>.context`, darunter `h2` mit `title`.
  - `<Reveal as?: 'div' | 'li'; delay?: number>` — `whileInView` opacity 0→1, y 24→0, `viewport={{ once: true, margin: '-10%' }}`; ohne Motion statisch sichtbar.

- [ ] **Step 1: Failing tests:**

```ts
// sectionFormat.test.ts
test.each([[1, '01'], [9, '09'], [10, '10'], [123, '123']])('formatSectionIndex(%p)', (n, s) =>
  expect(formatSectionIndex(n)).toBe(s));
test.each([[1, 5, '01 / 05'], [1, 1, '01 / 01'], [12, 12, '12 / 12']])('formatCounter(%p, %p)', (c, t, s) =>
  expect(formatCounter(c, t)).toBe(s));

// activeSection.test.ts
test('shouldPickSectionWithHighestRatio', () =>
  expect(pickActiveSection([{ id: 'about', ratio: 0.2 }, { id: 'projects', ratio: 0.6 }], 'top')).toBe('projects'));
test('shouldPreferEarlierSectionOnTie', () =>
  expect(pickActiveSection([{ id: 'about', ratio: 0.5 }, { id: 'projects', ratio: 0.5 }], 'top')).toBe('about'));
test('shouldFallBackWhenNothingVisible', () =>
  expect(pickActiveSection([{ id: 'about', ratio: 0 }], 'top')).toBe('top'));
test('shouldFallBackOnEmptyList', () =>
  expect(pickActiveSection([], 'top')).toBe('top'));
```

- [ ] **Step 2: Tests laufen lassen** → FAIL. **Step 3: Implementieren.** **Step 4:** `bun test` → PASS.

- [ ] **Step 5: i18n-Keys** unter `sections` (DE / EN):

| id | label | context |
|---|---|---|
| about | ÜBER MICH / ABOUT | HAMELN, DE / HAMELN, DE |
| projects | PROJEKTE / WORK | ZIEHEN ODER SCROLLEN ↔ / DRAG OR SCROLL ↔ |
| skills | SKILLS / SKILLS | STACK & WERKZEUGE / STACK & TOOLS |
| services | LEISTUNGEN / SERVICES | FÜR IHR UNTERNEHMEN / FOR YOUR BUSINESS |
| timeline | WERDEGANG / JOURNEY | MEIN WEG / MY PATH |
| contact | KONTAKT / CONTACT | ANTWORT IN 24 H / REPLY WITHIN 24 H |

  Plus `nav.top` „Start“ / „Top“, `nav.timeline` „Werdegang“ / „Journey“, `rail.label` „Abschnitte“ / „Sections“.

- [ ] **Step 6: `SectionRail.tsx`.** `<nav aria-label={t('rail.label')}>` fest rechts mittig, nur ab `lg`. Je Sektion ein `<a href="#id">` mit Accessible Name aus `navKey`, Klick → `preventDefault` + `scrollToSection`. Sichtbar: kurzer Strich, aktiver Eintrag länger und Teal, Label erscheint bei Hover/Fokus. IntersectionObserver (`threshold: [0, 0.25, 0.5, 0.75, 1]`) beobachtet nur IDs, die im DOM existieren (Projekte können fehlen); aktiv über `pickActiveSection`; aktiver Link `aria-current="location"`.

- [ ] **Step 7: Verifizieren.** `bun run build`, `bunx eslint` auf neue Dateien. Browser: Rail markiert beim Scrollen die richtige Sektion; per Tab erreichbar; mit API-Fehler (DevTools: Request blockieren) fehlt der Projekte-Eintrag ohne Fehler.
- [ ] **Step 8: Commit.** `git commit -m "feat: section header, reveal and section rail"`

---

### Task 4: Custom Cursor

**Files:**
- Create: `src/components/Cursor/cursorVariant.ts`, `src/components/Cursor/CustomCursor.tsx`
- Modify: `src/App.tsx` (einhängen), beide `translation.json`
- Test: `src/components/Cursor/cursorVariant.test.ts`

**Interfaces:**
- Consumes: `useMotion()`.
- Produces: `type CursorVariant = 'default' | 'link' | 'open' | 'drag'`; `parseCursorVariant(value: string | null): CursorVariant`; Konvention: Elemente setzen `data-cursor="open" | "drag"`; `a`/`button` ohne Attribut → `'link'`.

- [ ] **Step 1: Failing test:** `parseCursorVariant('open')` → `'open'`, `'drag'` → `'drag'`, `null` → `'default'`, `''` → `'default'`, `'OPEN'` → `'default'`, `'unknown'` → `'default'`.
- [ ] **Step 2:** `bun test src/components/Cursor` → FAIL. **Step 3:** implementieren. **Step 4:** → PASS.
- [ ] **Step 5: `CustomCursor.tsx`.** Rendert nur, wenn `matchMedia('(pointer: fine)')` und `isMotionEnabled`. `aria-hidden`, `pointer-events: none`, `position: fixed`, Bewegung per `transform` in `requestAnimationFrame` mit Nachlauf (Lerp). Kreis 12 px (`default`), 40 px Ring (`link`), 72 px Ring mit Label (`open`/`drag`, i18n `cursor.open` „ÖFFNEN“ / „OPEN“, `cursor.drag` „ZIEHEN“ / „DRAG“). Variante per `pointerover` + `closest('[data-cursor], a, button')`. Nativer Cursor bleibt sichtbar (kein `cursor: none`) – Spec: nativer Cursor bleibt unberührt.
- [ ] **Step 6: Verifizieren.** Build + eslint. Browser: Ring folgt, wechselt über Links; Motion pausieren → Cursor weg; Touch-Emulation in DevTools → nicht gerendert.
- [ ] **Step 7: Commit.** `git commit -m "feat: context-aware custom cursor"`

---

### Task 5: Hero-Layout, Logo-SVG und Intro

**Files:**
- Create: `src/components/Landing/Hero/LogoMark.tsx`, `src/components/Landing/Hero/intro.ts`, `src/components/Landing/Hero/HeroVisual.tsx`
- Modify: `src/components/Landing/Hero.tsx`, beide `translation.json`
- Test: `src/components/Landing/Hero/intro.test.ts`

**Interfaces:**
- Consumes: `useMotion()`, `scrollToSection`.
- Produces:
  - `INTRO_SEEN_STORAGE_KEY = 'intro-seen'`
  - `shouldPlayIntro(storage: Storage | null, isMotionEnabled: boolean): boolean`
  - `markIntroSeen(storage: Storage | null): void`
  - `formatProgress(percent: number): string` → dreistellig, auf 0…100 geklemmt, gerundet
  - `<LogoMark variant: 'solid' | 'outline'; isDrawing?: boolean; className?: string />` — `viewBox="0 0 120 120"`, die vier Quadrate exakt wie `public/lds-icon.svg` (ohne Hintergrund-Rect), `outline` zeichnet Konturen per `stroke-dasharray`-Animation.
  - `<HeroVisual />` — Container mit fester `aspect-ratio: 1` und expliziter Breite; in Task 6 um die 3D-Szene erweitert.

- [ ] **Step 1: Failing tests** (Storage-Helfer aus Task 1 als lokale Kopie oder gemeinsame `src/test/storage.ts` – Builder-Entscheidung):

```ts
test('shouldPlayOnFirstVisit', () => expect(shouldPlayIntro(memoryStorage(), true)).toBe(true));
test('shouldSkipWhenSeenThisSession', () => {
  const s = memoryStorage(); markIntroSeen(s);
  expect(shouldPlayIntro(s, true)).toBe(false);
});
test('shouldSkipWhenMotionDisabled', () => expect(shouldPlayIntro(memoryStorage(), false)).toBe(false));
test('shouldPlayWhenStorageBlocked', () => expect(shouldPlayIntro(throwingStorage(), true)).toBe(true));
test('shouldNotThrowMarkingWithBlockedStorage', () => expect(() => markIntroSeen(throwingStorage())).not.toThrow());
test.each([[0, '000'], [7, '007'], [42.6, '043'], [100, '100'], [-5, '000'], [140, '100'], [Number.NaN, '000']])(
  'formatProgress(%p)', (p, s) => expect(formatProgress(p)).toBe(s));
```

- [ ] **Step 2:** → FAIL. **Step 3:** implementieren (`sessionStorage`-Aufruferseite übergibt `window.sessionStorage` in `try/catch`). **Step 4:** → PASS.

- [ ] **Step 5: `Hero.tsx` umbauen.** Struktur (`<section id="top">`, `min-h-[100svh]`):
  - Hintergrund: feines Raster per CSS (`background-image` mit zwei `linear-gradient`, `mask-image: radial-gradient(...)`), `aria-hidden`.
  - Ebene 1: `h1` mit „LUKA“ / „LIEBENTHAL“ riesig zentriert (`clamp(4rem, 16vw, 14rem)`, Sora 800, `gradient-text` auf LIEBENTHAL wie bisher), plus `sr-only` Rolle.
  - Ebene 2: `<HeroVisual />` zentriert darüber.
  - Unten-Leiste: links „scroll to explore ↓“ (`hero.scroll_hint` „Scrollen zum Entdecken“ / „Scroll to explore“), Mitte Tagline, rechts Rolle in Mono.
  - Inhaltsblock unten links: Verfügbarkeits-Badge, `hero.description`, beide CTAs (mit unveränderten `data-trackspire-*`), Ort „Hameln, DE“, Social-Links (unverändert inkl. Tracking).
  - Mobil (< `md`): Name oben, Logo darunter kleiner, dann Inhaltsblock; nichts überlappt Text.
- [ ] **Step 6: `HeroVisual.tsx` (ohne 3D).** Zeigt `LogoMark variant="solid"`. Wenn `shouldPlayIntro`: erst `outline` mit `isDrawing`, daneben Mono-Zähler `formatProgress(p)` + `/ 100` (aria-hidden) und `role="status"` mit `intro.loading` „Wird geladen“ / „Loading“ (sr-only); nach ≤ 1,5 s Übergang auf `solid`, dann `markIntroSeen`. Fortschritt in diesem Task zeitbasiert; Task 6 koppelt ihn an das Laden des Chunks.
- [ ] **Step 7: Verifizieren.** Build + eslint. Browser: Text ab erstem Paint sichtbar; Intro nur beim ersten Laden pro Tab; DevTools-Emulation `prefers-reduced-motion: reduce` → kein Intro; Lighthouse-Lauf (mobil) zeigt CLS ≤ 0.02 für den Hero.
- [ ] **Step 8: Commit.** `git commit -m "feat: showcase hero layout with drawn logo intro"`

---

### Task 6: 3D-Glas-Logo (Lazy-Chunk)

**Files:**
- Create: `src/components/Landing/Hero/sceneSupport.ts`, `src/components/Landing/Hero/LogoScene.tsx`
- Modify: `src/components/Landing/Hero/HeroVisual.tsx`
- Test: `src/components/Landing/Hero/sceneSupport.test.ts`

**Interfaces:**
- Consumes: `useMotion()`, `LogoMark`, `formatProgress`.
- Produces:
  - `MIN_3D_VIEWPORT_WIDTH = 768` (Doc-Comment: ab Tablet-Breite)
  - `canRender3D(env: { isPointerFine: boolean; viewportWidth: number; hasWebGL2: boolean }): boolean`
  - `detectSceneEnvironment(): { isPointerFine: boolean; viewportWidth: number; hasWebGL2: boolean }` (nicht getestet, DOM)
  - `LogoScene` als **default export** (für `React.lazy`), Props: `{ isMotionEnabled: boolean; onReady: () => void; onRotationChange?: (q: [number, number, number, number]) => void }`

- [ ] **Step 1: Failing tests:** `canRender3D` → `true` nur für `{ isPointerFine: true, viewportWidth: 768, hasWebGL2: true }`; je `false` für `viewportWidth: 767`, `isPointerFine: false`, `hasWebGL2: false`.
- [ ] **Step 2:** → FAIL. **Step 3:** implementieren. **Step 4:** → PASS.
- [ ] **Step 5: `LogoScene.tsx`.** R3F `<Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>`, transparenter Hintergrund. Vier abgerundete Quader (Kantenlänge 1, Abstand 0,2, Tiefe 0,35, Radius 0,12) im 2×2-Raster wie das SVG; `MeshPhysicalMaterial` mit `transmission: 1`, `thickness: 0.6`, `roughness: 0.1`, `ior: 1.45`, `attenuationColor` je Quader: Blue `#3D5CFF` (oben links), Blue mit geringerer Sättigung/Opazität für oben rechts + unten links (40-%-Wirkung über `attenuationDistance` größer), Teal `#00D4AA` (unten rechts). Umgebung: `RoomEnvironment` + `PMREMGenerator` → `scene.environment` (lokal, kein Download). Rotation: langsame Auto-Rotation nur bei `isMotionEnabled`; Ziehen mit Maus dreht die Gruppe (Pointer-Events am Canvas, Trägheit), Element trägt `data-cursor="drag"`. Beim Drehen driften die Quader leicht auseinander und kehren zurück. Kein `<Environment preset>`. `RoundedBox` aus `@react-three/drei` erlaubt; sonst nichts aus drei.
- [ ] **Step 6: `HeroVisual` erweitern.** `const LogoScene = lazy(() => import('./LogoScene'))`; Import erst starten nach `requestIdleCallback` (Fallback `setTimeout` 200 ms) und nur wenn `canRender3D(detectSceneEnvironment())`. Bis `onReady`: SVG sichtbar; danach Crossfade auf Canvas (SVG bleibt im DOM, `aria-hidden`). Error-Boundary um `Suspense`: bei Fehler oder `webglcontextlost` dauerhaft SVG. Intro-Zähler läuft bis 90 zeitbasiert und springt bei `onReady` auf 100.
- [ ] **Step 7: Deko-Panel.** Unten links im Hero (nur `lg`), `aria-hidden`: Titel „LOGO MATERIAL“, zwei statische Balken (roughness 0.10, ior 1.45), Zeile mit Rotationswerten aus `onRotationChange`, auf 2 Nachkommastellen, Format `.00  .12  .00  1.0` (DM Mono). Ohne 3D zeigt es feste Werte.
- [ ] **Step 8: Verifizieren.** `bun run build` → Build-Ausgabe zeigt eigenen Chunk für `LogoScene`; gzip-Größe ≤ 250 KB notieren; Haupt-Chunk unverändert gegenüber Task 5 (± 2 KB). Browser: Network-Tab ohne externe Requests beim Laden der Szene; Drehen per Maus; DevTools „Disable WebGL“ bzw. Mobil-Emulation → SVG, keine Konsole-Fehler.
- [ ] **Step 9: Commit.** `git commit -m "feat: lazy 3d glass logo in hero"`

---

### Task 7: Projekte als Karussell

**Files:**
- Modify: `src/components/Landing/Projects.tsx`, beide `translation.json`

**Interfaces:**
- Consumes: `Carousel`, `CarouselContent`, `CarouselItem`, `CarouselApi` aus `@/components/ui/carousel`; `SectionHeader`, `formatCounter`; `useProjects()`.

- [ ] **Step 1: Umbau.** `SectionHeader id="projects"` mit `t('projects.headline')`. Alle Projekte in einem Embla-Karussell (`opts={{ align: 'start', dragFree: false }}`), Karten ca. 80 % Breite mobil, 60 % ab `lg`. Erste Karte bleibt die Startkarte. „Alle anzeigen“-Button, `INITIAL_VISIBLE` und das `projects_toggle`-Tracking entfallen.
- [ ] **Step 2: Karte.** Großes Bild (bestehende Fallback-Reihenfolge Cover → Screenshot → Logo bleibt inkl. Kommentar), Kicker in Mono (`Client` / Jahr), Titel, Kurzbeschreibung, max. 3 Tech-Tags, Pfeil-Kreis. Echte `<button>`-Karte (statt `div role="button"`), `aria-label` wie bisher, `data-cursor="open"`. Klick und Enter: `track('project_click', { id: project.slug, title: project.name, featured: index === 0 })` **dann** `navigate`. Repo-Link bleibt mit `stopPropagation` (als Geschwister-Element, nicht im Button verschachtelt).
- [ ] **Step 3: Steuerung.** Unter dem Karussell: Beschreibung der aktuellen Karte links, rechts `←` / Zähler `formatCounter(selected + 1, total)` / `→` (Buttons mit `projects.prev` „Vorheriges Projekt“ / „Previous project“, `projects.next` „Nächstes Projekt“ / „Next project“). Pfeile `disabled`, wenn `canScrollPrev/Next` false. Region `aria-roledescription="carousel"`, `aria-label={t('projects.carousel_label')}` („Ausgewählte Projekte“ / „Selected projects“). Bereich trägt `data-cursor="drag"`, Karten `open`. Fortschrittsbalken unten (Breite = selected/total).
- [ ] **Step 4: Ladezustand und Fehler.** Skeleton im neuen Kartenformat; Fehler/leer → `null` wie bisher.
- [ ] **Step 5: Verifizieren.** Build + eslint. Browser: Ziehen, Pfeile, Tastatur (Tab auf Pfeile und Karten, Enter öffnet Detailseite); DevTools-Request auf `/projects` blockieren → Sektion fehlt; Response auf ein Projekt kürzen (DevTools Override) → `01 / 01`, beide Pfeile deaktiviert. Trackspire-Debug-Konsole zeigt `project_click` mit `featured: true` für die erste Karte.
- [ ] **Step 6: Commit.** `git commit -m "feat: project carousel in showcase style"`

---

### Task 8: About (hell) und Services

**Files:**
- Modify: `src/components/Landing/About.tsx`, `src/components/Landing/Services.tsx`

- [ ] **Step 1: About.** `section` bekommt `section-light`. `SectionHeader id="about"`, Überschrift aus `about.headline_1` / `about.headline_2` sehr groß, `about.body` als Lead, Kennzahlen als Mono-Stats in einer Reihe mit feinen Trennlinien. Inhalte in `Reveal`.
- [ ] **Step 2: Services.** Dunkel. `SectionHeader id="services"`. Leistungen als nummerierte Zeilen (`01`, `02`, …) mit Titel, Beschreibung und Bullets, getrennt durch 1-px-Linien statt Karten-Boxen. CTA bleibt (Ziel `contact` über `scrollToSection`, Tracking unverändert).
- [ ] **Step 3: Verifizieren.** Build + eslint. Browser: Kontrast in der hellen Sektion (DevTools Lighthouse „Contrast“ ohne Befund); alle Texte aus i18n, DE/EN-Umschaltung prüfen.
- [ ] **Step 4: Commit.** `git commit -m "feat: restyle about and services sections"`

---

### Task 9: Skills, Timeline, Marquee

**Files:**
- Modify: `src/components/Landing/Skills.tsx`, `src/components/Landing/Timeline.tsx`, `src/components/Landing/Marquee.tsx`, ggf. `src/index.css` (Marquee-Keyframes)

- [ ] **Step 1: Skills.** `SectionHeader id="skills"`; Kategorien als Spalten mit Mono-Überschrift und Liste, feine Linien, keine Karten.
- [ ] **Step 2: Timeline.** `SectionHeader id="timeline"`; vertikale Linie mit Jahreszahlen in Mono, Einträge in `Reveal`. „Und die Reise geht weiter…“ bleibt.
- [ ] **Step 3: Marquee.** Große Display-Schrift, Trenner `↗`. Animation per CSS-Keyframes; `html[data-motion="off"] .marquee-track { animation-play-state: paused; }`.
- [ ] **Step 4: Verifizieren.** Build + eslint; Browser inkl. Motion pausieren (Marquee steht).
- [ ] **Step 5: Commit.** `git commit -m "feat: restyle skills, timeline and marquee"`

---

### Task 10: Kontakt und Footer

**Files:**
- Modify: `src/components/Landing/ContactForm.tsx` (nur Markup/Klassen), `src/components/Landing/Footer.tsx`

- [ ] **Step 1: Kontakt-Abschluss.** `SectionHeader id="contact"`. Darüber ein riesiges Statement aus `contact.headline_1` + `contact.headline_2` (zweite Zeile in Teal, kursiv), als Text, kein Button. Formular darunter im neuen Look: Felder als Unterstrich-Inputs auf dunklem Grund, Mono-Labels, Pill-Submit. **Nicht ändern:** Feld-`name`s, Honeypot-Feld und seine Versteck-Klassen, `useContactForm`-Aufrufe, Fehler-/Erfolgsanzeigen-Logik.
- [ ] **Step 2: Footer.** Gleiche Inhalte (Rechtliches, Tagline, Newsletter-Feld, Copyright), Layout: großes „Luka Dev Studio“ mit Logo, Nav-Spalte (Anchors über `scrollToSection`), Mono-Bottom-Zeile mit „Nach oben ↑“ (`scrollToTop`).
- [ ] **Step 3: Verifizieren.** `bun test` (Kontakt-Function-Tests weiter grün), Build + eslint. Mit `vercel dev` eine Testnachricht mit ausgedachten Daten (`max.mustermann@example.com`) senden → Erfolgsmeldung; Validierungsfehler werden angezeigt.
- [ ] **Step 4: Commit.** `git commit -m "feat: restyle contact section and footer"`

---

### Task 11: Header und Unterseiten

**Files:**
- Modify: `src/components/Landing/Header.tsx`, `src/feature/project/index.tsx`, `src/feature/privacy/index.tsx`, `src/feature/impressum/index.tsx`, `src/feature/links/index.tsx`, `src/feature/redirect/index.tsx`, `src/components/blocks/cookie-consent.tsx` (nur Klassen)
- Delete: `src/components/Landing/FullScreenMenu.tsx` (unbenutzt; vorher per `grep -rn FullScreenMenu src` bestätigen)

- [ ] **Step 1: Header.** Fix oben, transparent; links Logo + „Luka Dev Studio“, Mitte Desktop-Nav in Mono-Versalien, rechts Sprachumschalter und Pill „Kontakt ↗“ (`scrollToSection('contact')`). Mobil: Menü-Button öffnet Vollbild-Overlay mit großen nummerierten Einträgen (`01 Über mich` …), `data-lenis-prevent`, Escape schließt, Fokus bleibt im Overlay und kehrt danach zum Button zurück, `aria-expanded`/`aria-controls`. Alle bisherigen Ziele bleiben (Anchors, `/links`, Status extern).
- [ ] **Step 2: Unterseiten.** Projekt-Detailseite: Titel groß, Mono-Meta-Zeile, Bilder mit Dimensionen, gleiche Daten/SEO. Privacy/Impressum/Links/Redirect: nur prüfen, dass nichts helle Light-Theme-Reste zeigt (z. B. `bg-white`), dunkle Tokens verwenden. Cookie-Consent passend einfärben, Verhalten unverändert.
- [ ] **Step 3: Verifizieren.** Build + eslint. Browser: alle sechs Routen aufrufen; Header-Links von `/privacy` aus springen auf die Startseiten-Sektion; Mobil-Menü per Tastatur bedienbar.
- [ ] **Step 4: Commit.** `git commit -m "feat: showcase header and dark subpages"`

---

### Task 12: Gesamtprüfung

**Files:** keine neuen; ggf. Fixes.

- [ ] **Step 1:** `bun test` → alle PASS. `bun run build` → ohne Fehler; Chunk-Tabelle notieren (Haupt-Chunk vorher/nachher, `LogoScene`-Chunk ≤ 250 KB gzip).
- [ ] **Step 2:** `bun run lint` → nur die 5 vorbestehenden Fehler.
- [ ] **Step 3: Review-Focus manuell abarbeiten** (alle fünf Punkte oben), zusätzlich: SEO-Tags im gerenderten `<head>` jeder Route vorhanden; kein Request an Dritt-Hosts vor Consent (Network-Tab, frische Sitzung); DE/EN-Wechsel mitten auf der Seite.
- [ ] **Step 4: Lighthouse** (mobil, Produktions-Preview `bun run preview`) für `/` vorher (auf `cfa0242`) und nachher: Performance darf nicht unter den Vorher-Wert fallen; Accessibility ≥ Vorher-Wert. Ergebnisse im PR nennen.
- [ ] **Step 5:** `.superpowers/` nicht committen; `CLAUDE.md`/`AGENTS.md`: Hinweis auf `src/lib/motion/` (Motion zentral, neue Animationen über `useMotion`) und auf `bun test` für `src/**/*.test.ts` ergänzen.
- [ ] **Step 6: Commit.** `git commit -m "docs: note motion layer and frontend tests"`

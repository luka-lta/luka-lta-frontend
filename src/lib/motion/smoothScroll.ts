import Lenis from 'lenis';
import { getSamePageHashTarget } from './hashLink';

/**
 * Header-Versatz: einzige Quelle ist das CSS-`scroll-margin-top` der Ziele (`src/index.css`).
 * Lenis zieht es bei `scrollTo(element)` selbst ab, `scrollIntoView` ebenso – hier wird nichts addiert.
 */

let lenis: Lenis | null = null;
let frameId: number | null = null;

/**
 * Same-Page-Hash-Links (`href="#id"`) übernimmt dieser Handler statt der Lenis-Option `anchors`:
 * Lenis verhindert den nativen Sprung nicht, das ergäbe einen Sprung plus Animation (Flackern).
 * Läuft in der Capture-Phase und nur, solange Lenis aktiv ist; ohne Motion bleibt alles nativ.
 */
const onDocumentClick = (event: MouseEvent): void => {
  if (!(event.target instanceof Element)) return;
  const anchor = event.target.closest('a[href]');
  if (!(anchor instanceof HTMLAnchorElement)) return;

  const id = getSamePageHashTarget({
    href: anchor.getAttribute('href'),
    target: anchor.getAttribute('target'),
    hasDownload: anchor.hasAttribute('download'),
    button: event.button,
    isModified: event.metaKey || event.ctrlKey || event.shiftKey || event.altKey,
    isDefaultPrevented: event.defaultPrevented,
  });
  if (id === null) return;
  const element = document.getElementById(id);
  if (element === null) return;

  event.preventDefault();
  scrollToSection(id);
  window.history.pushState(window.history.state, '', `#${encodeURIComponent(id)}`);
  // Wie der native Sprung: fokussierbare Ziele (z. B. `<main tabIndex={-1}>` für den Skip-Link) erhalten Fokus.
  if (element.hasAttribute('tabindex')) element.focus({ preventScroll: true });
};

export function startSmoothScroll(): void {
  if (lenis !== null) return;
  const instance = new Lenis();
  lenis = instance;
  document.addEventListener('click', onDocumentClick, { capture: true });

  const onFrame = (time: number) => {
    instance.raf(time);
    frameId = requestAnimationFrame(onFrame);
  };
  frameId = requestAnimationFrame(onFrame);
}

export function stopSmoothScroll(): void {
  document.removeEventListener('click', onDocumentClick, { capture: true });
  if (frameId !== null) cancelAnimationFrame(frameId);
  frameId = null;
  lenis?.destroy();
  lenis = null;
}

/** Scrollt zum Element mit der ID; der Header-Versatz kommt aus dessen `scroll-margin-top`. */
export function scrollToSection(id: string): void {
  const element = document.getElementById(id);
  if (element === null) return;
  if (lenis !== null) {
    lenis.scrollTo(element);
    return;
  }
  element.scrollIntoView({ block: 'start', behavior: 'auto' });
}

export function scrollToTop(): void {
  if (lenis !== null) {
    lenis.scrollTo(0);
    return;
  }
  window.scrollTo({ top: 0, behavior: 'auto' });
}

/**
 * Springt ohne Animation nach oben (z. B. beim Routenwechsel). `force`, damit auch ein angehaltenes
 * Lenis springt; `immediate` bricht eine laufende Animation ab, statt von ihr überschrieben zu werden.
 */
export function scrollToTopImmediate(): void {
  if (lenis !== null) {
    lenis.scrollTo(0, { immediate: true, force: true });
    return;
  }
  window.scrollTo({ top: 0, behavior: 'auto' });
}

/** Hält Lenis an (z. B. bei offenem Menü), ohne die Instanz zu zerstören; ohne Instanz wirkungslos. */
export function pauseSmoothScroll(): void {
  lenis?.stop();
}

/** Setzt ein mit `pauseSmoothScroll` angehaltenes Lenis fort; ohne Instanz wirkungslos. */
export function resumeSmoothScroll(): void {
  lenis?.start();
}

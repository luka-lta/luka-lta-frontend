import Lenis from 'lenis';

/** Höhe des fixen Headers in Pixeln; Anker-Ziele werden um diesen Wert nach unten versetzt. */
export const HEADER_OFFSET_PX = 80;

let lenis: Lenis | null = null;
let frameId: number | null = null;

export function startSmoothScroll(): void {
  if (lenis !== null) return;
  const instance = new Lenis();
  lenis = instance;

  const onFrame = (time: number) => {
    instance.raf(time);
    frameId = requestAnimationFrame(onFrame);
  };
  frameId = requestAnimationFrame(onFrame);
}

export function stopSmoothScroll(): void {
  if (frameId !== null) cancelAnimationFrame(frameId);
  frameId = null;
  lenis?.destroy();
  lenis = null;
}

/** Scrollt zum Element mit der ID; ohne laufendes Lenis nativ, mit gleichem Header-Versatz. */
export function scrollToSection(id: string): void {
  const element = document.getElementById(id);
  if (element === null) return;
  if (lenis !== null) {
    lenis.scrollTo(element, { offset: -HEADER_OFFSET_PX });
    return;
  }
  const top = element.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET_PX;
  window.scrollTo({ top, behavior: 'auto' });
}

export function scrollToTop(): void {
  if (lenis !== null) {
    lenis.scrollTo(0);
    return;
  }
  window.scrollTo({ top: 0, behavior: 'auto' });
}

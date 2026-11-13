import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { scrollToSection } from './smoothScroll';
import { pollUntilReady } from './pollForElement';

/**
 * Wartender Sprung zu einer Sektion. Liegt bewusst auf Modulebene: Jede Seite rendert ihren eigenen
 * Header/Footer, der beim Routenwechsel unmountet, der Sprung muss aber trotzdem noch ankommen.
 * Der Timeout in `pollUntilReady` begrenzt die Laufzeit; eine neue Navigation ersetzt den alten Sprung.
 */
let cancelPendingJump: (() => void) | null = null;

function cancelPending(): void {
  cancelPendingJump?.();
  cancelPendingJump = null;
}

function jumpWhenPresent(id: string): void {
  cancelPending();
  cancelPendingJump = pollUntilReady({
    isReady: () => document.getElementById(id) !== null,
    onReady: () => {
      cancelPendingJump = null;
      scrollToSection(id);
    },
    onTimeout: () => {
      cancelPendingJump = null;
    },
    requestFrame: (callback) => window.requestAnimationFrame(callback),
    cancelFrame: (handle) => window.cancelAnimationFrame(handle),
    now: () => performance.now(),
  });
}

/** Springt zur Sektion auf der Startseite; von Unterseiten aus erst dorthin navigieren. */
export function useSectionNavigation(): (id: string) => void {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return useCallback(
    (id: string) => {
      if (pathname === '/') {
        cancelPending();
        scrollToSection(id);
        return;
      }
      navigate('/');
      jumpWhenPresent(id);
    },
    [pathname, navigate],
  );
}

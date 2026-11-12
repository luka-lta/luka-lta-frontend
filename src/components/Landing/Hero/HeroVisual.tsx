import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMotion } from '@/lib/motion/MotionProvider';
import { cn } from '@/lib/utils';
import LogoMark from './LogoMark';
import { formatProgress, markIntroSeen, shouldPlayIntro } from './intro';

/** Gesamtdauer des Intros in Millisekunden (Spec: unter ~1,5 s). */
const INTRO_DURATION_MS = 1400;
/** Obergrenze des Zählers in Prozent. */
const PROGRESS_MAX = 100;

/** Zugriff auf window.sessionStorage kann selbst werfen (z. B. blockierte Cookies). */
const getSessionStorage = (): Storage | null => {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
};

type HeroVisualProps = {
  className?: string;
};

/**
 * Zentrales Hero-Objekt: quadratischer Container mit fester Größe (kein Layout-Shift).
 * Task 6 legt hier die lazy geladene 3D-Szene über das SVG.
 */
export default function HeroVisual({ className }: HeroVisualProps) {
  const { t } = useTranslation();
  const { isMotionEnabled } = useMotion();
  // Einmal beim Mounten entscheiden; danach steuert nur noch der Ablauf.
  const [hasIntro] = useState<boolean>(() => shouldPlayIntro(getSessionStorage(), isMotionEnabled));
  const [isIntroPlaying, setIsIntroPlaying] = useState<boolean>(hasIntro);
  const [progress, setProgress] = useState<number>(0);

  const finishIntro = useCallback(() => {
    setProgress(PROGRESS_MAX);
    setIsIntroPlaying(false);
    markIntroSeen(getSessionStorage());
  }, []);

  useEffect(() => {
    if (!isIntroPlaying) return;
    // Bewegung während des Intros abgeschaltet: sofort statisches Zeichen.
    if (!isMotionEnabled) {
      finishIntro();
      return;
    }

    // Fortschritt vorerst zeitbasiert; Task 6 koppelt ihn an das Laden des 3D-Chunks.
    const startedAt = performance.now();
    let frameId = requestAnimationFrame(function onFrame(now: number) {
      const elapsed = now - startedAt;
      if (elapsed >= INTRO_DURATION_MS) {
        finishIntro();
        return;
      }
      setProgress((elapsed / INTRO_DURATION_MS) * PROGRESS_MAX);
      frameId = requestAnimationFrame(onFrame);
    });
    return () => cancelAnimationFrame(frameId);
  }, [isIntroPlaying, isMotionEnabled, finishIntro]);

  const fadeClass = isMotionEnabled ? 'transition-opacity duration-500 ease-out' : '';

  return (
    <div className={cn('relative aspect-square shrink-0', className)}>
      <LogoMark
        variant="solid"
        className={cn('absolute inset-0 h-full w-full', fadeClass, isIntroPlaying ? 'opacity-0' : 'opacity-100')}
      />
      {hasIntro && (
        <>
          <LogoMark
            variant="outline"
            isDrawing={isIntroPlaying}
            className={cn('absolute inset-0 h-full w-full', fadeClass, isIntroPlaying ? 'opacity-100' : 'opacity-0')}
          />
          <p
            aria-hidden="true"
            className={cn(
              'absolute right-0 top-full mt-3 font-mono text-xs tabular-nums tracking-[0.2em] text-muted-foreground',
              fadeClass,
              isIntroPlaying ? 'opacity-100' : 'opacity-0',
            )}
          >
            <span className="text-foreground">{formatProgress(progress)}</span> / {PROGRESS_MAX}
          </p>
          <span role="status" className="sr-only">
            {isIntroPlaying ? t('intro.loading') : ''}
          </span>
        </>
      )}
    </div>
  );
}

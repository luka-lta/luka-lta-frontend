import { Component, lazy, memo, Suspense, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useMotion } from '@/lib/motion/MotionProvider';
import { cn } from '@/lib/utils';
import LogoMark from './LogoMark';
import { formatProgress, markIntroSeen, shouldPlayIntro } from './intro';
import {
  canRender3D,
  detectInputEnvironment,
  detectWebGL2,
  formatRotation,
  STATIC_ROTATION,
  type RotationQuaternion,
} from './sceneSupport';

// Eigener Chunk; der Import startet erst, wenn die Komponente zum ersten Mal gerendert wird.
const LogoScene = lazy(() => import('./LogoScene'));

/** Gesamtdauer des zeitbasierten Intro-Anteils in Millisekunden (Spec: unter ~1,5 s). */
const INTRO_DURATION_MS = 1400;
/** Obergrenze des Zählers in Prozent. */
const PROGRESS_MAX = 100;
/** Bis hierhin läuft der Zähler zeitbasiert; die letzten Prozent meldet die 3D-Szene. */
const TIMED_PROGRESS_MAX = 90;
/** Spätestens so lange nach dem Zeitanteil wird das Intro beendet, auch wenn die Szene hängt. */
const INTRO_MAX_WAIT_MS = 6000;
/** Verzögerung, falls `requestIdleCallback` fehlt (Safari). */
const IDLE_FALLBACK_DELAY_MS = 200;

/**
 * pending: Gerät wird geprüft bzw. Leerlauf abgewartet · unsupported: dauerhaft SVG ·
 * loading: Chunk lädt, Szene startet · ready: Canvas sichtbar · failed: Fehler, dauerhaft SVG.
 */
type SceneStatus = 'pending' | 'unsupported' | 'loading' | 'ready' | 'failed';

/** Zugriff auf window.sessionStorage kann selbst werfen (z. B. blockierte Cookies). */
const getSessionStorage = (): Storage | null => {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
};

type SceneErrorBoundaryProps = {
  onError: () => void;
  children: ReactNode;
};

/** Fängt Chunk-, WebGL- und Kontextverlust-Fehler ab; danach bleibt die Szene weg. */
class SceneErrorBoundary extends Component<SceneErrorBoundaryProps, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(): void {
    this.props.onError();
  }

  render(): ReactNode {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

type HeroVisualProps = {
  className?: string;
  /** Rotationszeile für das Material-Panel; ohne 3D die festen Werte. */
  onRotationTextChange?: (text: string) => void;
};

/**
 * Zentrales Hero-Objekt: quadratischer Container mit fester Größe (kein Layout-Shift).
 * Darüber blendet die lazy geladene 3D-Szene, sobald sie bereit ist; bis dahin und auf
 * Mobilgeräten bleibt das SVG.
 */
function HeroVisual({ className, onRotationTextChange }: HeroVisualProps) {
  const { t } = useTranslation();
  const { isMotionEnabled } = useMotion();
  // Einmal beim Mounten entscheiden; danach steuert nur noch der Ablauf.
  const [hasIntro] = useState<boolean>(() => shouldPlayIntro(getSessionStorage(), isMotionEnabled));
  const [isIntroPlaying, setIsIntroPlaying] = useState<boolean>(hasIntro);
  const [isIntroTimerDone, setIsIntroTimerDone] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [sceneStatus, setSceneStatus] = useState<SceneStatus>('pending');

  const finishIntro = useCallback(() => {
    setProgress(PROGRESS_MAX);
    setIsIntroPlaying(false);
    markIntroSeen(getSessionStorage());
  }, []);

  // Zeiger und Breite sofort prüfen; den teuren WebGL2-Test und den Chunk erst im Leerlauf.
  useEffect(() => {
    const inputEnvironment = detectInputEnvironment();
    if (!canRender3D({ ...inputEnvironment, hasWebGL2: true })) {
      setSceneStatus('unsupported');
      return;
    }
    const startLoading = () => {
      setSceneStatus(canRender3D({ ...inputEnvironment, hasWebGL2: detectWebGL2() }) ? 'loading' : 'unsupported');
    };
    if (typeof window.requestIdleCallback === 'function') {
      const idleId = window.requestIdleCallback(startLoading);
      return () => window.cancelIdleCallback(idleId);
    }
    const timeoutId = window.setTimeout(startLoading, IDLE_FALLBACK_DELAY_MS);
    return () => window.clearTimeout(timeoutId);
  }, []);

  // Zeitbasierter Anteil des Zählers bis 90.
  useEffect(() => {
    if (!isIntroPlaying) return;
    // Bewegung während des Intros abgeschaltet: sofort statisches Zeichen.
    if (!isMotionEnabled) {
      finishIntro();
      return;
    }

    const startedAt = performance.now();
    let frameId = requestAnimationFrame(function onFrame(now: number) {
      const elapsed = now - startedAt;
      if (elapsed >= INTRO_DURATION_MS) {
        setProgress(TIMED_PROGRESS_MAX);
        setIsIntroTimerDone(true);
        return;
      }
      setProgress((elapsed / INTRO_DURATION_MS) * TIMED_PROGRESS_MAX);
      frameId = requestAnimationFrame(onFrame);
    });
    return () => cancelAnimationFrame(frameId);
  }, [isIntroPlaying, isMotionEnabled, finishIntro]);

  // Abschluss: sofort bei bereiter Szene, sonst nach dem Zeitanteil (ohne 3D) bzw. spätestens nach Wartezeit.
  useEffect(() => {
    if (!isIntroPlaying) return;
    if (sceneStatus === 'ready') {
      finishIntro();
      return;
    }
    if (!isIntroTimerDone) return;
    if (sceneStatus === 'unsupported' || sceneStatus === 'failed') {
      finishIntro();
      return;
    }
    const timeoutId = window.setTimeout(finishIntro, INTRO_MAX_WAIT_MS);
    return () => window.clearTimeout(timeoutId);
  }, [isIntroPlaying, isIntroTimerDone, sceneStatus, finishIntro]);

  const handleSceneReady = useCallback(() => {
    setSceneStatus((status) => (status === 'loading' ? 'ready' : status));
  }, []);

  const handleSceneError = useCallback(() => {
    setSceneStatus('failed');
    onRotationTextChange?.(formatRotation(STATIC_ROTATION));
  }, [onRotationTextChange]);

  const handleRotationChange = useCallback(
    (rotation: RotationQuaternion) => onRotationTextChange?.(formatRotation(rotation)),
    [onRotationTextChange],
  );

  // Element stabil halten, damit Panel-Updates die Szene nicht neu rendern.
  const scene = useMemo(
    () => (
      <SceneErrorBoundary onError={handleSceneError}>
        <Suspense fallback={null}>
          <LogoScene
            isMotionEnabled={isMotionEnabled}
            onReady={handleSceneReady}
            onRotationChange={handleRotationChange}
          />
        </Suspense>
      </SceneErrorBoundary>
    ),
    [isMotionEnabled, handleSceneError, handleSceneReady, handleRotationChange],
  );

  const isSceneMounted = sceneStatus === 'loading' || sceneStatus === 'ready';
  const isSceneVisible = sceneStatus === 'ready';
  const fadeClass = isMotionEnabled ? 'transition-opacity duration-500 ease-out' : '';

  return (
    <div className={cn('relative aspect-square shrink-0', className)}>
      <LogoMark
        variant="solid"
        className={cn(
          'absolute inset-0 h-full w-full',
          fadeClass,
          isIntroPlaying || isSceneVisible ? 'opacity-0' : 'opacity-100',
        )}
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
      {isSceneMounted && (
        // 1,5× so groß wie der Container (CANVAS_SCALE in LogoScene), damit Drehung und Drift Platz haben.
        <div
          className={cn(
            'absolute -inset-1/4',
            fadeClass,
            isSceneVisible ? 'opacity-100' : 'pointer-events-none opacity-0',
          )}
        >
          {scene}
        </div>
      )}
    </div>
  );
}

// Memo: Hero rendert bei jeder Rotationsmeldung des Panels neu, das Logo braucht das nicht.
export default memo(HeroVisual);

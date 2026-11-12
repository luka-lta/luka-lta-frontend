import { Component, lazy, Suspense, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useMotion } from '@/lib/motion/MotionProvider';
import { cn } from '@/lib/utils';
import LogoMark from './LogoMark';
import { formatProgress, markIntroSeen, shouldPlayIntro } from './intro';
import {
  canRender3D,
  detectSceneEnvironment,
  formatRotation,
  GLASS_IOR,
  GLASS_ROUGHNESS,
  MAX_IOR,
  MIN_IOR,
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
/** Feste Panel-Werte ohne 3D-Szene. */
const STATIC_ROTATION: RotationQuaternion = [0, 0.12, 0, 1];
/** Balkenanteile im Material-Panel (0…1). */
const ROUGHNESS_FILL = GLASS_ROUGHNESS;
const IOR_FILL = (GLASS_IOR - MIN_IOR) / (MAX_IOR - MIN_IOR);

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

type MaterialBarProps = {
  label: string;
  value: string;
  fill: number;
};

function MaterialBar({ label, value, fill }: MaterialBarProps) {
  return (
    <div className="mt-3">
      <div className="flex justify-between">
        <span>{label}</span>
        <span className="text-foreground">{value}</span>
      </div>
      <div className="mt-1.5 h-px w-full bg-border">
        <div className="h-px bg-primary" style={{ width: `${fill * PROGRESS_MAX}%` }} />
      </div>
    </div>
  );
}

type HeroVisualProps = {
  className?: string;
};

/**
 * Zentrales Hero-Objekt: quadratischer Container mit fester Größe (kein Layout-Shift).
 * Darüber blendet die lazy geladene 3D-Szene, sobald sie bereit ist; bis dahin und auf
 * Mobilgeräten bleibt das SVG.
 */
export default function HeroVisual({ className }: HeroVisualProps) {
  const { t } = useTranslation();
  const { isMotionEnabled } = useMotion();
  // Einmal beim Mounten entscheiden; danach steuert nur noch der Ablauf.
  const [hasIntro] = useState<boolean>(() => shouldPlayIntro(getSessionStorage(), isMotionEnabled));
  const [isIntroPlaying, setIsIntroPlaying] = useState<boolean>(hasIntro);
  const [isIntroTimerDone, setIsIntroTimerDone] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [sceneStatus, setSceneStatus] = useState<SceneStatus>('pending');
  const [rotationText, setRotationText] = useState<string>(() => formatRotation(STATIC_ROTATION));

  const finishIntro = useCallback(() => {
    setProgress(PROGRESS_MAX);
    setIsIntroPlaying(false);
    markIntroSeen(getSessionStorage());
  }, []);

  // Gerät prüfen und den Chunk erst im Leerlauf nach dem ersten Paint anfordern.
  useEffect(() => {
    if (!canRender3D(detectSceneEnvironment())) {
      setSceneStatus('unsupported');
      return;
    }
    const startLoading = () => setSceneStatus('loading');
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
    setRotationText(formatRotation(STATIC_ROTATION));
  }, []);

  const handleRotationChange = useCallback((rotation: RotationQuaternion) => {
    // Gleicher Text → React überspringt das Rendering.
    setRotationText(formatRotation(rotation));
  }, []);

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
        // Größer als der Container, damit Drehung und Drift nicht abgeschnitten werden.
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

      {/* Deko-Panel links unten neben dem Logo, nur ab lg */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-full mr-[clamp(3rem,8vw,8rem)] hidden w-52 font-mono
          text-[0.625rem] uppercase tracking-[0.2em] text-muted-foreground lg:block"
      >
        <p className="text-foreground">{t('hero.material.title')}</p>
        <MaterialBar label={t('hero.material.roughness')} value={GLASS_ROUGHNESS.toFixed(2)} fill={ROUGHNESS_FILL} />
        <MaterialBar label={t('hero.material.ior')} value={GLASS_IOR.toFixed(2)} fill={IOR_FILL} />
        <p className="mt-3">{t('hero.material.rotation')}</p>
        <p className="mt-1 whitespace-pre tabular-nums text-foreground">{rotationText}</p>
      </div>
    </div>
  );
}

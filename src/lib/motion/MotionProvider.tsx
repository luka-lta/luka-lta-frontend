import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { MotionConfig } from 'framer-motion';
import { isMotionEnabled, loadPausedPreference, savePausedPreference } from './motionPreference';

type MotionContextValue = {
  isMotionEnabled: boolean;
  isPausedByUser: boolean;
  setPausedByUser: (isPaused: boolean) => void;
};

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

const MotionContext = createContext<MotionContextValue | null>(null);

/** Zugriff auf window.localStorage kann selbst werfen (z. B. blockierte Cookies). */
const getLocalStorage = (): Storage | null => {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

export function MotionProvider({ children }: { children: ReactNode }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
  );
  const [isPausedByUser, setIsPausedByUserState] = useState<boolean>(() => loadPausedPreference(getLocalStorage()));

  useEffect(() => {
    const query = window.matchMedia(REDUCED_MOTION_QUERY);
    const onChange = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches);
    setPrefersReducedMotion(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  const setPausedByUser = useCallback((isPaused: boolean) => {
    setIsPausedByUserState(isPaused);
    savePausedPreference(getLocalStorage(), isPaused);
  }, []);

  const enabled = isMotionEnabled(prefersReducedMotion, isPausedByUser);

  useEffect(() => {
    document.documentElement.dataset.motion = enabled ? 'on' : 'off';
  }, [enabled]);

  const value = useMemo<MotionContextValue>(
    () => ({ isMotionEnabled: enabled, isPausedByUser, setPausedByUser }),
    [enabled, isPausedByUser, setPausedByUser],
  );

  return (
    <MotionContext.Provider value={value}>
      <MotionConfig reducedMotion={enabled ? 'never' : 'always'}>{children}</MotionConfig>
    </MotionContext.Provider>
  );
}

export function useMotion(): MotionContextValue {
  const context = useContext(MotionContext);
  if (context === null) throw new Error('useMotion must be used within MotionProvider');
  return context;
}

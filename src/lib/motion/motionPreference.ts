/** Storage-Key für die vom Nutzer gewählte Motion-Pause. */
export const MOTION_PAUSED_STORAGE_KEY = 'motion-paused';

/** Wert, der bei aktiver Pause gespeichert wird. */
const PAUSED_VALUE = '1';

/** Bewegung läuft nur, wenn weder das System noch der Nutzer sie abgewählt hat. */
export const isMotionEnabled = (prefersReducedMotion: boolean, isPausedByUser: boolean): boolean =>
  !prefersReducedMotion && !isPausedByUser;

export const loadPausedPreference = (storage: Storage | null): boolean => {
  if (storage === null) return false;
  try {
    return storage.getItem(MOTION_PAUSED_STORAGE_KEY) === PAUSED_VALUE;
  } catch {
    return false;
  }
};

export const savePausedPreference = (storage: Storage | null, isPaused: boolean): void => {
  if (storage === null) return;
  try {
    if (isPaused) storage.setItem(MOTION_PAUSED_STORAGE_KEY, PAUSED_VALUE);
    else storage.removeItem(MOTION_PAUSED_STORAGE_KEY);
  } catch {
    // Blockierter Storage: Präferenz gilt nur für diese Sitzung.
  }
};

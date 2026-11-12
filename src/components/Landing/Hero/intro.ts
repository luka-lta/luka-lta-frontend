/** sessionStorage-Key: Intro wurde in diesem Tab bereits gezeigt. */
export const INTRO_SEEN_STORAGE_KEY = 'intro-seen';

/** Wert, der nach dem ersten Abspielen gespeichert wird. */
const SEEN_VALUE = '1';

/** Obergrenze des Fortschritts in Prozent. */
const MAX_PERCENT = 100;

/** Anzahl Stellen des Mono-Zählers (`000` … `100`). */
const PROGRESS_DIGITS = 3;

/**
 * Intro nur bei aktiver Bewegung und nur einmal pro Session. Blockierter Storage zählt als
 * „noch nicht gesehen“ – das Intro ist kurz und stört dann höchstens einmal pro Seitenaufruf.
 */
export const shouldPlayIntro = (storage: Storage | null, isMotionEnabled: boolean): boolean => {
  if (!isMotionEnabled) return false;
  if (storage === null) return true;
  try {
    return storage.getItem(INTRO_SEEN_STORAGE_KEY) !== SEEN_VALUE;
  } catch {
    return true;
  }
};

export const markIntroSeen = (storage: Storage | null): void => {
  if (storage === null) return;
  try {
    storage.setItem(INTRO_SEEN_STORAGE_KEY, SEEN_VALUE);
  } catch {
    // Blockierter Storage: Intro läuft beim nächsten Aufruf erneut.
  }
};

/** Fortschritt als dreistelliger Zähler, gerundet und auf 0…100 begrenzt. */
export const formatProgress = (percent: number): string => {
  if (Number.isNaN(percent)) return '0'.repeat(PROGRESS_DIGITS);
  const clamped = Math.min(MAX_PERCENT, Math.max(0, Math.round(percent)));
  return String(clamped).padStart(PROGRESS_DIGITS, '0');
};

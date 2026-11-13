/** Maximale Wartezeit, bis das Sprungziel nach dem Routenwechsel im DOM erscheint. */
export const SECTION_WAIT_TIMEOUT_MS = 2000;

type PollOptions = {
  /** Liefert true, sobald das Ziel vorhanden ist. */
  isReady: () => boolean;
  onReady: () => void;
  onTimeout?: () => void;
  timeoutMs?: number;
  requestFrame: (callback: () => void) => number;
  cancelFrame: (handle: number) => void;
  now: () => number;
};

/** Prüft pro Frame, ob das Ziel existiert; gibt eine Abbruchfunktion zurück. */
export function pollUntilReady(options: PollOptions): () => void {
  const { isReady, onReady, onTimeout, requestFrame, cancelFrame, now } = options;
  const timeoutMs = options.timeoutMs ?? SECTION_WAIT_TIMEOUT_MS;
  const startedAt = now();
  let handle: number | null = null;
  let isCancelled = false;

  const tick = () => {
    handle = null;
    if (isCancelled) return;
    if (isReady()) {
      onReady();
      return;
    }
    if (now() - startedAt >= timeoutMs) {
      onTimeout?.();
      return;
    }
    handle = requestFrame(tick);
  };

  handle = requestFrame(tick);

  return () => {
    isCancelled = true;
    if (handle !== null) cancelFrame(handle);
    handle = null;
  };
}

import { describe, expect, test } from 'bun:test';
import { pollUntilReady } from './pollForElement';

/** Manuelle Frame-Steuerung: Callbacks laufen erst bei `step()`. */
function createFrames() {
  let nextHandle = 1;
  let time = 0;
  const queue = new Map<number, () => void>();
  return {
    requestFrame: (callback: () => void) => {
      const handle = nextHandle++;
      queue.set(handle, callback);
      return handle;
    },
    cancelFrame: (handle: number) => void queue.delete(handle),
    now: () => time,
    step: (advanceMs: number) => {
      time += advanceMs;
      const callbacks = [...queue.values()];
      queue.clear();
      callbacks.forEach((callback) => callback());
    },
    pendingCount: () => queue.size,
  };
}

describe('pollUntilReady', () => {
  test('shouldCallOnReadyOnceTargetAppears', () => {
    const frames = createFrames();
    let isReady = false;
    let readyCalls = 0;
    pollUntilReady({ ...frames, isReady: () => isReady, onReady: () => readyCalls++ });

    frames.step(16);
    expect(readyCalls).toBe(0);
    isReady = true;
    frames.step(16);
    expect(readyCalls).toBe(1);
    expect(frames.pendingCount()).toBe(0);
  });

  test('shouldStopAndReportTimeoutWhenTargetNeverAppears', () => {
    const frames = createFrames();
    let timeouts = 0;
    pollUntilReady({ ...frames, isReady: () => false, onReady: () => {}, onTimeout: () => timeouts++, timeoutMs: 100 });

    frames.step(60);
    expect(timeouts).toBe(0);
    frames.step(60);
    expect(timeouts).toBe(1);
    expect(frames.pendingCount()).toBe(0);
  });

  test('shouldNotCallOnReadyAfterCancel', () => {
    const frames = createFrames();
    let readyCalls = 0;
    const cancel = pollUntilReady({ ...frames, isReady: () => true, onReady: () => readyCalls++ });

    cancel();
    frames.step(16);
    expect(readyCalls).toBe(0);
  });
});

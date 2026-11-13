import { describe, expect, test } from 'bun:test';
import { memoryStorage, throwingStorage } from '@/test/storage';
import { isMotionEnabled, loadPausedPreference, savePausedPreference, MOTION_PAUSED_STORAGE_KEY } from './motionPreference';

describe('isMotionEnabled', () => {
  test.each([
    [false, false, true],
    [true, false, false],
    [false, true, false],
    [true, true, false],
  ])('reduced=%p paused=%p → %p', (reduced, paused, expected) => {
    expect(isMotionEnabled(reduced, paused)).toBe(expected);
  });
});

describe('pause preference', () => {
  test('shouldDefaultToNotPausedWhenNothingStored', () => {
    expect(loadPausedPreference(memoryStorage())).toBe(false);
  });
  test('shouldRoundTripPausedState', () => {
    const storage = memoryStorage();
    savePausedPreference(storage, true);
    expect(storage.getItem(MOTION_PAUSED_STORAGE_KEY)).toBe('1');
    expect(loadPausedPreference(storage)).toBe(true);
  });
  test('shouldTreatUnknownValueAsNotPaused', () => {
    expect(loadPausedPreference(memoryStorage({ [MOTION_PAUSED_STORAGE_KEY]: 'yes' }))).toBe(false);
  });
  test('shouldNotThrowWhenStorageIsBlocked', () => {
    expect(loadPausedPreference(throwingStorage())).toBe(false);
    expect(() => savePausedPreference(throwingStorage(), true)).not.toThrow();
  });
  test('shouldHandleMissingStorage', () => {
    expect(loadPausedPreference(null)).toBe(false);
  });
});

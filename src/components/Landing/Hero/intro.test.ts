import { describe, expect, test } from 'bun:test';
import { memoryStorage, throwingStorage } from '@/test/storage';
import { formatProgress, INTRO_SEEN_STORAGE_KEY, markIntroSeen, shouldPlayIntro } from './intro';

describe('shouldPlayIntro', () => {
  test('shouldPlayOnFirstVisit', () => {
    expect(shouldPlayIntro(memoryStorage(), true)).toBe(true);
  });
  test('shouldSkipWhenSeenThisSession', () => {
    const storage = memoryStorage();
    markIntroSeen(storage);
    expect(storage.getItem(INTRO_SEEN_STORAGE_KEY)).toBe('1');
    expect(shouldPlayIntro(storage, true)).toBe(false);
  });
  test('shouldSkipWhenMotionDisabled', () => {
    expect(shouldPlayIntro(memoryStorage(), false)).toBe(false);
  });
  test('shouldPlayWhenStorageBlocked', () => {
    expect(shouldPlayIntro(throwingStorage(), true)).toBe(true);
  });
  test('shouldPlayWhenStorageMissing', () => {
    expect(shouldPlayIntro(null, true)).toBe(true);
  });
  test('shouldNotThrowMarkingWithBlockedStorage', () => {
    expect(() => markIntroSeen(throwingStorage())).not.toThrow();
  });
  test('shouldNotThrowMarkingWithMissingStorage', () => {
    expect(() => markIntroSeen(null)).not.toThrow();
  });
});

describe('formatProgress', () => {
  test.each([
    [0, '000'],
    [7, '007'],
    [42.6, '043'],
    [100, '100'],
    [-5, '000'],
    [140, '100'],
    [Number.NaN, '000'],
  ])('formatProgress(%p) → %p', (percent, expected) => {
    expect(formatProgress(percent)).toBe(expected);
  });
});

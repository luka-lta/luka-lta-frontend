import { describe, expect, test } from 'bun:test';
import { createRotationTextStore } from './rotationTextStore';

describe('createRotationTextStore', () => {
  test('shouldExposeInitialText', () => {
    const store = createRotationTextStore('.00  .12  .00  1.0');
    expect(store.getText()).toBe('.00  .12  .00  1.0');
  });

  test('shouldNotifySubscribersWhenTextChanges', () => {
    const store = createRotationTextStore('.00  .12  .00  1.0');
    let calls = 0;
    store.subscribe(() => calls++);

    const hasChanged = store.setText('.01  .12  .00  1.0');

    expect(hasChanged).toBe(true);
    expect(calls).toBe(1);
    expect(store.getText()).toBe('.01  .12  .00  1.0');
  });

  test('shouldSkipNotificationWhenTextIsUnchanged', () => {
    const store = createRotationTextStore('.00  .12  .00  1.0');
    let calls = 0;
    store.subscribe(() => calls++);

    const hasChanged = store.setText('.00  .12  .00  1.0');

    expect(hasChanged).toBe(false);
    expect(calls).toBe(0);
  });

  test('shouldStopNotifyingAfterUnsubscribe', () => {
    const store = createRotationTextStore('a');
    let calls = 0;
    const unsubscribe = store.subscribe(() => calls++);

    unsubscribe();
    store.setText('b');

    expect(calls).toBe(0);
  });
});

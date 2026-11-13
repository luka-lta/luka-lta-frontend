import { describe, expect, test } from 'bun:test';
import { canRender3D, formatRotation, MIN_3D_VIEWPORT_WIDTH } from './sceneSupport';

describe('canRender3D', () => {
  test('shouldRenderOnTabletWidthWithFinePointerAndWebGL2', () => {
    expect(canRender3D({ isPointerFine: true, viewportWidth: 768, hasWebGL2: true })).toBe(true);
  });
  test('shouldUseTabletWidthAsThreshold', () => {
    expect(MIN_3D_VIEWPORT_WIDTH).toBe(768);
  });
  test('shouldRejectViewportBelowTabletWidth', () => {
    expect(canRender3D({ isPointerFine: true, viewportWidth: 767, hasWebGL2: true })).toBe(false);
  });
  test('shouldRejectCoarsePointer', () => {
    expect(canRender3D({ isPointerFine: false, viewportWidth: 768, hasWebGL2: true })).toBe(false);
  });
  test('shouldRejectMissingWebGL2', () => {
    expect(canRender3D({ isPointerFine: true, viewportWidth: 768, hasWebGL2: false })).toBe(false);
  });
});

describe('formatRotation', () => {
  test('shouldFormatQuaternionLikeMaterialPanel', () => {
    expect(formatRotation([0, 0.12, 0, 1])).toBe('.00  .12  .00  1.0');
  });
  test('shouldKeepSignOfNegativeComponents', () => {
    expect(formatRotation([-0.123, 0.5, -0.004, 0.86])).toBe('-.12  .50  .00  .86');
  });
  test('shouldShowNegativeOneWithOneDecimal', () => {
    expect(formatRotation([0, 0, 0, -1])).toBe('.00  .00  .00  -1.0');
  });
});

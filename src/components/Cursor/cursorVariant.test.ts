import { describe, expect, test } from 'bun:test';
import { parseCursorVariant } from './cursorVariant';

describe('parseCursorVariant', () => {
  test.each([
    ['open', 'open'],
    ['drag', 'drag'],
    [null, 'default'],
    ['', 'default'],
    ['OPEN', 'default'],
    ['unknown', 'default'],
  ])('parses %p as %p', (input, expected) => {
    expect(parseCursorVariant(input)).toBe(expected);
  });
});

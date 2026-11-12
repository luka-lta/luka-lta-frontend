import { expect, test } from 'bun:test';
import { formatCounter, formatSectionIndex } from './sectionFormat';

test.each([[1, '01'], [9, '09'], [10, '10'], [123, '123']])('formatSectionIndex(%p)', (n, s) =>
  expect(formatSectionIndex(n)).toBe(s));

test.each([[1, 5, '01 / 05'], [1, 1, '01 / 01'], [12, 12, '12 / 12']])('formatCounter(%p, %p)', (c, t, s) =>
  expect(formatCounter(c, t)).toBe(s));

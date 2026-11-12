import { expect, test } from 'bun:test';
import { filterPresentSections, getSectionNumber, LANDING_SECTIONS } from './sections';

test.each([['top', 0], ['about', 1], ['contact', 6]] as const)('getSectionNumber(%p)', (id, n) =>
  expect(getSectionNumber(id)).toBe(n));

test('shouldDropMissingSectionsAndKeepOrder', () =>
  expect(filterPresentSections(LANDING_SECTIONS.map((s) => s.id), (id) => id !== 'projects'))
    .toEqual(['top', 'about', 'skills', 'services', 'timeline', 'contact']));

test('shouldReturnEmptyListWhenNothingPresent', () =>
  expect(filterPresentSections(['top', 'about'], () => false)).toEqual([]));

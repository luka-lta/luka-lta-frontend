import { expect, test } from 'bun:test';
import { pickActiveSection } from './activeSection';

test('shouldPickSectionWithHighestRatio', () =>
  expect(pickActiveSection([{ id: 'about', ratio: 0.2 }, { id: 'projects', ratio: 0.6 }], 'top')).toBe('projects'));
test('shouldPreferEarlierSectionOnTie', () =>
  expect(pickActiveSection([{ id: 'about', ratio: 0.5 }, { id: 'projects', ratio: 0.5 }], 'top')).toBe('about'));
test('shouldFallBackWhenNothingVisible', () =>
  expect(pickActiveSection([{ id: 'about', ratio: 0 }], 'top')).toBe('top'));
test('shouldFallBackOnEmptyList', () =>
  expect(pickActiveSection([], 'top')).toBe('top'));

import { describe, expect, test } from 'bun:test';
import { getSamePageHashTarget, type HashLinkClick } from './hashLink';

const plainClick = (overrides: Partial<HashLinkClick> = {}): HashLinkClick => ({
  href: '#contact',
  target: null,
  hasDownload: false,
  button: 0,
  isModified: false,
  isDefaultPrevented: false,
  ...overrides,
});

describe('getSamePageHashTarget', () => {
  test('shouldReturnIdForPlainHashLinkClick', () => {
    expect(getSamePageHashTarget(plainClick())).toBe('contact');
  });

  test('shouldDecodePercentEncodedIds', () => {
    expect(getSamePageHashTarget(plainClick({ href: '#%C3%BCber-mich' }))).toBe('über-mich');
  });

  test.each([
    ['modifier key held (cmd/ctrl/shift/alt)', { isModified: true }],
    ['middle mouse button', { button: 1 }],
    ['right mouse button', { button: 2 }],
    ['already prevented', { isDefaultPrevented: true }],
    ['opens in new tab', { target: '_blank' }],
    ['download link', { hasDownload: true }],
    ['missing href', { href: null }],
    ['empty hash', { href: '#' }],
    ['other page with hash', { href: '/privacy#cookies' }],
    ['absolute url', { href: 'https://example.com/#contact' }],
    ['malformed encoding', { href: '#%E0%A4%A' }],
  ])('shouldIgnoreClickWhen %s', (_label, overrides) => {
    expect(getSamePageHashTarget(plainClick(overrides as Partial<HashLinkClick>))).toBeNull();
  });

  test.each([[''], ['_self']])('shouldAcceptSameWindowTarget %p', (target) => {
    expect(getSamePageHashTarget(plainClick({ target }))).toBe('contact');
  });
});

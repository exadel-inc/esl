import {RTLUtils} from '../rtl';

describe('RTLUtils', () => {
  describe('isRtl', () => {
    test('ltr', () => {
      const root = document.createElement('div');
      const el = document.createElement('div');
      root.appendChild(el);

      expect(RTLUtils.isRtl(root)).toBe(false);
      expect(RTLUtils.isRtl(el)).toBe(false);
    });
    test('rtl', () => {
      const root = document.createElement('div');
      const el = document.createElement('div');
      root.appendChild(el);
      root.dir = 'rtl';

      expect(RTLUtils.isRtl(root)).toBe(true);
      expect(RTLUtils.isRtl(el)).toBe(true);
    });
    test('nested', () => {
      const root = document.createElement('div');
      const nested1 = document.createElement('div');
      const nested2 = document.createElement('div');
      const nested3 = document.createElement('div');
      nested2.appendChild(nested3);
      nested1.appendChild(nested2);
      root.appendChild(nested1);
      root.dir = 'rtl';
      nested2.dir = 'ltr';

      expect(RTLUtils.isRtl(root)).toBe(true);
      expect(RTLUtils.isRtl(nested1)).toBe(true);
      expect(RTLUtils.isRtl(nested2)).toBe(false);
      expect(RTLUtils.isRtl(nested3)).toBe(false);
    });
    test('body', () => {
      expect(RTLUtils.isRtl()).toBe(false);
      document.body.setAttribute('dir', 'rtl');
      expect(RTLUtils.isRtl()).toBe(true);
      document.body.removeAttribute('dir');
      expect(RTLUtils.isRtl()).toBe(false);
    });
  });

  test('scrollType', () => {
    // Should be negative in the JSDOM env
    expect(RTLUtils.scrollType).toBe('reverse');
    // Double test for cache
    expect(RTLUtils.scrollType).toBe('reverse');
    // TODO: emulation and tests for other cases
  });
});

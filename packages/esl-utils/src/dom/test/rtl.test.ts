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

      const gcsSpy = jest.spyOn(window, 'getComputedStyle');

      gcsSpy.mockImplementationOnce(() => ({direction: 'rtl'} as CSSStyleDeclaration));
      expect(RTLUtils.isRtl(root)).toBe(true);
      gcsSpy.mockImplementationOnce(() => ({direction: 'rtl'} as CSSStyleDeclaration));
      expect(RTLUtils.isRtl(el)).toBe(true);
    });

    test('normalizeScrollLeft', () => {
      const el = document.createElement('div');

      jest.spyOn(el, 'scrollWidth', 'get').mockImplementation(() => 1000);
      jest.spyOn(el, 'clientWidth', 'get').mockImplementation(() => 100);
      jest.spyOn(el, 'scrollLeft', 'get').mockImplementation(() => 200);
      jest.spyOn(RTLUtils, 'scrollType', 'get').mockImplementation(() => 'negative');

      expect(RTLUtils.normalizeScrollLeft(el)).toBe(200);
      expect(RTLUtils.normalizeScrollLeft(el, 50)).toBe(50);
      expect(RTLUtils.normalizeScrollLeft(el, 50, false)).toBe(50);
      expect(RTLUtils.normalizeScrollLeft(el, null, false)).toBe(200);
      expect(RTLUtils.normalizeScrollLeft(el, 50, true)).toBe(950);
      expect(RTLUtils.normalizeScrollLeft(el, null, true)).toBe(1100);

      jest.spyOn(RTLUtils, 'scrollType', 'get').mockImplementation(() => 'reverse');

      expect(RTLUtils.normalizeScrollLeft(el, 50, true)).toBe(850);
      expect(RTLUtils.normalizeScrollLeft(el, null, true)).toBe(700);
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

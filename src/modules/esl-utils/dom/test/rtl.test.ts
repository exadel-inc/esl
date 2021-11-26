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

      console.log(RTLUtils.normalizeScrollLeft(el, null, false));

      expect(RTLUtils.normalizeScrollLeft(el)).toBe(0);
      expect(RTLUtils.normalizeScrollLeft(el, 50)).toBe(50);
      expect(RTLUtils.normalizeScrollLeft(el, 50, false)).toBe(50);
      expect(RTLUtils.normalizeScrollLeft(el, null, false)).toBe(0);
      expect(RTLUtils.normalizeScrollLeft(el, 50, true)).toBe(850);
      expect(RTLUtils.normalizeScrollLeft(el, null, true)).toBe(900);
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

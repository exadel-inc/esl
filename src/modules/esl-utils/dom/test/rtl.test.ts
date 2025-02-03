import {RTLScroll, isRTL, normalizeScrollLeft} from '../rtl';

describe('RTLUtils', () => {
  describe('isRtl', () => {
    test('ltr', () => {
      const root = document.createElement('div');
      const el = document.createElement('div');
      root.appendChild(el);

      expect(isRTL(root)).toBe(false);
      expect(isRTL(el)).toBe(false);
    });
    test('rtl', () => {
      const root = document.createElement('div');
      const el = document.createElement('div');
      root.appendChild(el);

      const gcsSpy = jest.spyOn(window, 'getComputedStyle');

      gcsSpy.mockImplementationOnce(() => ({direction: 'rtl'} as CSSStyleDeclaration));
      expect(isRTL(root)).toBe(true);
      gcsSpy.mockImplementationOnce(() => ({direction: 'rtl'} as CSSStyleDeclaration));
      expect(isRTL(el)).toBe(true);
    });

    test('normalizeScrollLeft', () => {
      const el = document.createElement('div');

      jest.spyOn(el, 'scrollWidth', 'get').mockImplementation(() => 1000);
      jest.spyOn(el, 'clientWidth', 'get').mockImplementation(() => 100);
      jest.spyOn(el, 'scrollLeft', 'get').mockImplementation(() => 200);
      jest.spyOn(RTLScroll, 'type', 'get').mockImplementation(() => 'negative');

      expect(normalizeScrollLeft(el)).toBe(200);
      expect(normalizeScrollLeft(el, 50)).toBe(50);
      expect(normalizeScrollLeft(el, 50, false)).toBe(50);
      expect(normalizeScrollLeft(el, null, false)).toBe(200);
      expect(normalizeScrollLeft(el, 50, true)).toBe(950);
      expect(normalizeScrollLeft(el, null, true)).toBe(1100);
    });
  });
});

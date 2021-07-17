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
  });

  test('scrollType', () => {
    // Should be negative in the JSDOM env
    expect(RTLUtils.scrollType).toBe('reverse');
    // Double test for cache
    expect(RTLUtils.scrollType).toBe('reverse');
    // TODO: emulation and tests for other cases
  });
});

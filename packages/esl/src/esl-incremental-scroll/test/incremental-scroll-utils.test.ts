import {getDocScrollHeight, getDocScrollWidth, resolveOffset} from '../core/incremental-scroll-utils';

const {scrollingElement} = document;

afterEach(() => {
  Object.defineProperty(document, 'scrollingElement', {
    configurable: true,
    writable: true,
    value: scrollingElement
  });
});

describe('resolveOffset', () => {
  test('should return provided numeric offset', () => {
    expect(resolveOffset(15, 'x')).toBe(15);
    expect(resolveOffset(-10, 'y')).toBe(-10);
  });

  test('should return axis-specific offset from object', () => {
    expect(resolveOffset({x: 20, y: 30}, 'x')).toBe(20);
    expect(resolveOffset({x: 20, y: 30}, 'y')).toBe(30);
  });

  test('should return zero when axis-specific offset is missing', () => {
    expect(resolveOffset({x: 25}, 'y')).toBe(0);
    expect(resolveOffset({y: 25}, 'x')).toBe(0);
  });

  test('should return zero when offset is undefined', () => {
    expect(resolveOffset(undefined, 'x')).toBe(0);
    expect(resolveOffset(undefined, 'y')).toBe(0);
  });

  test('should return zero when axis-specific offset equals zero', () => {
    expect(resolveOffset({x: 0, y: 10}, 'x')).toBe(0);
    expect(resolveOffset({x: 0, y: 0}, 'y')).toBe(0);
  });
});

describe('getDocScrollHeight and getDocScrollWidth', () => {
  test('should use scrollingElement when available', () => {
    const mockEl = {scrollHeight: 1234, scrollWidth: 5678} as unknown as Element;
    Object.defineProperty(document, 'scrollingElement', {
      configurable: true,
      writable: true,
      value: mockEl
    });

    expect(getDocScrollHeight()).toBe(1234);
    expect(getDocScrollWidth()).toBe(5678);
  });

  test('should fallback to documentElement', () => {
    Object.defineProperty(document, 'scrollingElement', {
      configurable: true,
      writable: true,
      value: null
    });

    jest.spyOn(document.documentElement, 'scrollHeight', 'get').mockReturnValue(4321);
    jest.spyOn(document.documentElement, 'scrollWidth', 'get').mockReturnValue(8765);

    expect(getDocScrollHeight()).toBe(4321);
    expect(getDocScrollWidth()).toBe(8765);
  });
});

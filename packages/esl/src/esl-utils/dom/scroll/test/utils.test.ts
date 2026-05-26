import {hasHorizontalScroll, hasVerticalScroll} from '../utils';

const $html = document.documentElement;
const $body = document.body;

afterEach(() => vi.clearAllMocks());

const mockElHeight = (el: Element) => {
  vi.spyOn(el, 'scrollHeight', 'get').mockImplementation(() => 100);
  vi.spyOn(el, 'clientHeight', 'get').mockImplementation(() => 99);
};

const mockElWidth = (el: Element) => {
  vi.spyOn(el, 'scrollWidth', 'get').mockImplementation(() => 100);
  vi.spyOn(el, 'clientWidth', 'get').mockImplementation(() => 99);
};

describe('Function hasVerticalScroll', () => {
  test('should be vertical scroll on default element', () => {
    mockElHeight($html);
    expect(hasVerticalScroll()).toBe(true);
  });

  test('should be vertical scroll on target element', () => {
    const target = document.createElement('div');
    mockElHeight(target);
    expect(hasVerticalScroll(target)).toBe(true);
  });
});

describe('Function hasHorizontalScroll', () => {
  test('should be horizontal scroll on default element', () => {
    mockElWidth($html);
    expect(hasHorizontalScroll()).toBe(true);
  });

  test('should be horizontal scroll on target element', () => {
    const target = document.createElement('div');
    mockElWidth(target);
    expect(hasHorizontalScroll(target)).toBe(true);
  });
});

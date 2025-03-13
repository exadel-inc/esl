import {Rect} from '../rect';
import {getWindow, getWindowRect, getViewportRect} from '../window';

describe('getWindow() function:', () => {
  test('should return window when the passed node is null', () => {
    const node = null as any;
    expect(getWindow(node)).toBe(window);
  });

  test('should return window when the passed node is window', () => {
    const node = window;
    expect(getWindow(node)).toBe(window);
  });

  test('should return window for the passed node', () => {
    const node = document.createElement('div');
    expect(getWindow(node)).toBe(window);
  });

  test('should return window when the passed node is document element', () => {
    const node = document.createElement('div').ownerDocument;
    expect(getWindow(node)).toBe(window);
  });

  test('should return window as fallback value when the passed node has ownerDocument without defaultView', () => {
    const node = {ownerDocument: {}} as Node;
    expect(getWindow(node)).toBe(window);
  });
});

describe('getWindowRect() function:', () => {
  test('should return window rect', () => {
    expect(getWindowRect()).toEqual(new Rect(0, 0, 1024, 768));
  });
});

describe('getViewportRect() function:', () => {
  const clientWidthOriginal = document.documentElement.clientWidth;
  const clientHeightOriginal = document.documentElement.clientHeight;

  beforeAll(() => {
    const scrollbarWidth = 17;
    const clientWidth = window.innerWidth - scrollbarWidth;
    const clientHeight = window.innerHeight - scrollbarWidth;
    Object.defineProperty(document.documentElement, 'clientWidth', {value: clientWidth, configurable: true});
    Object.defineProperty(document.documentElement, 'clientHeight', {value: clientHeight, configurable: true});
  });

  afterAll(() => {
    Object.defineProperty(document.documentElement, 'clientWidth', {value: clientWidthOriginal, configurable: true});
    Object.defineProperty(document.documentElement, 'clientHeight', {value: clientHeightOriginal, configurable: true});
  });

  test('should return viewport rect', () => {
    expect(getViewportRect()).toEqual(new Rect(0, 0, 1007, 751));
  });
});

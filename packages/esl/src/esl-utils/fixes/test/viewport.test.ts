import {vi} from 'vitest';

import {ESLVSizeCSSProxy} from '../viewport';

const STORE = Symbol.for('ESLVSizeCSSProxy');

describe('ESLVSizeCSSProxy', () => {
  const clientWidthOriginal = document.documentElement.clientWidth;
  const innerHeightOriginal = window.innerHeight;

  let nextAnimationFrameId = 1;
  let animationFrames = new Map<number, FrameRequestCallback>();
  let requestAnimationFrameSpy: ReturnType<typeof vi.spyOn>;
  let cancelAnimationFrameSpy: ReturnType<typeof vi.spyOn>;
  let baselineSeed = 0;

  const setViewport = (width: number, height: number): void => {
    Object.defineProperty(document.documentElement, 'clientWidth', {value: width, configurable: true});
    Object.defineProperty(window, 'innerHeight', {value: height, configurable: true});
  };

  const flushAnimationFrames = (): void => {
    const callbacks = [...animationFrames.values()];
    animationFrames.clear();
    callbacks.forEach((callback) => callback(0));
  };

  const getStoredInstance = (): ESLVSizeCSSProxy => {
    const store = window as unknown as Record<symbol, ESLVSizeCSSProxy | undefined>;
    return store[STORE] as ESLVSizeCSSProxy;
  };

  const primeSingleton = (): void => {
    baselineSeed += 1;
    setViewport(10000 + baselineSeed, 20000 + baselineSeed);
    ESLVSizeCSSProxy.init();
    ESLVSizeCSSProxy.destroy();
    requestAnimationFrameSpy.mockClear();
    cancelAnimationFrameSpy.mockClear();
  };

  beforeEach(() => {
    nextAnimationFrameId = 1;
    animationFrames = new Map<number, FrameRequestCallback>();

    requestAnimationFrameSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback: FrameRequestCallback): number => {
      const id = nextAnimationFrameId++;
      animationFrames.set(id, callback);
      return id;
    });

    cancelAnimationFrameSpy = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id: number): void => {
      animationFrames.delete(id);
    });

    document.documentElement.style.removeProperty(ESLVSizeCSSProxy.vwProp);
    document.documentElement.style.removeProperty(ESLVSizeCSSProxy.vhProp);
    ESLVSizeCSSProxy.destroy();
    primeSingleton();
  });

  afterEach(() => {
    ESLVSizeCSSProxy.destroy();
    document.documentElement.style.removeProperty(ESLVSizeCSSProxy.vwProp);
    document.documentElement.style.removeProperty(ESLVSizeCSSProxy.vhProp);
    Object.defineProperty(document.documentElement, 'clientWidth', {value: clientWidthOriginal, configurable: true});
    Object.defineProperty(window, 'innerHeight', {value: innerHeightOriginal, configurable: true});
    requestAnimationFrameSpy.mockRestore();
    cancelAnimationFrameSpy.mockRestore();
  });

  test('public API stores and reuses a singleton instance on window', () => {
    const instance = getStoredInstance();

    ESLVSizeCSSProxy.init();

    expect(getStoredInstance()).toBe(instance);

    ESLVSizeCSSProxy.destroy();
    ESLVSizeCSSProxy.update(true);

    expect(getStoredInstance()).toBe(instance);
  });

  test('init() refreshes CSS vars on the next animation frame and safely restarts pending refresh', () => {
    setViewport(1007, 751);

    ESLVSizeCSSProxy.init();
    ESLVSizeCSSProxy.init();

    expect(cancelAnimationFrameSpy).toHaveBeenCalledTimes(1);
    expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(2);

    flushAnimationFrames();

    expect(document.documentElement.style.getPropertyValue(ESLVSizeCSSProxy.vwProp)).toBe('1007px');
    expect(document.documentElement.style.getPropertyValue(ESLVSizeCSSProxy.vhProp)).toBe('751px');
  });

  test('update() schedules refresh, coalesces equal sizes and replaces stale scheduled frame', () => {
    setViewport(1007, 751);

    ESLVSizeCSSProxy.update();
    ESLVSizeCSSProxy.update();

    expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(1);

    setViewport(1200, 680);
    ESLVSizeCSSProxy.update();

    expect(cancelAnimationFrameSpy).toHaveBeenCalledTimes(1);
    expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(2);

    flushAnimationFrames();

    expect(document.documentElement.style.getPropertyValue(ESLVSizeCSSProxy.vwProp)).toBe('1200px');
    expect(document.documentElement.style.getPropertyValue(ESLVSizeCSSProxy.vhProp)).toBe('680px');
  });

  test('update() applies zero-sized viewport on the first scheduled run', () => {
    setViewport(0, 0);

    ESLVSizeCSSProxy.update();

    expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(1);

    flushAnimationFrames();

    expect(document.documentElement.style.getPropertyValue(ESLVSizeCSSProxy.vwProp)).toBe('0px');
    expect(document.documentElement.style.getPropertyValue(ESLVSizeCSSProxy.vhProp)).toBe('0px');
  });

  test('update(true) applies CSS variables immediately', () => {
    setViewport(777, 555);

    ESLVSizeCSSProxy.update(true);

    expect(requestAnimationFrameSpy).not.toHaveBeenCalled();
    expect(document.documentElement.style.getPropertyValue(ESLVSizeCSSProxy.vwProp)).toBe('777px');
    expect(document.documentElement.style.getPropertyValue(ESLVSizeCSSProxy.vhProp)).toBe('555px');
  });

  test('static viewport accessors resolve current viewport values', () => {
    setViewport(1234, 567);

    expect(ESLVSizeCSSProxy.viewportWidth).toBe(1234);
    expect(ESLVSizeCSSProxy.viewportHeight).toBe(567);
  });

  test('destroy() cancels a pending frame, clears CSS vars and allows a fresh init cycle', () => {
    setViewport(900, 600);

    ESLVSizeCSSProxy.update();
    document.documentElement.style.setProperty(ESLVSizeCSSProxy.vwProp, 'stale');
    document.documentElement.style.setProperty(ESLVSizeCSSProxy.vhProp, 'stale');

    ESLVSizeCSSProxy.destroy();

    flushAnimationFrames();

    expect(document.documentElement.style.getPropertyValue(ESLVSizeCSSProxy.vwProp)).toBe('');
    expect(document.documentElement.style.getPropertyValue(ESLVSizeCSSProxy.vhProp)).toBe('');

    document.documentElement.style.removeProperty(ESLVSizeCSSProxy.vwProp);
    document.documentElement.style.removeProperty(ESLVSizeCSSProxy.vhProp);

    ESLVSizeCSSProxy.init();
    flushAnimationFrames();

    expect(document.documentElement.style.getPropertyValue(ESLVSizeCSSProxy.vwProp)).toBe('900px');
    expect(document.documentElement.style.getPropertyValue(ESLVSizeCSSProxy.vhProp)).toBe('600px');
  });

});


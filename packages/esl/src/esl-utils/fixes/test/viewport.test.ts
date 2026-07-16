import {vi} from 'vitest';

import {ESLEventUtils} from '../../../esl-event-listener/core/api';
import {ESLVSizeCSSProxy} from '../viewport';

const STORE = Symbol.for('ESLVSizeCSSProxy');

describe('ESLVSizeCSSProxy', () => {
  const clientWidthOriginal = document.documentElement.clientWidth;
  const innerHeightOriginal = window.innerHeight;
  let instance: ESLVSizeCSSProxy;

  let nextAnimationFrameId = 1;
  let animationFrames = new Map<number, FrameRequestCallback>();
  let requestAnimationFrameSpy: ReturnType<typeof vi.spyOn>;
  let cancelAnimationFrameSpy: ReturnType<typeof vi.spyOn>;

  const setViewport = (width: number, height: number): void => {
    Object.defineProperty(document.documentElement, 'clientWidth', {value: width, configurable: true});
    Object.defineProperty(window, 'innerHeight', {value: height, configurable: true});
  };

  const flushAnimationFrames = (): void => {
    const callbacks = [...animationFrames.values()];
    animationFrames.clear();
    callbacks.forEach((callback) => callback(0));
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
    instance = new ESLVSizeCSSProxy();
    (instance as any)._width = -1;
    (instance as any)._height = -1;
    (instance as any)._requestId = 0;
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

  test('constructor resolves a window singleton instance', () => {
    expect(new ESLVSizeCSSProxy()).toBe(instance);
    expect((window as any)[STORE]).toBe(instance);
  });

  test('init() reuses singleton listeners and refreshes CSS vars on the next animation frame', () => {
    setViewport(1007, 751);

    ESLVSizeCSSProxy.init();
    ESLVSizeCSSProxy.init();

    expect(ESLEventUtils.listeners(instance)).toHaveLength(2);
    expect(cancelAnimationFrameSpy).toHaveBeenCalledWith(1);
    expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(2);

    flushAnimationFrames();

    expect(document.documentElement.style.getPropertyValue(ESLVSizeCSSProxy.vwProp)).toBe('1007px');
    expect(document.documentElement.style.getPropertyValue(ESLVSizeCSSProxy.vhProp)).toBe('751px');
  });

  test('update() coalesces equal sizes and replaces stale scheduled frame', () => {
    setViewport(1007, 751);

    ESLVSizeCSSProxy.update();
    ESLVSizeCSSProxy.update();

    expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(1);

    setViewport(1200, 680);
    ESLVSizeCSSProxy.update();

    expect(cancelAnimationFrameSpy).toHaveBeenCalledWith(1);
    expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(2);

    flushAnimationFrames();

    expect(document.documentElement.style.getPropertyValue(ESLVSizeCSSProxy.vwProp)).toBe('1200px');
    expect(document.documentElement.style.getPropertyValue(ESLVSizeCSSProxy.vhProp)).toBe('680px');
  });

  test('requestUpdate() applies zero-sized viewport on the first run', () => {
    setViewport(0, 0);

    ESLVSizeCSSProxy.update();

    expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(1);

    flushAnimationFrames();

    expect(document.documentElement.style.getPropertyValue(ESLVSizeCSSProxy.vwProp)).toBe('0px');
    expect(document.documentElement.style.getPropertyValue(ESLVSizeCSSProxy.vhProp)).toBe('0px');
  });

  test('static viewport accessors resolve current viewport values', () => {
    setViewport(1234, 567);

    expect(ESLVSizeCSSProxy.viewportWidth).toBe(1234);
    expect(ESLVSizeCSSProxy.viewportHeight).toBe(567);
  });

  test('destroy() cancels a pending frame and allows a fresh observe cycle', () => {
    setViewport(900, 600);

    ESLVSizeCSSProxy.update();
    document.documentElement.style.setProperty(ESLVSizeCSSProxy.vwProp, 'stale');
    document.documentElement.style.setProperty(ESLVSizeCSSProxy.vhProp, 'stale');

    ESLVSizeCSSProxy.destroy();

    expect(ESLEventUtils.listeners(instance)).toHaveLength(0);

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

  test('unobserve() remains a backward-compatible alias for destroy()', () => {
    ESLVSizeCSSProxy.init();

    expect(ESLEventUtils.listeners(instance)).toHaveLength(2);

    document.documentElement.style.setProperty(ESLVSizeCSSProxy.vwProp, 'stale');
    document.documentElement.style.setProperty(ESLVSizeCSSProxy.vhProp, 'stale');

    ESLVSizeCSSProxy.unobserve();

    expect(ESLEventUtils.listeners(instance)).toHaveLength(0);
    expect(document.documentElement.style.getPropertyValue(ESLVSizeCSSProxy.vwProp)).toBe('');
    expect(document.documentElement.style.getPropertyValue(ESLVSizeCSSProxy.vhProp)).toBe('');
  });

  test('observe() remains a backward-compatible alias for init()', () => {
    ESLVSizeCSSProxy.observe();

    expect(ESLEventUtils.listeners(instance)).toHaveLength(2);
  });
});

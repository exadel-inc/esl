import {ESLSwipeGestureEvent, ESLSwipeGestureTarget} from '../../core/targets/swipe.target';
import {promisifyTimeout} from '../../../esl-utils/async/promise/timeout';

describe('ESLSwipeGestureTarget EventTarget', () => {
  describe('ESLSwipeGestureTarget do not throws error on incorrect input (silent processing)', () => {
    const consoleSpy = jest.spyOn(console, 'warn');
    beforeEach(() => consoleSpy.mockReset().mockImplementation(() => void 0));
    afterAll(() => consoleSpy.mockRestore());

    test('ESLResizeObserverTarget.for(undefined) returns null without error', () => {
      expect(ESLSwipeGestureTarget.for(undefined as any)).toBeNull();
      expect(consoleSpy).toBeCalled();
    });

    test('ESLResizeObserverTarget.for(null) returns null without error', () => {
      expect(ESLSwipeGestureTarget.for(null as any)).toBeNull();
      expect(consoleSpy).toBeCalled();
    });

    test('ESLResizeObserverTarget.for(123) returns null without error', () => {
      expect(ESLSwipeGestureTarget.for(123 as any)).toBeNull();
      expect(consoleSpy).toBeCalled();
    });

    test('ESLResizeObserverTarget.for({}) returns null without error', () => {
      expect(ESLSwipeGestureTarget.for({} as any)).toBeNull();
      expect(consoleSpy).toBeCalled();
    });
  });

  describe('ESLSwipeGestureTarget instance without subscription is light', () => {
    const $el = document.createElement('div');
    const addEventListenerSpy = jest.spyOn($el, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn($el, 'removeEventListener');
    const target = ESLSwipeGestureTarget.for($el);
    const listener1 = jest.fn();
    const listener2 = jest.fn();

    test('ESLSwipeGestureTarget does not produce subscription on creation', () => {
      expect(addEventListenerSpy).not.toBeCalled();
      expect(removeEventListenerSpy).not.toBeCalled();
    });

    test('ESLSwipeGestureTarget does not produce subscription on creation', () => {
      target.addEventListener('swipe', listener1);
      expect(addEventListenerSpy).toBeCalled();
      expect(removeEventListenerSpy).not.toBeCalled();
      target.addEventListener('swipe', listener2);
      expect(addEventListenerSpy).toBeCalled();
      expect(removeEventListenerSpy).not.toBeCalled();
    });

    test('ESLSwipeGestureTarget does not produce subscription on creation', () => {
      target.removeEventListener('swipe', listener1);
      expect(removeEventListenerSpy).not.toBeCalled();
      target.removeEventListener('swipe', listener2);
      expect(removeEventListenerSpy).toBeCalled();
    });
  });

  describe('ESLSwipeGestureTarget detects swipe gesture', () => {
    const $el = document.createElement('div');
    const target = ESLSwipeGestureTarget.for($el, {timeout: 50});
    const listener = jest.fn();

    beforeAll(() => target.addEventListener('swipe', listener));
    afterAll(() => target.removeEventListener('swipe', listener));
    beforeEach(() => listener.mockReset());

    test('ESLSwipeGestureTarget detects left swipe', async () => {
      $el.dispatchEvent(Object.assign(new Event('pointerdown'), {clientX: 100, clientY: 100}));
      $el.dispatchEvent(Object.assign(new Event('pointerup'), {clientX: 50, clientY: 100}));
      expect(listener).lastCalledWith(expect.any(ESLSwipeGestureEvent));
      expect(listener).lastCalledWith(expect.objectContaining({direction: 'left'}));
      expect(listener).lastCalledWith(expect.objectContaining({angle: 270}));
    });

    test('ESLSwipeGestureTarget detects right swipe', async () => {
      $el.dispatchEvent(Object.assign(new Event('pointerdown'), {clientX: 100, clientY: 100}));
      $el.dispatchEvent(Object.assign(new Event('pointerup'), {clientX: 150, clientY: 100}));
      expect(listener).lastCalledWith(expect.any(ESLSwipeGestureEvent));
      expect(listener).lastCalledWith(expect.objectContaining({direction: 'right'}));
      expect(listener).lastCalledWith(expect.objectContaining({angle: 90}));
    });

    test('ESLSwipeGestureTarget detects up swipe', async () => {
      $el.dispatchEvent(Object.assign(new Event('pointerdown'), {clientX: 100, clientY: 100}));
      $el.dispatchEvent(Object.assign(new Event('pointerup'), {clientX: 100, clientY: 50}));
      expect(listener).lastCalledWith(expect.any(ESLSwipeGestureEvent));
      expect(listener).lastCalledWith(expect.objectContaining({direction: 'up'}));
      expect(listener).lastCalledWith(expect.objectContaining({angle: 0}));
    });

    test('ESLSwipeGestureTarget detects down swipe', async () => {
      $el.dispatchEvent(Object.assign(new Event('pointerdown'), {clientX: 100, clientY: 100}));
      $el.dispatchEvent(Object.assign(new Event('pointerup'), {clientX: 100, clientY: 150}));
      expect(listener).lastCalledWith(expect.any(ESLSwipeGestureEvent));
      expect(listener).lastCalledWith(expect.objectContaining({direction: 'down'}));
      expect(listener).lastCalledWith(expect.objectContaining({angle: 180}));
    });

    test('ESLSwipeGestureTarget ignores short horizontal swipes', async () => {
      $el.dispatchEvent(Object.assign(new Event('pointerdown'), {clientX: 100, clientY: 100}));
      $el.dispatchEvent(Object.assign(new Event('pointerup'), {clientX: 110, clientY: 105}));
      expect(listener).not.toBeCalled();
    });

    test('ESLSwipeGestureTarget ignores short vertical swipes', async () => {
      $el.dispatchEvent(Object.assign(new Event('pointerdown'), {clientX: 100, clientY: 100}));
      $el.dispatchEvent(Object.assign(new Event('pointerup'), {clientX: 105, clientY: 110}));
      expect(listener).not.toBeCalled();
    });

    test('ESLSwipeGestureTarget ignores long - lasting swipe', async () => {
      $el.dispatchEvent(Object.assign(new Event('pointerdown'), {clientX: 100, clientY: 100}));
      await promisifyTimeout(150);
      $el.dispatchEvent(Object.assign(new Event('pointerup'), {clientX: 210, clientY: 105}));
      expect(listener).not.toBeCalled();
    });

    test('ESLSwipeGestureTarget ignores unlinked events', async () => {
      $el.dispatchEvent(Object.assign(new Event('pointerup'), {clientX: 210, clientY: 105}));
      expect(listener).not.toBeCalled();
    });

    test('ESLSwipeGestureTarget processes diagonal swipes', async () => {
      $el.dispatchEvent(Object.assign(new Event('pointerdown'), {clientX: 100, clientY: 100}));
      $el.dispatchEvent(Object.assign(new Event('pointerup'), {clientX: 150, clientY: 150}));
      expect(listener).toHaveBeenCalledWith(expect.objectContaining({direction: 'right'}));
    });

    test('ESLSwipeGestureTarget processes diagonal swipes', async () => {
      $el.dispatchEvent(Object.assign(new Event('pointerdown'), {clientX: 100, clientY: 100}));
      $el.dispatchEvent(Object.assign(new Event('pointerup'), {clientX: 50, clientY: 50}));
      expect(listener).toHaveBeenCalledWith(expect.objectContaining({direction: 'left'}));
    });
  });
});

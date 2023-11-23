import {promisifyTimeout} from '../../../esl-utils/async/promise/timeout';
import {ESLWheelEvent, ESLWheelTarget} from '../../core/targets/wheel.target';

describe('ESLWheelTarget', () => {
  describe('ESLWheelTarget do not throws error on incorrect input (silent processing)', () => {
    const consoleSpy = jest.spyOn(console, 'warn');
    beforeEach(() => consoleSpy.mockReset().mockImplementation(() => void 0));
    afterAll(() => consoleSpy.mockRestore());

    test('ESLWheelTarget.for(undefined) returns null without error', () => {
      expect(ESLWheelTarget.for(undefined as any)).toBeNull();
      expect(consoleSpy).toBeCalled();
    });

    test('ESLWheelTarget.for(null) returns null without error', () => {
      expect(ESLWheelTarget.for(null as any)).toBeNull();
      expect(consoleSpy).toBeCalled();
    });

    test('ESLWheelTarget.for(123) returns null without error', () => {
      expect(ESLWheelTarget.for(123 as any)).toBeNull();
      expect(consoleSpy).toBeCalled();
    });

    test('ESLWheelTarget.for({}) returns null without error', () => {
      expect(ESLWheelTarget.for({} as any)).toBeNull();
      expect(consoleSpy).toBeCalled();
    });
  });

  describe('ESLWheelTarget instance without subscription', () => {
    const $el = document.createElement('div');
    const addEventListenerSpy = jest.spyOn($el, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn($el, 'removeEventListener');
    const target = ESLWheelTarget.for($el);
    const listener1 = jest.fn();
    const listener2 = jest.fn();

    test('ESLWheelTarget does not produce subscription on creation', () => {
      expect(addEventListenerSpy).not.toBeCalled();
      expect(removeEventListenerSpy).not.toBeCalled();
    });

    test('ESLWheelTarget doesn`t unsubscribe listeners automatically', () => {
      target.addEventListener('longwheel', listener1);
      expect(addEventListenerSpy).toBeCalled();
      expect(removeEventListenerSpy).not.toBeCalled();
      target.addEventListener('longwheel', listener2);
      expect(addEventListenerSpy).toBeCalled();
      expect(removeEventListenerSpy).not.toBeCalled();
    });

    test('ESLWheelTarget doesn`t unsubscrie until last subscription is removed from target', () => {
      target.removeEventListener('longwheel', listener1);
      expect(removeEventListenerSpy).not.toBeCalled();
      target.removeEventListener('longwheel', listener2);
      expect(removeEventListenerSpy).toBeCalled();
    });
  });

  describe('ESLWheelTarget doesn`t detect long scroll events', () => {
    const $el = document.createElement('div');
    const target = ESLWheelTarget.for($el, {timeout: 50, distance: 101});
    const listener = jest.fn();

    beforeAll(() => target.addEventListener('longwheel', listener));
    afterAll(() => target.removeEventListener('longwheel', listener));
    beforeEach(() => listener.mockReset());

    test('ESLWheelTarget doesn`t detect horizontal short swipe', async () => {
      $el.dispatchEvent(Object.assign(new Event('wheel'), {deltaX: 100}));
      await promisifyTimeout(50);
      expect(listener).not.toBeCalled();
    });

    test('ESLWheelTarget doesn`t detect vertical short swipe', async () => {
      $el.dispatchEvent(Object.assign(new Event('wheel'), {deltaY: 100}));
      await promisifyTimeout(50);
      expect(listener).not.toBeCalled();
    });

    test('ESLWheelTarget doesn`t detect horizontal and vertical short swipe', async () => {
      $el.dispatchEvent(Object.assign(new Event('wheel'), {deltaX: 100, deltaY: 100}));
      await promisifyTimeout(50);
      expect(listener).not.toBeCalled();
    });

    test('ESLWheelTarge should handle rapid alternation in scroll direction without false positives', async () => {
      $el.dispatchEvent(Object.assign(new Event('wheel'), {deltaX: 50}));
      $el.dispatchEvent(Object.assign(new Event('wheel'), {deltaX: -50}));
      $el.dispatchEvent(Object.assign(new Event('wheel'), {deltaX: 50}));
      $el.dispatchEvent(Object.assign(new Event('wheel'), {deltaX: -50}));
      await promisifyTimeout(50);
      expect(listener).not.toBeCalled();
    });

    test('ESLWheelTarge shouldn`t detect long scroll when scrolls are beyond timeout', async () => {
      $el.dispatchEvent(Object.assign(new Event('wheel'), {deltaX: 100}));
      await promisifyTimeout(50);
      $el.dispatchEvent(Object.assign(new Event('wheel'), {deltaX: 100}));
      await promisifyTimeout(50);
      expect(listener).not.toBeCalled();
    });
  });

  describe('ESLWheelTarget detects long scroll events', () => {
    const $el = document.createElement('div');
    const target = ESLWheelTarget.for($el, {timeout: 50, distance: 100});
    const listener = jest.fn();

    beforeAll(() => target.addEventListener('longwheel', listener));
    afterAll(() => target.removeEventListener('longwheel', listener));
    beforeEach(() => listener.mockReset());

    test('ESLWheelTarget detects horizontal long swipe', async () => {
      $el.dispatchEvent(Object.assign(new Event('wheel'), {deltaX: 100}));
      await promisifyTimeout(50);
      expect(listener).lastCalledWith(expect.any(ESLWheelEvent));
      expect(listener).lastCalledWith(expect.objectContaining({deltaX: 100, axis: 'x'}));
    });

    test('ESLWheelTarget detects horizontal long swipe (using shift key)', async () => {
      $el.dispatchEvent(Object.assign(new Event('wheel'), {deltaY: 100, shiftKey: true}));
      await promisifyTimeout(50);
      expect(listener).lastCalledWith(expect.any(ESLWheelEvent));
      expect(listener).lastCalledWith(expect.objectContaining({deltaX: 100, axis: 'x'}));
    });

    test('ESLWheelTarget detects vertical long swipe', async () => {
      $el.dispatchEvent(Object.assign(new Event('wheel'), {deltaY: 100}));
      await promisifyTimeout(50);
      expect(listener).lastCalledWith(expect.any(ESLWheelEvent));
      expect(listener).lastCalledWith(expect.objectContaining({deltaY: 100, axis: 'y'}));
    });

    test('ESLWheelTarget detects negative vertical long swipe', async () => {
      $el.dispatchEvent(Object.assign(new Event('wheel'), {deltaY: -100}));
      await promisifyTimeout(50);
      expect(listener).lastCalledWith(expect.any(ESLWheelEvent));
      expect(listener).lastCalledWith(expect.objectContaining({deltaY: -100, axis: 'y'}));
    });

    test('ESLWheelTarget detects both horizontal and vertical long swipes withing time limit', async () => {
      $el.dispatchEvent(Object.assign(new Event('wheel'), {deltaX: 100, deltaY: 200}));
      await promisifyTimeout(50);
      expect(listener).toBeCalledTimes(2);
      expect(listener.mock.calls.slice(-1)[0][0]).toEqual(expect.objectContaining({deltaY: 200, axis: 'y'}));
      expect(listener.mock.calls.slice(0)[0][0]).toEqual(expect.objectContaining({deltaX: 100, axis: 'x'}));
    });

    test('ESLWheelTarget detects long scroll when multiple small scrolls exceed distance', async () => {
      $el.dispatchEvent(Object.assign(new Event('wheel'), {deltaX: 50}));
      $el.dispatchEvent(Object.assign(new Event('wheel'), {deltaX: 50}));
      $el.dispatchEvent(Object.assign(new Event('wheel'), {deltaX: 50}));
      $el.dispatchEvent(Object.assign(new Event('wheel'), {deltaX: 50}));
      await promisifyTimeout(50);
      expect(listener).toBeCalled();
      expect(listener).lastCalledWith(expect.objectContaining({deltaX: 200, axis: 'x'}));
    });
  });
});

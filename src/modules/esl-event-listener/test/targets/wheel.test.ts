import {ESLWheelEvent, ESLWheelTarget} from '../../core/targets/wheel.target';

describe('ESLWheelTarget', () => {
  jest.useFakeTimers();

  describe('ESLWheelTarget does not throw error on incorrect input (silent processing)', () => {
    const consoleSpy = jest.spyOn(console, 'warn');
    beforeEach(() => consoleSpy.mockReset().mockImplementation(() => void 0));
    afterAll(() => consoleSpy.mockRestore());

    test('ESLWheelTarget.for(undefined) returns null without error', () => {
      expect(ESLWheelTarget.for(undefined as any)).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
    });

    test('ESLWheelTarget.for(null) returns null without error', () => {
      expect(ESLWheelTarget.for(null as any)).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
    });

    test('ESLWheelTarget.for(123) returns null without error', () => {
      expect(ESLWheelTarget.for(123 as any)).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
    });

    test('ESLWheelTarget.for({}) returns null without error', () => {
      expect(ESLWheelTarget.for({} as any)).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('ESLWheelTarget instance subscription', () => {
    const $el = document.createElement('div');
    const addEventListenerSpy = jest.spyOn($el, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn($el, 'removeEventListener');
    const target = ESLWheelTarget.for($el);
    const listener1 = jest.fn();
    const listener2 = jest.fn();

    test('ESLWheelTarget does not produce subscription on creation', () => {
      expect(addEventListenerSpy).not.toHaveBeenCalled();
      expect(removeEventListenerSpy).not.toHaveBeenCalled();
    });

    test('ESLWheelTarget subscribes once on first subscription', () => {
      target.addEventListener('longwheel', listener1);
      expect(addEventListenerSpy).toHaveBeenCalledTimes(1);
      expect(removeEventListenerSpy).not.toHaveBeenCalled();
      target.addEventListener('longwheel', listener2);
      expect(addEventListenerSpy).toHaveBeenCalledTimes(1);
      expect(removeEventListenerSpy).not.toHaveBeenCalled();
    });

    test('ESLWheelTarget doesn`t unsubscrie until last subscription is removed from target', () => {
      target.removeEventListener('longwheel', listener1);
      expect(removeEventListenerSpy).not.toHaveBeenCalled();
      target.removeEventListener('longwheel', listener2);
      expect(removeEventListenerSpy).toHaveBeenCalled();
    });
  });

  describe('ESLWheelTarget instance ignore predicate support', () => {
    const $el = document.createElement('div');
    const target = ESLWheelTarget.for($el, {
      distance: 50,
      timeout: 10,
      ignore: (e) => e.deltaX === 0
    });
    const listener = jest.fn();

    beforeAll(() => target.addEventListener('longwheel', listener));
    afterAll(() => target.removeEventListener('longwheel', listener));
    beforeEach(() => listener.mockReset());

    test('ESLWheelTarget ignores vertical scroll when predicate filter deltaX amount', () => {
      $el.dispatchEvent(Object.assign(new Event('wheel'), {deltaX: 0, deltaY: 100}));
      jest.advanceTimersByTime(100);
      expect(listener).not.toHaveBeenCalled();
    });

    test('ESLWheelTarget doesn\'t ignore horizontal scroll when predicate filter deltaX amount', () => {
      $el.dispatchEvent(Object.assign(new Event('wheel'), {deltaX: 100, deltaY: 0}));
      jest.advanceTimersByTime(100);
      expect(listener).toHaveBeenCalled();
    });
  });

  describe('ESLWheelTarget ignores "short" scroll events', () => {
    const $el = document.createElement('div');
    const target = ESLWheelTarget.for($el, {timeout: 50, distance: 101});
    const listener = jest.fn();

    beforeAll(() => target.addEventListener('longwheel', listener));
    afterAll(() => target.removeEventListener('longwheel', listener));
    beforeEach(() => listener.mockReset());

    test('ESLWheelTarget ignores horizontal short swipe', () => {
      $el.dispatchEvent(Object.assign(new Event('wheel'), {deltaX: 100}));
      jest.advanceTimersByTime(50);
      expect(listener).not.toHaveBeenCalled();
    });

    test('ESLWheelTarget ignores vertical short swipe',  () => {
      $el.dispatchEvent(Object.assign(new Event('wheel'), {deltaY: 100}));
      jest.advanceTimersByTime(50);
      expect(listener).not.toHaveBeenCalled();
    });

    test('ESLWheelTarget ignores diagonal short swipe', () => {
      $el.dispatchEvent(Object.assign(new Event('wheel'), {deltaX: 100, deltaY: 100}));
      jest.advanceTimersByTime(50);
      expect(listener).not.toHaveBeenCalled();
    });

    test('ESLWheelTarget should handle rapid alternation in scroll direction without false positives', () => {
      $el.dispatchEvent(Object.assign(new Event('wheel'), {deltaX: 50}));
      $el.dispatchEvent(Object.assign(new Event('wheel'), {deltaX: -50}));
      $el.dispatchEvent(Object.assign(new Event('wheel'), {deltaX: 50}));
      $el.dispatchEvent(Object.assign(new Event('wheel'), {deltaX: -50}));
      jest.advanceTimersByTime(50);
      expect(listener).not.toHaveBeenCalled();
    });

    test('ESLWheelTarget should ignore long scroll when scrolls are beyond timeout', () => {
      $el.dispatchEvent(Object.assign(new Event('wheel'), {deltaX: 100}));
      jest.advanceTimersByTime(50);
      $el.dispatchEvent(Object.assign(new Event('wheel'), {deltaX: 100}));
      jest.advanceTimersByTime(50);
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('ESLWheelTarget detects long scroll events', () => {
    const $el = document.createElement('div');
    const target = ESLWheelTarget.for($el, {timeout: 50, distance: 100});
    const listener = jest.fn();

    beforeAll(() => target.addEventListener('longwheel', listener));
    afterAll(() => target.removeEventListener('longwheel', listener));
    beforeEach(() => listener.mockReset());

    test('ESLWheelTarget detects horizontal long scroll', () => {
      $el.dispatchEvent(Object.assign(new Event('wheel'), {deltaX: 100}));
      jest.advanceTimersByTime(50);
      expect(listener).toHaveBeenLastCalledWith(expect.any(ESLWheelEvent));
      expect(listener).toHaveBeenLastCalledWith(expect.objectContaining({deltaX: 100, axis: 'x'}));
    });

    test('ESLWheelTarget detects horizontal long scroll with a shift key pressed', () => {
      $el.dispatchEvent(Object.assign(new Event('wheel'), {deltaY: 100, shiftKey: true}));
      jest.advanceTimersByTime(50);
      expect(listener).toHaveBeenLastCalledWith(expect.any(ESLWheelEvent));
      expect(listener).toHaveBeenLastCalledWith(expect.objectContaining({deltaX: 100, axis: 'x'}));
    });

    test('ESLWheelTarget detects vertical long scroll', () => {
      $el.dispatchEvent(Object.assign(new Event('wheel'), {deltaY: 100}));
      jest.advanceTimersByTime(50);
      expect(listener).toHaveBeenLastCalledWith(expect.any(ESLWheelEvent));
      expect(listener).toHaveBeenLastCalledWith(expect.objectContaining({deltaY: 100, axis: 'y'}));
    });

    test('ESLWheelTarget detects negative vertical long scroll', () => {
      $el.dispatchEvent(Object.assign(new Event('wheel'), {deltaY: -100}));
      jest.advanceTimersByTime(50);
      expect(listener).toHaveBeenLastCalledWith(expect.any(ESLWheelEvent));
      expect(listener).toHaveBeenLastCalledWith(expect.objectContaining({deltaY: -100, axis: 'y'}));
    });

    test('ESLWheelTarget detects both horizontal and vertical long scrolls withing time limit', () => {
      $el.dispatchEvent(Object.assign(new Event('wheel'), {deltaX: 100, deltaY: 200}));
      jest.advanceTimersByTime(50);
      expect(listener).toHaveBeenCalledTimes(2);
      expect(listener.mock.calls.slice(-1)[0][0]).toEqual(expect.objectContaining({deltaY: 200, axis: 'y'}));
      expect(listener.mock.calls.slice(0)[0][0]).toEqual(expect.objectContaining({deltaX: 100, axis: 'x'}));
    });

    test('ESLWheelTarget detects long scroll when multiple small scrolls exceed distance', async () => {
      $el.dispatchEvent(Object.assign(new Event('wheel'), {deltaX: 50}));
      $el.dispatchEvent(Object.assign(new Event('wheel'), {deltaX: 50}));
      $el.dispatchEvent(Object.assign(new Event('wheel'), {deltaX: 50}));
      $el.dispatchEvent(Object.assign(new Event('wheel'), {deltaX: 50}));
      jest.advanceTimersByTime(50);
      expect(listener).toHaveBeenCalled();
      expect(listener).toHaveBeenLastCalledWith(expect.objectContaining({deltaX: 200, axis: 'x'}));
    });
  });
});

import {ESLSwipeGestureEvent, ESLSwipeGestureTarget} from '../../core/targets/swipe.target';
import {promisifyTimeout} from '../../../esl-utils/async/promise/timeout';
import {overrideEvent} from '../../../esl-utils/dom/events/misc';

describe('ESLSwipeGestureTarget EventTarget', () => {
  describe('ESLSwipeGestureTarget do not throws error on incorrect input (silent processing)', () => {
    const consoleSpy = jest.spyOn(console, 'warn');
    beforeEach(() => consoleSpy.mockReset().mockImplementation(() => void 0));
    afterAll(() => consoleSpy.mockRestore());

    test('ESLResizeObserverTarget.for(undefined) returns null without error', () => {
      expect(ESLSwipeGestureTarget.for(undefined as any)).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
    });

    test('ESLResizeObserverTarget.for(null) returns null without error', () => {
      expect(ESLSwipeGestureTarget.for(null as any)).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
    });

    test('ESLResizeObserverTarget.for(123) returns null without error', () => {
      expect(ESLSwipeGestureTarget.for(123 as any)).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
    });

    test('ESLResizeObserverTarget.for({}) returns null without error', () => {
      expect(ESLSwipeGestureTarget.for({} as any)).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
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
      expect(addEventListenerSpy).not.toHaveBeenCalled();
      expect(removeEventListenerSpy).not.toHaveBeenCalled();
    });

    test('ESLSwipeGestureTarget doesn`t unsubscribe old listeners upon adding new ones', () => {
      target.addEventListener('swipe', listener1);
      expect(addEventListenerSpy).toHaveBeenCalled();
      expect(removeEventListenerSpy).not.toHaveBeenCalled();
      target.addEventListener('swipe', listener2);
      expect(addEventListenerSpy).toHaveBeenCalled();
      expect(removeEventListenerSpy).not.toHaveBeenCalled();
    });

    test('ESLSwipeGestureTarget doesn`t unsubscrie until last subscription is removed from target', () => {
      target.removeEventListener('swipe', listener1);
      expect(removeEventListenerSpy).not.toHaveBeenCalled();
      target.removeEventListener('swipe', listener2);
      expect(removeEventListenerSpy).toHaveBeenCalled();
    });
  });

  describe('ESLSwipeGestureTarget detects swipe gesture', () => {
    const START_EVENT = 'mousedown';
    const END_EVENT = 'mouseup';

    const createEvent = (type: string, details: Record<string, any>): Event => {
      const event = new MouseEvent(type, {bubbles: true});
      Object.keys(details).forEach((key: keyof Event) => overrideEvent(event, key, details[key]));
      return event;
    };

    const $el = document.createElement('div');
    const target = ESLSwipeGestureTarget.for($el, {timeout: 150});
    const listener = jest.fn();

    beforeAll(() => target.addEventListener('swipe', listener));
    afterAll(() => target.removeEventListener('swipe', listener));
    beforeEach(() => listener.mockReset());

    test('ESLSwipeGestureTarget detects left swipe', async () => {
      $el.dispatchEvent(createEvent(START_EVENT, {pageX: 100, pageY: 100}));
      window.dispatchEvent(createEvent(END_EVENT, {pageX: 50, pageY: 100, target: $el}));
      expect(listener).toHaveBeenLastCalledWith(expect.any(ESLSwipeGestureEvent));
      expect(listener).toHaveBeenLastCalledWith(expect.objectContaining({direction: 'left'}));
      expect(listener).toHaveBeenLastCalledWith(expect.objectContaining({angle: 270}));
    });

    test('ESLSwipeGestureTarget detects right swipe', async () => {
      $el.dispatchEvent(createEvent(START_EVENT, {pageX: 100, pageY: 100}));
      window.dispatchEvent(createEvent(END_EVENT, {pageX: 150, pageY: 100, target: $el}));
      expect(listener).toHaveBeenLastCalledWith(expect.any(ESLSwipeGestureEvent));
      expect(listener).toHaveBeenLastCalledWith(expect.objectContaining({direction: 'right'}));
      expect(listener).toHaveBeenLastCalledWith(expect.objectContaining({angle: 90}));
    });

    test('ESLSwipeGestureTarget detects up swipe', async () => {
      $el.dispatchEvent(createEvent(START_EVENT, {pageX: 100, pageY: 100}));
      window.dispatchEvent(createEvent(END_EVENT, {pageX: 100, pageY: 50, target: $el}));
      expect(listener).toHaveBeenLastCalledWith(expect.any(ESLSwipeGestureEvent));
      expect(listener).toHaveBeenLastCalledWith(expect.objectContaining({direction: 'up'}));
      expect(listener).toHaveBeenLastCalledWith(expect.objectContaining({angle: 0}));
    });

    test('ESLSwipeGestureTarget detects down swipe', async () => {
      $el.dispatchEvent(createEvent(START_EVENT, {pageX: 100, pageY: 100}));
      window.dispatchEvent(createEvent(END_EVENT, {pageX: 100, pageY: 150, target: $el}));
      expect(listener).toHaveBeenLastCalledWith(expect.any(ESLSwipeGestureEvent));
      expect(listener).toHaveBeenLastCalledWith(expect.objectContaining({direction: 'down'}));
      expect(listener).toHaveBeenLastCalledWith(expect.objectContaining({angle: 180}));
    });

    test('ESLSwipeGestureTarget ignores short horizontal swipes', async () => {
      $el.dispatchEvent(createEvent(START_EVENT, {pageX: 100, pageY: 100}));
      window.dispatchEvent(createEvent(END_EVENT, {pageX: 110, pageY: 105, target: $el}));
      expect(listener).not.toHaveBeenCalled();
    });

    test('ESLSwipeGestureTarget ignores short vertical swipes', async () => {
      $el.dispatchEvent(createEvent(START_EVENT, {pageX: 100, pageY: 100}));
      window.dispatchEvent(createEvent(END_EVENT, {pageX: 105, pageY: 110, target: $el}));
      expect(listener).not.toHaveBeenCalled();
    });

    test('ESLSwipeGestureTarget ignores long - lasting swipe', async () => {
      $el.dispatchEvent(createEvent(START_EVENT, {pageX: 100, pageY: 100}));
      await promisifyTimeout(200);
      window.dispatchEvent(createEvent(END_EVENT, {pageX: 210, pageY: 105, target: $el}));
      expect(listener).not.toHaveBeenCalled();
    });

    test('ESLSwipeGestureTarget ignores unlinked events', async () => {
      window.dispatchEvent(createEvent(END_EVENT, {pageX: 210, pageY: 105, target: $el}));
      expect(listener).not.toHaveBeenCalled();
    });

    test('ESLSwipeGestureTarget processes diagonal swipes', async () => {
      $el.dispatchEvent(createEvent(START_EVENT, {pageX: 100, pageY: 100}));
      window.dispatchEvent(createEvent(END_EVENT, {pageX: 150, pageY: 150, target: $el}));
      expect(listener).toHaveBeenCalledWith(expect.objectContaining({direction: 'right'}));
    });

    test('ESLSwipeGestureTarget processes diagonal swipes', async () => {
      $el.dispatchEvent(createEvent(START_EVENT, {pageX: 100, pageY: 100}));
      window.dispatchEvent(createEvent(END_EVENT, {pageX: 50, pageY: 50, target: $el}));
      expect(listener).toHaveBeenCalledWith(expect.objectContaining({direction: 'left'}));
    });
  });
});

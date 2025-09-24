import {
  isMouseEvent,
  isTouchEvent,
  isPointerEvent,
  isPassiveByDefault,
  getTouchPoint,
  getOffsetPoint,
  getCompositeTarget,
  dispatchCustomEvent
} from '../misc';

describe('dom/events: misc', () => {
  describe('source', () => {
    test('returns source for the event with non-empty composedPath', () => {
      const source = {detail: Math.random()};

      expect(getCompositeTarget({
        composedPath: () => [source]
      } as any)).toBe(source);
    });
    test('returns source for the event with empty composedPath', () => {
      expect(getCompositeTarget({
        composedPath: () => []
      } as any)).toBe(undefined);
    });
    test('returns source for the event with no composedPath', () => {
      const source = {detail: Math.random()};

      expect(getCompositeTarget({target: source} as any)).toBe(source);
    });
  });

  describe('type guards', () => {
    beforeAll(() => {
      window.PointerEvent = window.PointerEvent || class PointerEvent extends Event {};
    });

    test('MouseEvent', () => {
      expect(isMouseEvent(new MouseEvent('mouseenter'))).toBe(true);
      expect(isMouseEvent(new TouchEvent('touchstart'))).toBe(false);
      expect(isMouseEvent(new PointerEvent('pointerup'))).toBe(false);
      expect(isMouseEvent(new Event('test'))).toBe(false);
    });
    test('TouchEvent', () => {
      expect(isTouchEvent(new MouseEvent('mouseenter'))).toBe(false);
      expect(isTouchEvent(new TouchEvent('touchstart'))).toBe(true);
      expect(isTouchEvent(new PointerEvent('pointerup'))).toBe(false);
      expect(isTouchEvent(new Event('test'))).toBe(false);
    });
    test('PointerEvent', () => {
      expect(isPointerEvent(new MouseEvent('mouseenter'))).toBe(false);
      expect(isPointerEvent(new TouchEvent('touchstart'))).toBe(false);
      expect(isPointerEvent(new PointerEvent('pointerup'))).toBe(true);
      expect(isPointerEvent(new Event('test'))).toBe(false);
    });

    test('passive events', () => {
      expect(isPassiveByDefault('wheel')).toBe(true);
      expect(isPassiveByDefault('mousewheel')).toBe(true);
      expect(isPassiveByDefault('touchmove')).toBe(true);
      expect(isPassiveByDefault('touchstart')).toBe(true);

      expect(isPassiveByDefault('click')).toBe(false);
      expect(isPassiveByDefault('mousedown')).toBe(false);
      expect(isPassiveByDefault('mousemove')).toBe(false);
      expect(isPassiveByDefault('keydown')).toBe(false);
    });
  });

  describe('touchPoint', () => {
    let pageX: number;
    let pageY: number;

    beforeEach(() => {
      pageX = Math.random();
      pageY = Math.random();
    });

    test('returns normalized data from TouchEvent object', () => {
      const event = new TouchEvent('touch', {
        changedTouches: [{
          pageX,
          pageY,
        } as any]
      });
      expect(getTouchPoint(event)).toEqual({x: pageX, y: pageY});
    });

    test('returns normalized data from PointerEvent object', () => {
      const event = new Event('pointer') as PointerEvent;
      Object.assign(event, {
        pageX,
        pageY
      });
      expect(getTouchPoint(event)).toEqual({x: pageX, y: pageY});
    });
  });

  describe('offsetPoint', () => {
    test('returns normalized coordinates', () => {
      const elem = document.createElement('div');
      const boundingClientRect = {
        left: 10,
        top: 20,
      } as DOMRect;
      jest.spyOn(elem, 'getBoundingClientRect').mockReturnValue(boundingClientRect);

      Object.assign(window, {
        scrollX: 100,
        scrollY: 200,
      });

      expect(getOffsetPoint(elem)).toEqual({
        x:  (boundingClientRect.left + window.scrollX),
        y:  (boundingClientRect.top + window.scrollY)
      });
    });
  });

  describe('dispatchCustomEvent works correctly', () => {
    const el = document.createElement('div');
    const mockDispatch = jest.spyOn(el, 'dispatchEvent');

    beforeEach(() => mockDispatch.mockReset());

    test('dispatchCustomEvent dispatches CustomEvent instance on the provided element', () => {
      const eventName = `click${Math.random()}`;
      const customEventInit = {detail: Math.random()};
      dispatchCustomEvent(el, eventName, customEventInit);

      expect(el.dispatchEvent).toHaveBeenCalled();

      const event: CustomEvent = (el.dispatchEvent as jest.Mock).mock.calls[0][0];
      expect(event.type).toBe(eventName);
      expect(event.bubbles).toBe(true);
      expect(event.cancelable).toBe(true);
      expect((event as any).detail).toBe(customEventInit.detail);
    });

    test('dispatchCustomEvent dispatches CustomEvent instance with default params', () => {
      const eventName = `click${Math.random()}`;
      dispatchCustomEvent(el, eventName);

      expect(el.dispatchEvent).toHaveBeenCalled();
      const event: CustomEvent = (el.dispatchEvent as jest.Mock).mock.calls[0][0];
      expect(event.bubbles).toBe(true);
      expect(event.cancelable).toBe(true);
    });

    test('dispatchCustomEvent merge custom init before dispatching CustomEvent', () => {
      const eventName = `click${Math.random()}`;
      dispatchCustomEvent(el, eventName, {cancelable: false, bubbles: false});

      expect(el.dispatchEvent).toHaveBeenCalled();
      const event: CustomEvent = (el.dispatchEvent as jest.Mock).mock.calls[0][0];
      expect(event.bubbles).toBe(false);
      expect(event.cancelable).toBe(false);
    });

    test('dispatchCustomEvent does not dispatch empty event', () => {
      dispatchCustomEvent(el, '');
      expect(el.dispatchEvent).not.toHaveBeenCalled();
    });
  });
});

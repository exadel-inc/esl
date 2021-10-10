import { EventUtils } from '../events';

describe('EventUtils', () => {
  let pageX: number;
  let pageY: number;

  beforeEach(() => {
    pageX = Math.random();
    pageY = Math.random();
  });

  describe('dispatch', () => {
    it('dispatches event with custom event init  on the provided element', () => {
      const el = document.createElement('div');
      jest.spyOn(el, 'dispatchEvent');

      const eventName = `click${Math.random()}`;
      const customEventInit = { detail: Math.random() };
      EventUtils.dispatch(el, eventName, customEventInit);

      expect(el.dispatchEvent).toHaveBeenCalled();

      const event:CustomEvent = (el.dispatchEvent as jest.Mock).mock.calls[0][0];
      expect(event.type).toBe(eventName);
      expect((event as any).detail).toBe(customEventInit.detail);
    });
  });

  describe('source', () => {
    it('returns source for the event with non-empty composedPath', () => {
      const source = { detail: Math.random() };
      expect(EventUtils.source({
        composedPath: () => [source]
      } as any)).toBe(source);
    });
    it('returns source for the event with empty composedPath', () => {
      expect(EventUtils.source({
        composedPath: () => []
      } as any)).toBe(undefined);
    });
    it('returns source for the event with no composedPath', () => {
      const source = { detail: Math.random() };

      expect(EventUtils.source({ target: source } as any)).toBe(source);
    });
  });


  describe('normalizeTouchPoint', () => {
    it('returns normalized data from TouchEvent object', () => {
      const event = new TouchEvent('touch', {
        changedTouches: [{
        pageX,
        pageY,
      } as any]
    });
      expect(EventUtils.normalizeTouchPoint(event)).toEqual({x: pageX, y: pageY});
    });

    it('returns normalized data from PointerEvent object', () => {
      const event = new Event('pointer') as PointerEvent;
      Object.assign(event, {
        pageX,
        pageY
      });
      expect(EventUtils.normalizeTouchPoint(event)).toEqual({x: pageX, y: pageY});
    });
  });

  describe('normalizeCoordinates', () => {
    let originalPageYOffset: number;
    let originalPageXOffset: number;

    beforeEach(() => {
      originalPageXOffset = window.pageYOffset;
      originalPageXOffset = window.pageXOffset;
    });

    afterEach(() => {
      (window as any).pageXOffset = originalPageXOffset;
      (window as any).pageYOffset = originalPageYOffset
    });


    it('returns normalized coordinates', () => {
      const event = new Event('click') as MouseEvent;
      Object.assign(event, {
        pageX,
        pageY
      });

      const elem = document.createElement('div');
      const boundingClientRect = {
        left: 10,
        top: 20,
      }as DOMRect;
      jest.spyOn(elem, 'getBoundingClientRect').mockReturnValue(boundingClientRect);

      Object.assign(window, {
        pageXOffset: 100,
        pageYOffset: 200,
      });

      expect(EventUtils.normalizeCoordinates(event, elem)).toEqual({
        x:  pageX - (boundingClientRect.left + window.pageXOffset),
        y:  pageY - (boundingClientRect.top + window.pageYOffset),
      });
    });
  });

  describe('stopPropagation', () => {
    it('calls stopPropagation on event', () => {
      const stopPropagation = jest.fn();
      EventUtils.stopPropagation({
        stopPropagation
      } as any);
      expect(stopPropagation).toHaveBeenCalled();
    });

    it('does not call stopPropagation if no event provided', () => {
      expect(() => EventUtils.stopPropagation(undefined)).not.toThrowError();
    });
  });

  describe('preventDefault', () => {
    it('calls preventDefault on event', () => {
      const preventDefault = jest.fn();
      EventUtils.preventDefault({
        preventDefault
      } as any);
      expect(preventDefault).toHaveBeenCalled();
    });

    it('does not call preventDefault if no event provided', () => {
      expect(() => EventUtils.preventDefault(undefined)).not.toThrowError();
    });
  });
});

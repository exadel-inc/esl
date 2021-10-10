import * as eventsUtils from '../events';

describe('eventsUtils', () => {
  let pageX: number;
  let pageY: number;

  beforeEach(() => {
    pageX = Math.random();
    pageY = Math.random();
  });


  describe('normalizeTouchPoint', () => {
    it('returns normalized data from TouchEvent object', () => {
      const event = new TouchEvent('touch', {
        changedTouches: [{
        pageX,
        pageY,
      } as any]
    });
      expect(eventsUtils.normalizeTouchPoint(event)).toEqual({x: pageX, y: pageY});
    });

    it('returns normalized data from PointerEvent object', () => {
      const event = new Event('pointer') as PointerEvent;
      Object.assign(event, {
        pageX,
        pageY
      });
      expect(eventsUtils.normalizeTouchPoint(event)).toEqual({x: pageX, y: pageY});
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

      expect(eventsUtils.normalizeCoordinates(event, elem)).toEqual({
        x:  pageX - (boundingClientRect.left + window.pageXOffset),
        y:  pageY - (boundingClientRect.top + window.pageYOffset),
      });
    });
  });
});

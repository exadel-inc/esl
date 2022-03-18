import {EventUtils, isMouseEvent, isTouchEvent, offsetPoint, touchPoint} from '../events';

describe('dom/events: availability', () => {
  test.each([
    isMouseEvent,
    isTouchEvent,
    touchPoint,
    offsetPoint,

    EventUtils.dispatch,
    EventUtils.listeners,
    EventUtils.subscribe,
    EventUtils.unsubscribe
  ])('%p is available', (fn) => expect(typeof fn).toBe('function'));
});

import {EventUtils, isMouseEvent, isTouchEvent, getOffsetPoint, getTouchPoint} from '../events';

describe('dom/events: availability', () => {
  test.each([
    isMouseEvent,
    isTouchEvent,
    getTouchPoint,
    getOffsetPoint,

    EventUtils.dispatch,
    EventUtils.listeners,
    EventUtils.subscribe,
    EventUtils.unsubscribe
  ])('%p is available', (fn) => expect(typeof fn).toBe('function'));
});

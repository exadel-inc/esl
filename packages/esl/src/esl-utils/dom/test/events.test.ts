import {ESLEventUtils, isMouseEvent, isTouchEvent, getOffsetPoint, getTouchPoint} from '../events';

describe('dom/events: availability', () => {
  test.each([
    isMouseEvent,
    isTouchEvent,
    getTouchPoint,
    getOffsetPoint,

    ESLEventUtils.dispatch,
    ESLEventUtils.listeners,
    ESLEventUtils.subscribe,
    ESLEventUtils.unsubscribe
  ])('%o is available', (fn) => expect(typeof fn).toBe('function'));
});

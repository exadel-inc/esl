import {overrideEvent} from '../../../esl-utils/dom/events/misc';

/**
 * Swipe directions that could be provided in {@link ESLSwipeGestureEvent}
 */
export type SwipeDirection = 'left' | 'right' | 'up' | 'down';

/**
 * Event names that could be triggered by {@link ESLSwipeGestureTarget}
 */
export type SwipeEventName = 'swipe' | 'swipe:left' | 'swipe:right' | 'swipe:up' | 'swipe:down';

/**
 * Describes swipe information provided with {@link ESLSwipeGestureEvent}
 */
export interface ESLSwipeGestureEventInfo {
  target: Element;
  /** Swipe direction {@link SwipeDirection} */
  direction: SwipeDirection;
  /** Distance between the points where pointerdown and pointerup events occurred along the x axis */
  distanceX: number;
  /** Distance between the points where pointerdown and pointerup events occurred along the y axis */
  distanceY: number;
  /** Original pointerdown event */
  startEvent: PointerEvent;
  /** Original pointerup event */
  endEvent: PointerEvent;
}

/**
 * Creates swipe event dispatched by {@link ESLSwipeGestureTarget}
 */
export class ESLSwipeGestureEvent extends UIEvent {
  public override readonly target: Element;
  public swipeInfo: ESLSwipeGestureEventInfo;

  protected constructor(eventName: SwipeEventName, swipeInfo: ESLSwipeGestureEventInfo) {
    super(eventName, {bubbles: true, cancelable: true});
    this.swipeInfo = swipeInfo;
    overrideEvent(this, 'target', swipeInfo.target);
  }

  /** Creates {@link ESLSwipeGestureEvent} from {@link ESLSwipeGestureTarget} */
  public static fromConfig(eventName: SwipeEventName, swipeInfo: ESLSwipeGestureEventInfo): ESLSwipeGestureEvent {
    return new ESLSwipeGestureEvent(eventName, swipeInfo);
  }
}

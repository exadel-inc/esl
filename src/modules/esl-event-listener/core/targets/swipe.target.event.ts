import {overrideEvent} from '../../../esl-utils/dom/events/misc';

/**
 * Swipe directions that could be provided in {@link ESLSwipeGestureEvent}
 */
export type SwipeDirection = 'left' | 'right' | 'up' | 'down';

/**
 * Event names that could be triggered by {@link ESLSwipeGestureTarget}
 */
export type SwipeEventName = 'swipe';

/**
 * Describes swipe information provided with {@link ESLSwipeGestureEvent}
 */
export interface ESLSwipeGestureEventInfo {
  /** Swipe direction {@link SwipeDirection} */
  direction: SwipeDirection;
  /** Distance between the points where pointerdown and pointerup events occurred along the x-axis */
  distanceX: number;
  /** Distance between the points where pointerdown and pointerup events occurred along the y-axis */
  distanceY: number;
  /** Direct distance between the points where pointerdown and pointerup events occurred */
  distance: number;
  /** Clockwise angle between positive y-axis and swipe */
  angle: number;
  /** Original pointerdown event */
  startEvent: PointerEvent;
  /** Original pointerup event */
  endEvent: PointerEvent;
  /** Time between pointerdown and pointerup events */
  duration: number;
}

/**
 * Creates swipe event dispatched by {@link ESLSwipeGestureTarget}
 */
export class ESLSwipeGestureEvent extends UIEvent implements ESLSwipeGestureEventInfo {
  public override readonly target: Element;

  public readonly direction: SwipeDirection;
  public readonly distanceX: number;
  public readonly distanceY: number;
  public readonly distance: number;
  public readonly angle: number;
  public readonly endEvent: PointerEvent;
  public readonly startEvent: PointerEvent;
  public readonly duration: number;

  protected constructor(eventName: SwipeEventName, target: Element, swipeInfo: ESLSwipeGestureEventInfo) {
    super(eventName, {bubbles: true, cancelable: true});
    overrideEvent(this, 'target', target);
    Object.assign(this, swipeInfo);
  }

  /** Creates {@link ESLSwipeGestureEvent} from {@link ESLSwipeGestureTarget} */
  public static fromConfig(eventName: SwipeEventName, target: Element, swipeInfo: ESLSwipeGestureEventInfo): ESLSwipeGestureEvent {
    return new ESLSwipeGestureEvent(eventName, target, swipeInfo);
  }
}

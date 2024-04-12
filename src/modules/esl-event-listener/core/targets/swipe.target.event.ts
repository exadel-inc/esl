import {overrideEvent} from '../../../esl-utils/dom/events/misc';

/**
 * Swipe directions that could be provided in {@link ESLSwipeGestureEvent}
 */
export type SwipeDirection = 'left' | 'right' | 'up' | 'down';

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
 * Swipe event dispatched by {@link ESLSwipeGestureTarget}
 */
export class ESLSwipeGestureEvent extends UIEvent implements ESLSwipeGestureEventInfo {
  public static readonly type = 'swipe';

  public override readonly target: Element;

  public readonly direction: SwipeDirection;
  public readonly distanceX: number;
  public readonly distanceY: number;
  public readonly distance: number;
  public readonly angle: number;
  public readonly endEvent: PointerEvent;
  public readonly startEvent: PointerEvent;
  public readonly duration: number;

  /** @returns whether swipe direction is vertical or not */
  public get isVertical(): boolean {
    return this.direction === 'up' || this.direction === 'down';
  }

  protected constructor(target: Element, swipeInfo: ESLSwipeGestureEventInfo) {
    super(ESLSwipeGestureEvent.type, {bubbles: false, cancelable: true});
    overrideEvent(this, 'target', target);
    Object.assign(this, swipeInfo);
  }

  /** Creates {@link ESLSwipeGestureEvent} based on {@link ESLSwipeGestureEventInfo} */
  public static fromConfig(target: Element, swipeInfo: ESLSwipeGestureEventInfo): ESLSwipeGestureEvent {
    return new ESLSwipeGestureEvent(target, swipeInfo);
  }
}

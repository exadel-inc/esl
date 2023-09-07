import {SyntheticEventTarget} from '../../../esl-utils/dom/events/target';
import {resolveDomTarget} from '../../../esl-utils/abstract/dom-target';
import {isElement} from '../../../esl-utils/dom/api';
import {bind} from '../../../esl-utils/decorators/bind';
import {resolveCSSSize} from '../../../esl-utils/dom/units';

import {ESLEventListener} from '../listener';
import {ESLSwipeGestureEvent} from './swipe.target.event';

import type {CSSSize} from '../../../esl-utils/dom/units';
import type {SwipeDirection, SwipeEventName} from './swipe.target.event';
import type {ESLDomElementTarget} from '../../../esl-utils/abstract/dom-target';

export {ESLSwipeGestureEvent};

/**
 * Describes settings object that could be passed to {@link ESLSwipeGestureTarget.for} as optional parameter
 */
export interface ESLSwipeGestureSetting {
  threshold?: CSSSize;
  timeout?: number;
}

/**
 * Diff between events coordinates and timestamp
 */
interface EventsDiff {
  distanceX: number;
  distanceY: number;
  distance: number;
  angle: number;
  time: number;
  startEvent: PointerEvent;
  endEvent: PointerEvent;
}

/**
 * Synthetic target class that produces swipe events
 */
export class ESLSwipeGestureTarget extends SyntheticEventTarget {
  protected static defaultConfig: Required<ESLSwipeGestureSetting> = {
    threshold: '20px',
    timeout: 500
  };

  /**
   * @param target - a target element to observe pointer events to detect a gesture
   * @param settings - optional config override (will be merged with a default one if passed) {@link ESLSwipeGestureSetting}.
   * @returns Returns the instance of ESLSwipeGestureTarget {@link ESLSwipeGestureTarget}.
   */
  public static for(target: ESLDomElementTarget, settings?: ESLSwipeGestureSetting): ESLSwipeGestureTarget;
  public static for(target: ESLDomElementTarget, settings?: ESLSwipeGestureSetting): ESLSwipeGestureTarget | null {
    const $target = resolveDomTarget(target);
    if (isElement($target)) return new ESLSwipeGestureTarget($target, settings);
    // Error handling
    console.warn('[ESL]: ESLSwipeGestureTarget can not observe %o', target);
    return null;
  }

  protected readonly config: Required<ESLSwipeGestureSetting>;

  protected startEvent: PointerEvent;

  protected constructor(
    protected readonly target: Element,
    settings?: ESLSwipeGestureSetting
  ) {
    super();
    this.config = Object.assign({}, ESLSwipeGestureTarget.defaultConfig, settings);
  }

  /**
   * Saves swipe start event target, time when swipe started, pointerdown event and coordinates.
   * @param e - pointer event
   */
  @bind
  protected handleStart(e: PointerEvent): void {
    this.startEvent = e;
    this.target.releasePointerCapture && this.target.releasePointerCapture(e.pointerId);
    this.target.setPointerCapture && this.target.setPointerCapture(e.pointerId);
  }

  /**
   * @param e - pointer event (pointerdown)
   * @returns diff between pointerdown and pointer coordinates and timestamp {@link EventsDiff}
   */
  protected eventDiff(e: PointerEvent): EventsDiff {
    const distanceX = Math.round(e.clientX - this.startEvent.clientX);
    const distanceY = Math.round(e.clientY - this.startEvent.clientY);

    return {
      distanceX,
      distanceY,
      distance: Math.round(Math.hypot(distanceX, distanceY, 2)),
      angle: Math.round((Math.atan2(distanceY, distanceX) * 180 / Math.PI + 90 + 360) % 360),
      time: e.timeStamp - this.startEvent.timeStamp,
      startEvent: this.startEvent,
      endEvent: e
    };
  }

  /**
   * Triggers swipe event {@link SwipeEventName} with details {@link ESLSwipeGestureEvent} when pointerup event
   * occurred and threshold and distance match configuration
   * @param e - pointer event
   */
  @bind
  protected handleEnd(e: PointerEvent): void {
    const diff = this.eventDiff(e);
    const swipeThreshold = (resolveCSSSize(this.config.threshold) || resolveCSSSize(ESLSwipeGestureTarget.defaultConfig.threshold)!);

    // return if swipe took too long or distance is too short
    if (!this.isGestureValid(diff, swipeThreshold)) return;

    const direction = this.resolveDirection(diff);

    // fire `swipe` event on the element that started the swipe
    if (direction) this.dispatchEvent(ESLSwipeGestureEvent.fromConfig('swipe', this.target, {...diff, direction}));
  }

  /**
   * Checks if swipe gesture is valid based on distance and timeout
   * @param diff - diff between pointerdown and pointer coordinates and timestamp {@link EventsDiff}
   * @param swipeThreshold - threshold for swipe distance
   */
  protected isGestureValid(diff: EventsDiff, swipeThreshold: number): boolean {
    return (diff.time < this.config.timeout && (Math.abs(diff.distanceX) >= swipeThreshold) || (Math.abs(diff.distanceY) >= swipeThreshold));
  }

  /**
   * Returns swipe direction based on distance between swipe start and end points
   * @param diff - diff between pointerdown and pointer coordinates and timestamp {@link EventsDiff}
   * @returns direction of swipe {@link SwipeDirection}
   */
  protected resolveDirection(diff: EventsDiff): SwipeDirection {
    if (Math.abs(diff.distanceX) >= Math.abs(diff.distanceY)) return diff.distanceX < 0 ? 'left' : 'right';

    return diff.distanceY < 0 ? 'up' : 'down';
  }

  /**
   * Subscribes to pointerup and pointerdown event
   */
  public override addEventListener(callback: EventListener): void;
  public override addEventListener(event: SwipeEventName, callback: EventListener): void;
  public override addEventListener(event: any, callback: EventListener = event): void {
    super.addEventListener(event, callback);

    if (this.getEventListeners().length > 1) return;
    const {target} = this;
    ESLEventListener.subscribe(this, this.handleStart, {event: 'pointerdown', capture: false, target});
    ESLEventListener.subscribe(this, this.handleEnd, {event: 'pointerup', capture: false, target});
  }

  /**
   * Unsubscribes from the observed target {@link Element} changes
   */
  public override removeEventListener(callback: EventListener): void;
  public override removeEventListener(event: SwipeEventName, callback: EventListener): void;
  public override removeEventListener(event: any, callback: EventListener = event): void {
    super.removeEventListener(event, callback);
    if (!this.hasEventListener(event)) ESLEventListener.unsubscribe(this);
  }
}

import {SyntheticEventTarget} from '../../../esl-utils/dom/events/target';
import {resolveDomTarget} from '../../../esl-utils/abstract/dom-target';
import {isElement} from '../../../esl-utils/dom/api';
import {bind} from '../../../esl-utils/decorators/bind';
import {resolveCSSSize} from '../../../esl-utils/dom/units';

import {ESLEventListener} from '../listener';
import {ESLSwipeGestureEvent} from './swipe.target.event';

import type {CSSSize} from '../../../esl-utils/dom/units';
import type {SwipeDirection, SwipeEventName, ESLSwipeGestureEventInfo} from './swipe.target.event';
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
    this.target.setPointerCapture && this.target.setPointerCapture(e.pointerId);
  }

  /**
   * @param endEvent - pointer event (pointerdown)
   * @returns diff between pointerdown and pointerup coordinates and timestamp {@link ESLSwipeGestureEventInfo}
   */
  protected resolveEventDetails(endEvent: PointerEvent): ESLSwipeGestureEventInfo {
    const {startEvent} = this;
    const duration = endEvent.timeStamp - startEvent.timeStamp;
    const distanceX = Math.round(endEvent.clientX - startEvent.clientX);
    const distanceY = Math.round(endEvent.clientY - startEvent.clientY);
    const distance = Math.round(Math.hypot(distanceX, distanceY, 2));
    const angle = Math.round((Math.atan2(distanceY, distanceX) * 180 / Math.PI + 90 + 360) % 360);
    const direction = this.resolveDirection(distanceX, distanceY);

    return {direction, distanceX, distanceY, distance, angle, duration, startEvent, endEvent};
  }

  /**
   * Returns swipe direction based on distance between swipe start and end points
   * @returns direction of swipe {@link SwipeDirection}
   * @param distanceX - distance between swipe start and end points on X axis
   * @param distanceY - distance between swipe start and end points on Y axis
   */
  protected resolveDirection(distanceX: number, distanceY: number): SwipeDirection {
    if (Math.abs(distanceX) >= Math.abs(distanceY)) return distanceX < 0 ? 'left' : 'right';

    return distanceY < 0 ? 'up' : 'down';
  }

  /**
   * Triggers swipe event {@link SwipeEventName} with details {@link ESLSwipeGestureEvent} when pointerup event
   * occurred and threshold and distance match configuration
   * @param e - pointer event
   */
  @bind
  protected handleEnd(e: PointerEvent): void {
    this.target.releasePointerCapture && this.target.releasePointerCapture(e.pointerId);

    const eventDetails = this.resolveEventDetails(e);
    const swipeThreshold = (resolveCSSSize(this.config.threshold) || resolveCSSSize(ESLSwipeGestureTarget.defaultConfig.threshold)!);

    // return if swipe took too long or distance is too short
    if (!this.isGestureAcceptable(eventDetails, swipeThreshold)) return;

    // fire `swipe` event on the element that started the swipe
    this.dispatchEvent(ESLSwipeGestureEvent.fromConfig('swipe', this.target, eventDetails));
  }

  /**
   * Checks if swipe gesture is acceptable based on distance and timeout
   * @param diff - diff between pointerdown and pointerup coordinates and timestamp {@link ESLSwipeGestureEventInfo}
   * @param swipeThreshold - threshold for swipe distance
   */
  protected isGestureAcceptable(diff: ESLSwipeGestureEventInfo, swipeThreshold: number): boolean {
    return (diff.duration < this.config.timeout && (Math.abs(diff.distanceX) >= swipeThreshold) || (Math.abs(diff.distanceY) >= swipeThreshold));
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

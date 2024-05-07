import {SyntheticEventTarget} from '../../../esl-utils/dom/events/target';
import {getParentScrollOffsets, isOffsetChanged} from '../../../esl-utils/dom/scroll';
import {getTouchPoint, isMouseEvent, isTouchEvent} from '../../../esl-utils/dom/events/misc';
import {resolveDomTarget} from '../../../esl-utils/abstract/dom-target';
import {isElement} from '../../../esl-utils/dom/api';
import {resolveCSSSize} from '../../../esl-utils/dom/units';

import {ESLEventListener} from '../listener';
import {ESLSwipeGestureEvent} from './swipe.target.event';

import type {ElementScrollOffset} from '../../../esl-utils/dom//scroll';
import type {CSSSize} from '../../../esl-utils/dom/units';
import type {SwipeDirection, ESLSwipeGestureEventInfo} from './swipe.target.event';
import type {ESLDomElementTarget} from '../../../esl-utils/abstract/dom-target';

export {ESLSwipeGestureEvent};

/**
 * Describes settings object that could be passed to {@link ESLSwipeGestureTarget.for} as optional parameter
 */
export interface ESLSwipeGestureSetting {
  /** Flag to indicate if the swipe event should not be dispatched if a scroll of content was detected (true by default) */
  skipOnScroll?: boolean;
  /** The minimum distance to accept swipe (supports `px`, `vw` and `vh` units) */
  threshold?: CSSSize;
  /** The maximum duration between `ponterdown` and `pointerup` events */
  timeout?: number;
}

/**
 * Implementation of EventTarget to observe swipe events
 */
export class ESLSwipeGestureTarget extends SyntheticEventTarget {
  protected static defaultConfig: Required<ESLSwipeGestureSetting> = {
    skipOnScroll: true,
    threshold: '20px',
    timeout: 500
  };

  /**
   * @param target - a target element to observe pointer events to detect a gesture
   * @param settings - optional config override (will be merged with a default one if passed) {@link ESLSwipeGestureSetting}.
   * @returns the instance of ESLSwipeGestureTarget {@link ESLSwipeGestureTarget}.
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
  protected startEventOffset: ElementScrollOffset[];

  protected constructor(
    protected readonly target: Element,
    settings?: ESLSwipeGestureSetting
  ) {
    super();
    this.config = Object.assign({}, ESLSwipeGestureTarget.defaultConfig, settings);
  }

  /** @returns opposite to the current startEvent event name */
  protected get endEventName(): string {
    if (isTouchEvent(this.startEvent)) return 'touchend';
    if (isMouseEvent(this.startEvent)) return 'mouseup';
    return 'pointerup';
  }

  /**
   * Saves swipe start event target, time when swipe started, pointerdown event and coordinates.
   * @param startEvent - initial pointer event
   */
  protected handleStart(startEvent: PointerEvent): void {
    this.startEventOffset = this.config.skipOnScroll ? getParentScrollOffsets(startEvent.target as Element, this.target) : [];
    this.startEvent = startEvent;
    ESLEventListener.subscribe(this, this.handleEnd, {
      event: this.endEventName,
      once: true,
      target: window
    });
  }

  /**
   * @param endEvent - pointer event (`pointerup`)
   * @returns result gesture info based on distance between pointerdown and pointerup coordinates and timestamp {@link ESLSwipeGestureEventInfo}
   */
  protected resolveEventDetails(endEvent: PointerEvent): ESLSwipeGestureEventInfo {
    const {startEvent} = this;
    const startPoint = getTouchPoint(startEvent);
    const endPoint = getTouchPoint(endEvent);

    const duration = endEvent.timeStamp - startEvent.timeStamp;
    const distanceX = Math.round(endPoint.x - startPoint.x);
    const distanceY = Math.round(endPoint.y - startPoint.y);

    const distance = Math.round(Math.hypot(distanceX, distanceY, 2));
    const angle = Math.round((Math.atan2(distanceY, distanceX) * 180 / Math.PI + 90 + 360) % 360);
    const direction = this.resolveDirection(distanceX, distanceY);

    return {direction, distanceX, distanceY, distance, angle, duration, startEvent, endEvent};
  }

  /**
   * @returns swipe direction based on swipe vector {@link SwipeDirection}
   * @param distanceX - distance between swipe start and end points on X axis
   * @param distanceY - distance between swipe start and end points on Y axis
   */
  protected resolveDirection(distanceX: number, distanceY: number): SwipeDirection {
    if (Math.abs(distanceX) >= Math.abs(distanceY)) return distanceX < 0 ? 'left' : 'right';

    return distanceY < 0 ? 'up' : 'down';
  }

  /**
   * Handles `pointerup` event and triggers a swipe event {@link SwipeEventName} with details {@link ESLSwipeGestureEvent} when `pointerup` event
   * occurred and the result gestures accepts {@link ESLSwipeGestureTarget} configuration
   * @param endEvent - `pointerup` event
   */
  protected handleEnd(endEvent: PointerEvent): void {
    const eventDetails = this.resolveEventDetails(endEvent);

    // return if swipe took too long or distance is too short
    if (!this.isGestureAcceptable(eventDetails)) return;
    if (this.config.skipOnScroll) {
      const offsets = getParentScrollOffsets(endEvent.target as Element, this.target);
      if (isOffsetChanged(this.startEventOffset.concat(offsets))) return;
    }

    const event = ESLSwipeGestureEvent.fromConfig(this.target, eventDetails);
    // fire `swipe` event on the element that started the swipe
    if (!this.dispatchEvent(event)) endEvent.preventDefault();
  }

  /**
   * Checks if swipe gesture is acceptable based on distance and timeout
   * @param info - swipe info based on `pointerdown` and `pointerup` coordinates and timestamp {@link ESLSwipeGestureEventInfo}
   */
  protected isGestureAcceptable(info: ESLSwipeGestureEventInfo): boolean {
    const swipeThreshold = (resolveCSSSize(this.config.threshold) || resolveCSSSize(ESLSwipeGestureTarget.defaultConfig.threshold)!);
    return (info.duration < this.config.timeout && (Math.abs(info.distanceX) >= swipeThreshold) || (Math.abs(info.distanceY) >= swipeThreshold));
  }

  /**
   * Subscribes to pointerup and pointerdown event
   */
  public override addEventListener(callback: EventListener): void;
  public override addEventListener(event: typeof ESLSwipeGestureEvent.TYPE, callback: EventListener): void;
  public override addEventListener(event: any, callback: EventListener = event): void {
    super.addEventListener(event, callback);

    if (this.getEventListeners().length > 1) return;
    const {target} = this;
    ESLEventListener.subscribe(this, this.handleStart, {event: 'mousedown touchstart', target});
  }

  /**
   * Unsubscribes from the observed target {@link Element} changes
   */
  public override removeEventListener(callback: EventListener): void;
  public override removeEventListener(event: typeof ESLSwipeGestureEvent.TYPE, callback: EventListener): void;
  public override removeEventListener(event: any, callback: EventListener = event): void {
    super.removeEventListener(event, callback);
    if (!this.hasEventListener(event)) ESLEventListener.unsubscribe(this);
  }
}

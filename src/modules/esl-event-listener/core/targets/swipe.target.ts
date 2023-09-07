import {SyntheticEventTarget} from '../../../esl-utils/dom/events/target';
import {resolveDomTarget} from '../../../esl-utils/abstract/dom-target';
import {isElement} from '../../../esl-utils/dom/api';
import {bind} from '../../../esl-utils/decorators/bind';
import {resolveCSSSize} from '../../../esl-utils/dom/units';

import {ESLEventListener} from '../listener';
import {ESLSwipeGestureEvent} from './swipe.target.event';

import type {CSSSize} from '../../../esl-utils/dom/units';
import type {SwipeDirection, ESLSwipeGestureEventInfo, SwipeEventName} from './swipe.target.event';
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
  x: number;
  y: number;
  time: number;
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
   * @param e - pointer event (pointerdown)
   * @returns diff between pointerdown and pointer coordinates and timestamp {@link EventsDiff}
   */
  protected eventDiff(e: PointerEvent): EventsDiff {

    return {
      x: Math.round(e.clientX - this.startEvent.clientX),
      y: Math.round(e.clientY - this.startEvent.clientY),
      time: e.timeStamp - this.startEvent.timeStamp
    };
  }

  /**
   * Triggers swipe event {@link SwipeEventName} with details {@link ESLSwipeGestureEvent} when pointerup event
   * occurred and threshold and distance match configuration
   * @param e - pointer event
   */
  @bind
  protected handleEnd(e: PointerEvent): void {

    const eventsDiff = this.eventDiff(e);
    const direction = this.resolveDirection(eventsDiff);
    if (direction) {
      const swipeInfo: ESLSwipeGestureEventInfo = {
        direction,
        distanceX: eventsDiff.x,
        distanceY: eventsDiff.y,
        distance: Math.round(Math.hypot(eventsDiff.x, eventsDiff.y, 2)),
        angle: Math.round((Math.atan2(eventsDiff.y, eventsDiff.x) * 180 / Math.PI + 90 + 360) % 360),
        startEvent: this.startEvent,
        endEvent: e
      };

      // fire `swipe` event on the element that started the swipe
      this.dispatchEvent(ESLSwipeGestureEvent.fromConfig('swipe', this.target, swipeInfo));
    }

    this.target.releasePointerCapture && this.target.releasePointerCapture(e.pointerId);
  }

  /**
   * Returns swipe direction based on distance between swipe start and end points
   * @param diff - diff between pointerdown and pointer coordinates and timestamp {@link EventsDiff}
   * @returns direction of swipe {@link SwipeDirection}
   */
  protected resolveDirection(diff: EventsDiff): SwipeDirection | null {
    const swipeThreshold = (resolveCSSSize(this.config.threshold) || resolveCSSSize(ESLSwipeGestureTarget.defaultConfig.threshold)!);

    if (Math.abs(diff.x) >= Math.abs(diff.y) && Math.abs(diff.x) > swipeThreshold && diff.time < this.config.timeout) {
      return diff.x < 0 ? 'left' : 'right';
    }
    if (Math.abs(diff.y) > swipeThreshold && diff.time < this.config.timeout) {
      return diff.y < 0 ? 'up' : 'down';
    }

    // Marker that there was not enough move characteristic to consider pointer move as touch swipe
    return null;
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

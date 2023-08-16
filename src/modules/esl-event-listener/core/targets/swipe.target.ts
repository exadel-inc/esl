import {SyntheticEventTarget} from '../../../esl-utils/dom/events/target';
import {ESLMixinElement} from '../../../esl-mixin-element/ui/esl-mixin-element';
import {resolveDomTarget} from '../../../esl-utils/abstract/dom-target';
import {bind} from '../../../esl-utils/decorators/bind';
import {ESLEventUtils} from '../api';
import {resolveCSSSize} from '../../../esl-utils/dom/units';
import {ESLSwipeGestureEvent} from './swipe.event';

import type {CSSSize} from '../../../esl-utils/dom/units';
import type {SwipeDirection, ESLSwipeGestureEventInfo, SwipeEventName} from './swipe.event';
import type {ESLDomElementTarget} from '../../../esl-utils/abstract/dom-target';

/**
 * Describes parsed configuration of {@link ESLSwipeGestureTarget}
 */
interface SwipeEventTargetConfig {
  threshold: string;
  timeout: number;
}

/**
 * Describes settings object that could be passed to {@link ESLSwipeGestureTarget.for} as optional parameter
 */
export interface ESLSwipeGestureSetting {
  threshold?: string;
  timeout?: number;
}

/**
 * Synthetic target class that produces swipe events
 */
export class ESLSwipeGestureTarget extends SyntheticEventTarget {
  protected static defaultConfig: SwipeEventTargetConfig = {
    threshold: '20px',
    timeout: 500
  };

  protected startEvent: PointerEvent;
  protected config: SwipeEventTargetConfig;
  protected target: Element;
  protected isGestureStarted: boolean = false;

  protected constructor(target: ESLDomElementTarget, settings: ESLSwipeGestureSetting) {
    super();
    this.target = resolveDomTarget(target);
    this.config = Object.assign({}, ESLSwipeGestureTarget.defaultConfig, settings);
  }

  /**
   * @param $target - a target element to observe pointer events to detect a gesture
   * @param settings - optional config override (will be merged with a default one if passed) {@link ESLSwipeGestureSetting}.
   * @returns Returns the instance of ESLSwipeGestureTarget {@link ESLSwipeGestureTarget}.
   */
  public static for($target: ESLDomElementTarget, settings?: ESLSwipeGestureSetting): ESLSwipeGestureTarget {
    if ($target instanceof ESLMixinElement) return ESLSwipeGestureTarget.for($target.$host, settings);

    return new ESLSwipeGestureTarget($target, settings || {});
  }

  /**
   * Saves swipe start event target, time when swipe started, pointerdown event and coordinates.
   * @param e - pointer event
   */
  @bind
  protected handleStart(e: PointerEvent): void {
    this.startEvent = e;
    this.isGestureStarted = true;
  }

  /**
   * Triggers swipe event {@link SwipeEventName} with details {@link ESLSwipeGestureEvent} when pointerup event
   * occurred and threshold and distance match configuration
   * @param e - pointer event
   */
  @bind
  protected handleEnd(e: PointerEvent): void {
    // if the user released on a different target, cancel!
    if (!this.isGestureStarted || (this.startEvent?.target !== e.target)) return;
    const direction = this.resolveDirection(e);

    if (direction) {
      const swipeInfo: ESLSwipeGestureEventInfo = {
        target: this.target,
        direction,
        distanceX: Math.abs(this.startEvent.clientX - e.clientX),
        distanceY: Math.abs(this.startEvent.clientY - e.clientY),
        startEvent: this.startEvent,
        endEvent: e
      };

      // fire `swipe` event on the element that started the swipe
      this.dispatchEvent(ESLSwipeGestureEvent.fromConfig('swipe', swipeInfo));
      // fire `swipe:${dir}` event on the element that started the swipe
      this.dispatchEvent(ESLSwipeGestureEvent.fromConfig(`swipe:${direction}` as SwipeEventName, swipeInfo));
    }

    // Mark swipe as completed
    this.isGestureStarted = false;
  }

  /**
   * Returns swipe direction based on distance between swipe start and end points
   * @param e - pointer event
   * @returns direction of swipe {@link SwipeDirection}
   */
  protected resolveDirection(e: PointerEvent): SwipeDirection | null {
    const xDiff = this.startEvent.clientX - e.clientX;
    const yDiff = this.startEvent.clientY - e.clientY;
    const swipeThreshold = resolveCSSSize(this.config.threshold as CSSSize);
    const timeDiff = e.timeStamp - this.startEvent.timeStamp;

    if (Math.abs(xDiff) > Math.abs(yDiff) && Math.abs(xDiff) > swipeThreshold && timeDiff < this.config.timeout) {
      return xDiff > 0 ? 'left' : 'right';
    }
    if (Math.abs(yDiff) > swipeThreshold && timeDiff < this.config.timeout) {
      return yDiff > 0 ? 'up' : 'down';
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

    ESLEventUtils.subscribe(this.target, {event: 'pointerdown', capture: false}, this.handleStart);
    ESLEventUtils.subscribe(this.target, {event: 'pointerup', capture: false}, this.handleEnd);
  }

  /**
   * Unsubscribes from the observed target {@link Element} changes
   */
  public override removeEventListener(callback: EventListener): void;
  public override removeEventListener(event: SwipeEventName, callback: EventListener): void;
  public override removeEventListener(event: any, callback: EventListener = event): void {
    super.removeEventListener(event, callback);
    if (this.getEventListeners().length > 0) return;

    ESLEventUtils.unsubscribe(this.target, 'pointerdown');
    ESLEventUtils.unsubscribe(this.target, 'pointerup');
  }
}

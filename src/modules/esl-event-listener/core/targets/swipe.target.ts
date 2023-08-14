import {SyntheticEventTarget} from '../../../esl-utils/dom/events/target';
import {ESLMixinElement} from '../../../esl-mixin-element/ui/esl-mixin-element';
import {resolveDomTarget} from '../../../esl-utils/abstract/dom-target';
import {bind} from '../../../esl-utils/decorators/bind';
import {ESLEventUtils} from '../api';
import {ESLSwipeGestureEvent} from './swipe.event';

import type {SwipeDirection, ESLSwipeGestureEventInfo, SwipeEventName} from './swipe.event';
import type {ESLDomElementTarget} from '../../../esl-utils/abstract/dom-target';

/**
 * Describes parsed configuration of {@link ESLSwipeGestureTarget}
 */
interface SwipeEventTargetConfig {
  threshold: number;
  units: string;
  timeout: number;
}

/**
 * Describes settings object that could be passed to {@link ESLSwipeGestureTarget.for} as optional parameter
 */
export interface ESLSwipeGestureSetting {
  threshold?: string;
  timeout?: number;
}

export class ESLSwipeGestureTarget extends SyntheticEventTarget {
  protected startEl: HTMLElement | null;
  protected startEvent: PointerEvent;
  protected config: SwipeEventTargetConfig;
  protected target: Element;
  protected static unitsAvailable = ['vw', 'vh', 'px'];
  protected static defaultConfig: SwipeEventTargetConfig = {
    threshold: 20,
    units: 'px',
    timeout: 500
  };

  protected constructor(target: ESLDomElementTarget, settings: ESLSwipeGestureSetting) {
    super();
    this.target = resolveDomTarget(target);
    this.config = this.getConfig(settings);
  }

  /**
   * @returns threshold units
   */
  protected parseUnits(threshold: string): string {
    const filteredUnits = ESLSwipeGestureTarget.unitsAvailable.filter((item: string) => (threshold.indexOf(item) > 0));

    return filteredUnits.length ? filteredUnits[0] : ESLSwipeGestureTarget.defaultConfig.units;
  }

  /**
   * Passes threshold into number and units, creates config from passed threshold and distance values or uses default ones.
   * @param settings - configuration options {@link ESLSwipeGestureSetting}
   * @returns ESLSwipeGestureTarget configuration {@link SwipeEventTargetConfig}.
   */
  protected getConfig(settings: ESLSwipeGestureSetting): SwipeEventTargetConfig {
    const config = ESLSwipeGestureTarget.defaultConfig;

    config.timeout = settings?.timeout || config.timeout;
    config.threshold = settings?.threshold ? parseInt(settings.threshold, 10) : config.threshold;
    config.units = settings?.threshold ? this.parseUnits(settings.threshold) : config.units;

    return config;
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
    this.startEl = e.target as HTMLElement;
    this.startEvent = e;
  }

  /**
   * Triggers swipe event {@link SwipeEventName} with details {@link ESLSwipeGestureEvent} when pointerup event
   * occurred and threshold and distance match configuration
   * @param e - pointer event
   */
  @bind
  protected handleEnd(e: PointerEvent): void {
    // if the user released on a different target, cancel!
    if (this.startEl !== e.target) return;
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

    // reset values
    this.startEl = null;
  }

  /**
   * @returns threshold based on number and units
   */
  protected resolveSwipeThreshold(): number {
    let swipeThreshold = this.config.threshold;

    if (this.config.units === 'vh') {
      swipeThreshold = Math.round((swipeThreshold / 100) * document.documentElement.clientHeight); // get percentage of viewport height in pixels
    }
    if (this.config.units === 'vw') {
      swipeThreshold = Math.round((swipeThreshold / 100) * document.documentElement.clientWidth); // get percentage of viewport width in pixels
    }

    return swipeThreshold;
  }

  /**
   * Returns swipe direction based on distance between swipe start and end points
   * @param e - pointer event
   * @returns direction of swipe {@link SwipeDirection}
   */
  protected resolveDirection(e: PointerEvent): SwipeDirection | null {
    const xDiff = this.startEvent.clientX - e.clientX;
    const yDiff = this.startEvent.clientY - e.clientY;
    const swipeThreshold = this.resolveSwipeThreshold();
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

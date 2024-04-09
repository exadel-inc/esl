import {SyntheticEventTarget} from '../../../esl-utils/dom/events/target';
import {resolveDomTarget} from '../../../esl-utils/abstract/dom-target';
import {isElement} from '../../../esl-utils/dom/api';
import {bind} from '../../../esl-utils/decorators/bind';
import {aggregate} from '../../../esl-utils/async/aggregate';
import {ESLEventListener} from '../listener';

import {ESLWheelEvent} from './wheel.target.event';

import type {ESLWheelEventInfo} from './wheel.target.event';
import type {ESLDomElementTarget} from '../../../esl-utils/abstract/dom-target';

export {ESLWheelEvent};

/**
 * Describes settings object that could be passed to {@link ESLWheelTarget.for} as optional parameter
 */
export interface ESLWheelTargetSetting {
  /** The minimum distance to accept as a long scroll */
  distance?: number;
  /** The maximum duration of the wheel events to consider it inertial */
  timeout?: number;
}

/**
 * Implementation of EventTarget to observe wheel events for inertial scrolling
 */
export class ESLWheelTarget extends SyntheticEventTarget {
  protected static defaultConfig: Required<ESLWheelTargetSetting> = {
    distance: 400,
    timeout: 100
  };

  protected readonly config: Required<ESLWheelTargetSetting>;

  /** Function for aggregating wheel events into array of events */
  protected aggregateWheel: (event: WheelEvent) => void;

  /**
   * @param target - The target DOM element to observe
   * @param settings - Optional settings object
   * @returns A {@link ESLWheelTarget} instance if the target is a valid element
   */
  public static for(target: ESLDomElementTarget, settings?: ESLWheelTargetSetting): ESLWheelTarget;
  public static for(target: ESLDomElementTarget, settings?: ESLWheelTargetSetting): ESLWheelTarget | null {
    const $target = resolveDomTarget(target);
    if (isElement($target)) return new ESLWheelTarget($target, settings);

    console.warn('[ESL]: ESLWheelTarget can`t observe %o', target);
    return null;
  }

  protected constructor(
    protected readonly target: Element,
    settings?: ESLWheelTargetSetting
  ) {
    super();
    this.config = Object.assign({}, ESLWheelTarget.defaultConfig, settings);

    this.aggregateWheel = aggregate((events: WheelEvent[]) => this.handleAggregatedWheel(events), this.config.timeout);
  }

  /** Handles wheel events */
  @bind
  protected _onWheel(event: WheelEvent): void {
    this.aggregateWheel(event);
  }

  /** Handles aggregated wheel events */
  protected handleAggregatedWheel(events: WheelEvent[]): void {
    const wheelInfo =  this.resolveEventDetails(events);
    if (Math.abs(wheelInfo.deltaX) >= this.config.distance) this.dispatchWheelEvent('x', wheelInfo);
    if (Math.abs(wheelInfo.deltaY) >= this.config.distance) this.dispatchWheelEvent('y', wheelInfo);
  }

  /**
   * Dispatches a custom wheel event
   * @param axis - The axis along which the scroll was performed
   * @param wheelInfo - The event detail object
   */
  protected dispatchWheelEvent(axis: 'x' | 'y', wheelInfo: Omit<ESLWheelEventInfo, 'axis'>): void {
    this.dispatchEvent(ESLWheelEvent.fromConfig(this.target, Object.assign({}, wheelInfo, {axis})));
  }

  /**
   * Resolves long wheel detail object from array of WheelEvent objects
   * @param events - An array of WheelEvent
   * @returns An object containing the resolved event details
   */
  protected resolveEventDetails(events: WheelEvent[]): Omit<ESLWheelEventInfo, 'axis'> {
    const delta = events.reduce((agg, e) => ({
      x: agg.x + this.calculateScrollPixels(e, false),
      y: agg.y + this.calculateScrollPixels(e, true)
    }), {x: 0, y: 0});

    const duration = events[events.length - 1].timeStamp - events[0].timeStamp;
    return {deltaX: delta.x, deltaY: delta.y, events, duration};
  }

  /**
   * Calculates the scroll pixels for a given wheel event
   * @param event - An event to retrieve scroll value from
   * @param isVertical - A boolean indicating the axis (vertical or horizontal) for scroll calculation
   * @returns The number of pixels scrolled
   */
  private calculateScrollPixels(event: WheelEvent, isVertical: boolean): number {
    const {DOM_DELTA_LINE, DOM_DELTA_PAGE} = WheelEvent;
    const deltaValue = (isVertical && event.shiftKey) ? 0 : (isVertical || event.shiftKey) ? event.deltaY : event.deltaX;

    let delta;
    switch (event.deltaMode) {
      case DOM_DELTA_LINE:
        delta = deltaValue * parseInt(window.getComputedStyle(this.target).lineHeight, 10);
        break;
      case DOM_DELTA_PAGE:
        delta = isVertical ? window.innerHeight : window.innerWidth;
        break;
      default:
        delta = deltaValue * window.devicePixelRatio;
    }
    return delta;
  }

  /** Subscribes to wheel event */
  public override addEventListener(callback: EventListener): void;
  public override addEventListener(event: typeof ESLWheelEvent.type, callback: EventListener): void;
  public override addEventListener(event: any, callback: EventListener = event): void {
    super.addEventListener(event, callback);

    if (this.getEventListeners().length > 1) return;
    ESLEventListener.subscribe(this, this._onWheel, {event: 'wheel', capture: false, target: this.target});
  }

  /** Unsubscribes from the observed target {@link Element} wheel events */
  public override removeEventListener(callback: EventListener): void;
  public override removeEventListener(event: typeof ESLWheelEvent.type, callback: EventListener): void;
  public override removeEventListener(event: any, callback: EventListener = event): void {
    super.removeEventListener(event, callback);

    if (!this.hasEventListener(event)) ESLEventListener.unsubscribe(this);
  }
}

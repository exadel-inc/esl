import {SyntheticEventTarget} from '../../../esl-utils/dom/events/target';
import {resolveDomTarget} from '../../../esl-utils/abstract/dom-target';
import {getParentScrollOffsets, isOffsetChanged} from '../../../esl-utils/dom/scroll';
import {isElement} from '../../../esl-utils/dom/api';
import {bind} from '../../../esl-utils/decorators/bind';
import {aggregate} from '../../../esl-utils/async/aggregate';
import {ESLEventListener} from '../listener';

import {ESLWheelEvent} from './wheel.target.event';

import type {ESLWheelEventInfo} from './wheel.target.event';
import type {Predicate} from '../../../esl-utils/misc/functions';
import type {ESLDomElementTarget} from '../../../esl-utils/abstract/dom-target';
import type {ElementScrollOffset} from '../../../esl-utils/dom/scroll';

export {ESLWheelEvent};

/**
 * Describes settings object that could be passed to {@link ESLWheelTarget.for} as optional parameter
 */
export interface ESLWheelTargetSetting {
  /** Flag to indicate if the `longwheel` event shouldn't be dispatched if scroll of content was detected (true by default) */
  skipOnScroll?: boolean;
  /** The minimum distance to accept as a long scroll */
  distance?: number;
  /** The maximum duration of the wheel events to consider it inertial */
  timeout?: number;
  /** Predicate to ignore wheel events */
  ignore?: Predicate<WheelEvent>;
  /** Prevent default action for wheel event */
  preventDefault?: boolean;
}

/**
 * Implementation of EventTarget to observe wheel events for inertial scrolling
 */
export class ESLWheelTarget extends SyntheticEventTarget {
  protected static defaultConfig: Required<ESLWheelTargetSetting> = {
    skipOnScroll: true,
    distance: 400,
    timeout: 100,
    preventDefault: false,
    ignore: () => false
  };

  protected readonly config: Required<ESLWheelTargetSetting>;

  protected scrollData: ElementScrollOffset[] = [];

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
    if (this.config.ignore(event)) return;
    if (this.config.skipOnScroll) {
      const offsets = getParentScrollOffsets(event.target as Element, this.target);
      this.scrollData = this.scrollData.concat(offsets);
    }
    if (this.config.preventDefault) event.preventDefault();
    this.aggregateWheel(event);
  }

  /** Handles aggregated wheel events */
  protected handleAggregatedWheel(events: WheelEvent[]): void {
    const wheelInfo =  this.resolveEventDetails(events);

    const isBlocked = isOffsetChanged(this.scrollData);
    this.scrollData = [];
    if (isBlocked) return;
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

    switch (event.deltaMode) {
      case DOM_DELTA_LINE:
        return deltaValue * parseInt(window.getComputedStyle(this.target).lineHeight, 10);
      case DOM_DELTA_PAGE:
        return isVertical ? window.innerHeight : window.innerWidth;
      default:
        return deltaValue * window.devicePixelRatio;
    }
  }

  /** Subscribes to wheel event */
  public override addEventListener(callback: EventListener): void;
  public override addEventListener(event: typeof ESLWheelEvent.TYPE, callback: EventListener): void;
  public override addEventListener(event: any, callback: EventListener = event): void {
    super.addEventListener(event, callback);

    if (this.getEventListeners().length > 1) return;
    ESLEventListener.subscribe(this, this._onWheel, {
      event: 'wheel',
      passive: !this.config.preventDefault,
      target: this.target
    });
  }

  /** Unsubscribes from the observed target {@link Element} wheel events */
  public override removeEventListener(callback: EventListener): void;
  public override removeEventListener(event: typeof ESLWheelEvent.TYPE, callback: EventListener): void;
  public override removeEventListener(event: any, callback: EventListener = event): void {
    super.removeEventListener(event, callback);

    if (!this.hasEventListener(event)) ESLEventListener.unsubscribe(this);
  }
}

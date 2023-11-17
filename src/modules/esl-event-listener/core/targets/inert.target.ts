import {SyntheticEventTarget} from '../../../esl-utils/dom/events/target';
import {resolveDomTarget} from '../../../esl-utils/abstract/dom-target';
import {isElement} from '../../../esl-utils/dom/api';
import {bind} from '../../../esl-utils/decorators/bind';
import {aggregate} from '../../../esl-utils/async/aggregate';
import {ESLEventListener} from '../listener';

import {ESLWheelEvent} from './inert.target.event';

import type {ESLWheelEventInfo} from './inert.target.event';
import type {ESLDomElementTarget} from '../../../esl-utils/abstract/dom-target';

export {ESLWheelEvent};

/**
 * Describes settings object that could be passed to {@link ESLWheelTarget.for} as optional parameter
 */
export interface ESLWheelSetting {
  /** The minimum distance to accept as a long scroll */
  distance?: number;
  /** The maximum duration of the wheel events to consider it inertial */
  timeout?: number;
}

/**
 * Implementation of EventTarget to observe wheel events for inertial scrolling
 */
export class ESLWheelTarget extends SyntheticEventTarget {
  protected static defaultConfig: Required<ESLWheelSetting> = {
    distance: 400,
    timeout: 100
  };

  protected readonly config: Required<ESLWheelSetting>;

  protected aggregateWheel: (event: WheelEvent) => void;

  public static for(target: ESLDomElementTarget, settings?: ESLWheelSetting): ESLWheelTarget | null {
    const $target = resolveDomTarget(target);
    if (isElement($target)) return new ESLWheelTarget($target, settings);

    console.warn('[ESL]: ESLWheelTarget can`t observe %o', target);
    return null;
  }

  protected constructor(
    protected readonly target: Element,
    settings?: ESLWheelSetting
  ) {
    super();
    this.config = Object.assign({}, ESLWheelTarget.defaultConfig, settings);

    this.aggregateWheel = aggregate((events: WheelEvent[]) => this.handleAggregatedWheel(events), this.config.timeout);
  }

  @bind
  protected _onWheel(event: WheelEvent): void {
    this.aggregateWheel(event);
  }

  protected handleAggregatedWheel(events: WheelEvent[]): void {
    const wheelInfo =  this.resolveEventDetails(events);
    if (Math.abs(wheelInfo.deltaX) >= this.config.distance) {
      this.dispatchEvent(ESLWheelEvent.fromConfig('longwheel', this.target, Object.assign({}, wheelInfo, {axis: 'x' as const})));
    }
    if (Math.abs(wheelInfo.deltaY) >= this.config.distance) {
      this.dispatchEvent(ESLWheelEvent.fromConfig('longwheel', this.target, Object.assign({}, wheelInfo, {axis: 'y' as const})));
    }
  }

  protected resolveEventDetails(events: WheelEvent[]): Omit<ESLWheelEventInfo, 'axis'> {
    const delta = events.reduce((agg, e) => ({
      x: agg.x + this.calculateScrollPixels(e, 'x'),
      y: agg.y + this.calculateScrollPixels(e, 'y')
    }), {x: 0, y: 0});

    const duration = events[0].timeStamp - events[events.length - 1].timeStamp;
    return {deltaX: delta.x, deltaY: delta.y, events, duration};
  }

  private calculateScrollPixels(event: WheelEvent, axis: ESLWheelEvent['axis']): number {
    const {DOM_DELTA_LINE, DOM_DELTA_PAGE} = WheelEvent;
    const isHorizontal = axis === 'x' || event.shiftKey;
    const deltaValue = isHorizontal ? event.deltaX : event.deltaY;

    let delta;
    switch (event.deltaMode) {
      case DOM_DELTA_LINE:
        delta = deltaValue * parseInt(window.getComputedStyle(this.target).lineHeight, 10);
        break;
      case DOM_DELTA_PAGE:
        delta = deltaValue * (isHorizontal ? window.innerWidth : window.innerHeight);
        break;
      default:
        delta = deltaValue;
    }
    return delta;
  }

  public override addEventListener(callback: EventListener): void;
  public override addEventListener(event: string, callback: EventListener): void;
  public override addEventListener(event: any, callback: EventListener = event): void {
    super.addEventListener(event, callback);

    if (this.getEventListeners().length > 1) return;
    ESLEventListener.subscribe(this, this._onWheel, {event: 'wheel', capture: false, target: this.target});
  }

  public override removeEventListener(callback: EventListener): void;
  public override removeEventListener(event: string, callback: EventListener): void;
  public override removeEventListener(event: any, callback: EventListener = event): void {
    super.removeEventListener(event, callback);

    if (!this.hasEventListener(event)) ESLEventListener.unsubscribe(this);
  }
}

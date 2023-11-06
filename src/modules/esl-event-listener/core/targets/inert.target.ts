import {SyntheticEventTarget} from '../../../esl-utils/dom/events/target';
import {resolveDomTarget} from '../../../esl-utils/abstract/dom-target';
import {isElement} from '../../../esl-utils/dom/api';
import {bind} from '../../../esl-utils/decorators/bind';
import {resolveCSSSize} from '../../../esl-utils/dom/units';
import {aggregate} from '../../../esl-utils/async/aggregate';
import {ESLEventListener} from '../listener';

import {ESLWheelEvent} from './inert.target.event';

import type {ESLWheelEventInfo} from './inert.target.event';
import type {CSSSize} from '../../../esl-utils/dom/units';
import type {ESLDomElementTarget} from '../../../esl-utils/abstract/dom-target';

export {ESLWheelEvent};

/**
 * Describes settings object that could be passed to {@link ESLWheelTarget.for} as optional parameter
 */
export interface ESLWheelSetting {
  /** The minimum distance to accept an inertial wheel (supports `px`, `vw`, and `vh` units) */
  threshold?: CSSSize;
  /** The maximum duration of the wheel events to consider it inertial */
  timeout?: number;
}

/**
 * Implementation of EventTarget to observe wheel events for inertial scrolling
 */
export class ESLWheelTarget extends SyntheticEventTarget {
  protected static defaultConfig: Required<ESLWheelSetting> = {
    threshold: '400px',
    timeout: 100
  };

  protected readonly config: Required<ESLWheelSetting>;
  protected lastWheelEvent: WheelEvent;
  protected accumulatedDelta: number = 0;
  protected wheelTimer: number | null = null;

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
  }

  protected resolveEventDetails(events: WheelEvent[]): ESLWheelEventInfo {
    const delta = events.reduce((agg, e) => ({
      x: agg.x + e.deltaX,
      y: agg.y + e.deltaY
    }), {x: 0, y: 0});

    const startEvent = events[0];
    const endEvent = events[events.length - 1];
    return {startEvent, endEvent, deltaX: delta.x, deltaY: delta.y};
  }

  @bind
  protected handleWheel(event: WheelEvent): void {
    aggregate(this._onWheelAggregated, this.config.timeout)(event);
  }

  @bind
  protected _onWheelAggregated(events: WheelEvent[]): void {
    const wheelInfo = this.resolveEventDetails(events);
    if (!this.isLongScroll(wheelInfo)) return;
    this.dispatchEvent(ESLWheelEvent.fromConfig('longwheel', this.target, wheelInfo));
  }

  private isLongScroll(wheelInfo: ESLWheelEventInfo): boolean {
    const threshold = resolveCSSSize(this.config.threshold);
    return !!threshold && (Math.abs(wheelInfo.deltaX) >= threshold || Math.abs(wheelInfo.deltaY) >= threshold);
  }

  public override addEventListener(callback: EventListener): void;
  public override addEventListener(event: string, callback: EventListener): void;
  public override addEventListener(event: any, callback: EventListener = event): void {
    super.addEventListener(event, callback);

    if (this.getEventListeners().length > 1) return;
    ESLEventListener.subscribe(this, this.handleWheel, {event: 'wheel', capture: false, target: this.target});
  }

  public override removeEventListener(callback: EventListener): void;
  public override removeEventListener(event: string, callback: EventListener): void;
  public override removeEventListener(event: any, callback: EventListener = event): void {
    super.removeEventListener(event, callback);

    if (!this.hasEventListener(event)) ESLEventListener.unsubscribe(this);
  }
}

import {overrideEvent} from '../../../esl-utils/dom/events/misc';

/**
 * Event names that could be triggered by {@link ESLWheelTarget}
 */
export type WheelEventName = 'longwheel';

/**
 * Describes scroll information provided with {@link ESLWheelTarget}
 */
export interface ESLWheelEventInfo {
  /** Distance scrolled along the x-axis */
  deltaX: number;
  /** Distance scrolled along the y-axis */
  deltaY: number;
  /** First wheel event */
  startEvent: WheelEvent;
  /** Last wheel event */
  endEvent: WheelEvent;
}

/**
 * Wheel event dispatched by {@link ESLWheelTarget}
 */
export class ESLWheelEvent extends UIEvent implements ESLWheelEventInfo {
  public override readonly target: Element;

  public readonly deltaX: number;
  public readonly deltaY: number;
  public readonly endEvent: WheelEvent;
  public readonly startEvent: WheelEvent;

  protected constructor(eventName: WheelEventName, target: Element, wheelInfo: ESLWheelEventInfo) {
    super(eventName);
    overrideEvent(this, 'target', target);
    Object.assign(this, wheelInfo);
  }

  /** Creates {@link ESLWheelEvent} based on {@link ESLWheelEventInfo} */
  public static fromConfig(eventName: WheelEventName, target: Element, wheelInfo: ESLWheelEventInfo): ESLWheelEvent {
    return new ESLWheelEvent(eventName, target, wheelInfo);
  }
}

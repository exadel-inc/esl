import {overrideEvent} from '../../../esl-utils/dom/events/misc';

export type ESLIntersectionEventType = typeof ESLIntersectionEvent.TYPE | typeof ESLIntersectionEvent.IN | typeof ESLIntersectionEvent.OUT;

/**
 * An event that is fired when an element intersects with the device viewport by the {@link ESLIntersectionTarget}.
 * Based on the {@link IntersectionObserverEntry} object.
 */
export class ESLIntersectionEvent extends Event implements IntersectionObserverEntry {
  /** Type of event that will be dispatched on viewport exit */
  public static readonly OUT = 'intersects:out';
  /** Type of event that will be dispatched on viewport enter */
  public static readonly IN = 'intersects:in';
  /** Type of event that will be dispatched on both viewport enter and exit */
  public static readonly TYPE = 'intersects';
  /** @deprecated use {@link TYPE} instead */
  public static readonly type = this.TYPE;

  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/IntersectionObserverEntry/target) */
  public override readonly target: Element;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/IntersectionObserverEntry/boundingClientRect) */
  public readonly boundingClientRect: DOMRectReadOnly;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/IntersectionObserverEntry/intersectionRatio) */
  public readonly intersectionRatio: number;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/IntersectionObserverEntry/intersectionRect) */
  public readonly intersectionRect: DOMRectReadOnly;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/IntersectionObserverEntry/isIntersecting) */
  public readonly isIntersecting: boolean;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/IntersectionObserverEntry/rootBounds) */
  public readonly rootBounds: DOMRectReadOnly | null;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/IntersectionObserverEntry/time) */
  public readonly time: DOMHighResTimeStamp;

  protected constructor(target: Element, eventName: ESLIntersectionEventType) {
    super(eventName, {bubbles: false, cancelable: false});
    overrideEvent(this, 'target', target);
  }

  /** Validates event name. Accepted values are 'intersects:out', 'intersects:in', 'intersects' */
  public static isValidEventType(event: string): event is ESLIntersectionEventType {
    return event === ESLIntersectionEvent.TYPE || event === ESLIntersectionEvent.IN || event === ESLIntersectionEvent.OUT;
  }

  /** Creates {@link ESLIntersectionEvent} from {@link ESLIntersectionEvent}
    * @param eventName - Custom event name ('intersects' by default. Accepted values are 'intersects:out', 'intersects:in', 'intersects').
    * @param entry - The intersection observer entry.
   */
  public static fromEntry(eventName: ESLIntersectionEventType, entry: IntersectionObserverEntry): ESLIntersectionEvent {
    const event = new ESLIntersectionEvent(entry.target, eventName);
    const {
      boundingClientRect,
      intersectionRatio,
      intersectionRect,
      isIntersecting,
      rootBounds,
      time
    } = entry;
    Object.assign(event, {boundingClientRect, intersectionRatio, intersectionRect, isIntersecting, rootBounds, time});
    return event;
  }
}

import {overrideEvent} from '../../../esl-utils/dom/events/misc';

/**
 * An event that is fired when an element intersects with the device viewport by the {@link ESLIntersectionTarget}.
 * Based on the {@link IntersectionObserverEntry} object.
 */
export class ESLIntersectionEvent extends Event implements IntersectionObserverEntry {
  public static readonly OUT_TYPE = 'intersects:out';
  public static readonly IN_TYPE = 'intersects:in';
  public static readonly BASE_TYPE = 'intersects';

  public static readonly type:
    typeof ESLIntersectionEvent.BASE_TYPE | typeof ESLIntersectionEvent.IN_TYPE | typeof ESLIntersectionEvent.OUT_TYPE = ESLIntersectionEvent.BASE_TYPE;

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

  protected constructor(target: Element, eventName: typeof ESLIntersectionEvent.type) {
    super(eventName, {bubbles: false, cancelable: false});
    overrideEvent(this, 'target', target);
  }

  /** Validates event name. Accepted values are 'intersects:out', 'intersects:in', 'intersects' */
  public static isValidEventType(event: string): boolean {
    return event === ESLIntersectionEvent.BASE_TYPE || event === ESLIntersectionEvent.IN_TYPE || event === ESLIntersectionEvent.OUT_TYPE;
  }

  /** Creates {@link ESLIntersectionEvent} from {@link ESLIntersectionEvent}
    * @param entry - The intersection observer entry.
    * @param eventName - Custom event name ('intersects' by default. Accepted values are 'intersects:out', 'intersects:in', 'intersects').
   */
  public static fromEntry(
    entry: IntersectionObserverEntry,
    eventName: typeof ESLIntersectionEvent.type = ESLIntersectionEvent.BASE_TYPE): ESLIntersectionEvent {
    if (!ESLIntersectionEvent.isValidEventType(eventName)) eventName = ESLIntersectionEvent.BASE_TYPE;
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

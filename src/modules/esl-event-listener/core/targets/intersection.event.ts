import {overrideEvent} from '../../../esl-utils/dom/events/misc';

/**
 * An event that is fired when an element intersects with the device viewport by the {@link ESLIntersectionTarget}.
 * Based on the {@link IntersectionObserverEntry} object.
 */
export class ESLIntersectionEvent extends Event implements IntersectionObserverEntry {
  public static readonly type = 'intersects';

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

  protected constructor(target: Element) {
    super(ESLIntersectionEvent.type, {bubbles: false, cancelable: false});
    overrideEvent(this, 'target', target);
  }

  /** Creates {@link ESLIntersectionEvent} from {@link ESLIntersectionEvent} */
  public static fromEntry(entry: IntersectionObserverEntry): ESLIntersectionEvent {
    const event = new ESLIntersectionEvent(entry.target);
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

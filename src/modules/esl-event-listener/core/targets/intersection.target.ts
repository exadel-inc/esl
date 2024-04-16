import {SyntheticEventTarget} from '../../../esl-utils/dom/events/target';
import {isElement} from '../../../esl-utils/dom/api';
import {wrap} from '../../../esl-utils/misc/array';

import {ESLIntersectionEvent} from './intersection.event';

import type {ESLIntersectionEventType} from './intersection.event';

export {ESLIntersectionEvent};

/**
 * {@link EventTarget} adapter class for {@link IntersectionObserver}
 * Fires {@link ESLIntersectionEvent} on the observed {@link Element} intersection change
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
 *
 * Note: does not support sharing, creates new {@link IntersectionObserver} instance for each {@link ESLIntersectionTarget} instance
 */
export class ESLIntersectionTarget extends SyntheticEventTarget {
  /** Default {@link IntersectionObserverInit} options */
  public static readonly DEFAULTS: IntersectionObserverInit = {threshold: [0.01]};

  /** Creates {@link ESLIntersectionTarget} instance for the {@link Element}(s) */
  public static for(targets: Element[] | Element, options?: IntersectionObserverInit): ESLIntersectionTarget;
  public static for(
    targets: Element[] | Element | null | undefined,
    options: IntersectionObserverInit = {}
  ): ESLIntersectionTarget | null {
    const $targets = wrap(targets).filter(isElement);
    const initOptions = {...ESLIntersectionTarget.DEFAULTS, ...options};
    if ($targets.length) return new ESLIntersectionTarget($targets, initOptions);
    // Error handling
    console.warn('[ESL]: ESLIntersectionTarget can not observe %o', targets);
    return null;
  }

  /** Internal {@link IntersectionObserver} instance */
  protected readonly observer$$: IntersectionObserver;

  /**
   * Creates {@link ESLResizeObserverTarget} for the {@link Element}.
   * Note the {@link ESLResizeObserverTarget} instances are singletons relatively to the {@link Element}
   */
  protected constructor(
    /** Observed {@link Element | Element[]} of the {@link ESLIntersectionTarget} instance */
    public readonly targets: Element[],
    public readonly options: IntersectionObserverInit
  ) {
    super();
    this.observer$$ = new IntersectionObserver(this.handleChange.bind(this), options);
  }

  /** Internal method to handle {@link IntersectionObserver} entry change */
  protected handleChange(entries: IntersectionObserverEntry[]): void {
    entries.forEach(
      (entry) => {
        this.dispatchEvent(ESLIntersectionEvent.fromEntry(entry.isIntersecting ? ESLIntersectionEvent.IN : ESLIntersectionEvent.OUT, entry));
        this.dispatchEvent(ESLIntersectionEvent.fromEntry(ESLIntersectionEvent.TYPE, entry));
      }
    );
  }

  /** Subscribes to the observed target {@link Element} changes */
  public override addEventListener(callback: EventListener): void;
  public override addEventListener(event: ESLIntersectionEventType, callback: EventListener): void;
  public override addEventListener(event: any, callback: EventListener = event): void {
    if (typeof event !== 'string') event = ESLIntersectionEvent.TYPE;
    if (!ESLIntersectionEvent.isValidEventType(event)) {
      console.warn(`[ESL]: ESLIntersectionTarget does not support '${event}' type`);
      return;
    }
    super.addEventListener(event, callback);
    if (this.getEventListeners(event).length > 1) return;
    this.targets.forEach((target: Element) => this.observer$$.observe(target));
  }

  /** Unsubscribes from the observed target {@link Element} changes */
  public override removeEventListener(callback: EventListener): void;
  public override removeEventListener(event: ESLIntersectionEventType, callback: EventListener): void;
  public override removeEventListener(event: any, callback: EventListener = event): void {
    if (typeof event !== 'string') event = ESLIntersectionEvent.TYPE;
    if (!ESLIntersectionEvent.isValidEventType(event)) return;
    super.removeEventListener(event, callback);
    if (this.hasEventListener(event)) return;
    this.observer$$.disconnect();
  }
}

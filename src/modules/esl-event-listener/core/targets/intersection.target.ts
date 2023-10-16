import {SyntheticEventTarget} from '../../../esl-utils/dom/events/target';
import {ESLIntersectionEvent} from './intersection.event';

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
  public static for(
    targets: Element[] | Element | null | undefined,
    options: IntersectionObserverInit = ESLIntersectionTarget.DEFAULTS
  ): ESLIntersectionTarget | null {
    if (!targets) return null;
    return new ESLIntersectionTarget(([] as Element[]).concat(targets), options);
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
      (entry) => this.dispatchEvent(ESLIntersectionEvent.fromEntry(entry))
    );
  }

  /** Subscribes to the observed target {@link Element} changes */
  public override addEventListener(callback: EventListener): void;
  public override addEventListener(event: 'intersect', callback: EventListener): void;
  public override addEventListener(event: any, callback: EventListener = event): void {
    if (typeof event !== 'undefined' && event !== ESLIntersectionEvent.type) {
      console.warn(`[ESL]: ESLIntersectionTarget does not support '${event}' type`);
      return;
    }
    super.addEventListener(ESLIntersectionEvent.type, callback);
    if (this.getEventListeners(ESLIntersectionEvent.type).length > 1) return;
    this.targets.forEach((target: Element) => this.observer$$.observe(target));
  }

  /** Unsubscribes from the observed target {@link Element} changes */
  public override removeEventListener(callback: EventListener): void;
  public override removeEventListener(event: 'resize', callback: EventListener): void;
  public override removeEventListener(event: any, callback: EventListener = event): void {
    if (typeof event !== 'undefined' && event !== ESLIntersectionEvent.type) return;
    super.removeEventListener(event, callback);
    if (this.hasEventListener(ESLIntersectionEvent.type)) return;
    this.observer$$.disconnect();
  }
}

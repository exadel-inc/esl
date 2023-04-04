import {SyntheticEventTarget} from '../../../esl-utils/dom/events/target';
import {overrideEvent} from '../../../esl-utils/dom/events/misc';

/** Adapter class for {@link ResizeObserver} that implements {@link EventTarget} */
export class ESLResizeObserverTarget extends SyntheticEventTarget {
  /** {@link ESLResizeObserverTarget} instances holder */
  protected static readonly mapping = new WeakMap<Element, ESLResizeObserverTarget>();
  /** {@link ResizeObserver} instance to observe DOM element related to {@link ESLResizeObserverTarget} */
  protected static readonly observer$$ = new ResizeObserver((changes: ResizeObserverEntry[]) =>
    changes.forEach(this.handleChange, this)
  );

  /** Internal method to handle {@link ResizeObserver} entry change */
  protected static handleChange(
    this: typeof ESLResizeObserverTarget,
    detail: ResizeObserverEntry
  ): void {
    const adapter = this.mapping.get(detail.target);
    if (!adapter) return;
    const event = new CustomEvent('resize', {detail});
    overrideEvent(event, 'target', adapter.target);
    adapter.dispatchEvent(event);
  }

  /** Creates {@link ESLResizeObserverTarget} instance for the {@link Element} */
  public static create(target: Element): ESLResizeObserverTarget {
    return new ESLResizeObserverTarget(target);
  }

  /**
   * Creates {@link ESLResizeObserverTarget} for the {@link Element}.
   * Note the {@link ESLResizeObserverTarget} instances are singletons relatively to the {@link Element}
   */
  protected constructor(
    /** Observed {@link Element} of the {@link ESLResizeObserverTarget} instance */
    public readonly target: Element
  ) {
    const instance = ESLResizeObserverTarget.mapping.get(target);
    if (instance) return instance;
    super();
    ESLResizeObserverTarget.mapping.set(target, this);
  }

  /** Subscribes to the observed target {@link Element} changes */
  public override addEventListener(callback: EventListener): void;
  public override addEventListener(event: 'resize', callback: EventListener): void;
  public override addEventListener(event: any, callback: EventListener = event): void {
    if (typeof event === 'string' && event !== 'resize') {
      console.warn(`[ESL]: ESLResizeObserverTarget does not support '${event}' type`);
      return;
    }

    super.addEventListener('resize', callback);
    if (this.getEventListeners('resize').length > 1) return;
    ESLResizeObserverTarget.observer$$.observe(this.target);
  }

  /** Unsubscribes from the observed target {@link Element} changes */
  public override removeEventListener(callback: EventListener): void;
  public override removeEventListener(event: 'resize', callback: EventListener): void;
  public override removeEventListener(event: any, callback: EventListener = event): void {
    if (typeof event === 'string' && event !== 'resize') return;

    super.removeEventListener('resize', callback);
    if (this.hasEventListener('resize')) return;
    ESLResizeObserverTarget.observer$$.unobserve(this.target);
  }
}

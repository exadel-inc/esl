import {SyntheticEventTarget} from '../../../esl-utils/dom/events/target';

/** Adapter class for {@link ResizeObserver} that implements {@link EventTarget} */
export class ESLResizeObserverTarget extends SyntheticEventTarget {
  /** {@link ESLResizeObserverTarget} instances holder */
  protected static readonly mapping = new WeakMap<Element, ESLResizeObserverTarget>();
  /** {@link ResizeObserver} instance to observe DOM element related to {@link ESLResizeObserverTarget} */
  protected static readonly observer$$ = new ResizeObserver(
    (changes: ResizeObserverEntry[]) => changes.forEach(this.handleChange, this)
  );

  /** Internal method to handle {@link ResizeObserver} entry change */
  protected static handleChange(this: typeof ESLResizeObserverTarget, detail: ResizeObserverEntry): void {
    const adapter = this.mapping.get(detail.target);
    if (!adapter) return;
    const event = new CustomEvent('resize', {detail});
    adapter.dispatchEvent(event);
  }

  /**
   * Creates {@link ESLResizeObserverTarget} for the {@link Element}.
   * Note the {@link ESLResizeObserverTarget} instances are singletons relatively to the {@link Element}
   */
  constructor(
    /** Observed {@link Element} of the {@link ESLResizeObserverTarget} instance */
    public override readonly target: Element
  ) {
    const instance = ESLResizeObserverTarget.mapping.get(target);
    if (instance) return instance;
    super();
    ESLResizeObserverTarget.mapping.set(target, this);
  }

  /** Subscribes to the observed target {@link Element} changes */
  public addEventListener(callback: EventListener): void;
  public addEventListener(event: 'resize', callback: EventListener): void;
  public addEventListener(event: any, callback: EventListener = event): void {
    if (typeof event === 'string' && event !== 'resize') {
      console.warn(`[ESL]: ESLResizeObserverTarget does not support '${event}' type`);
      return;
    }

    super.addEventListener('resize', callback);
    if (this.hasEventListener('resize', 1)) return;
    ESLResizeObserverTarget.observer$$.observe(this.target);
  }

  /** Unsubscribes from the observed target {@link Element} changes */
  public removeEventListener(callback: EventListener): void;
  public removeEventListener(event: 'resize', callback: EventListener): void;
  public removeEventListener(event: any, callback: EventListener = event): void {
    if (typeof event === 'string' && event !== 'resize') return;

    super.removeEventListener('resize', callback);
    if (this.hasEventListener('resize')) return;
    ESLResizeObserverTarget.observer$$.unobserve(this.target);
  }
}

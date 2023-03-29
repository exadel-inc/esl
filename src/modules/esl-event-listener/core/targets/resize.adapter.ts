import {SyntheticEventTarget} from '../../../esl-utils/dom/events/target';
import {overrideEvent} from '../../../esl-utils/dom/events/misc';

import type {ESLDomElementTarget} from '../../../esl-utils/abstract/dom-target';

export type ESLResizeTarget = ESLDomElementTarget | Window;

/** Adapter class for {@link ResizeObserver} that implements {@link EventTarget} */
export class ESLResizeObserverTarget extends SyntheticEventTarget {
  /** {@link ESLResizeObserverTarget} instances holder */
  protected static readonly mapping = new WeakMap<Element | EventTarget, ESLResizeObserverTarget>();
  /** {@link ResizeObserver} instance to observe DOM element related to {@link ESLResizeObserverTarget} */
  protected static readonly observer$$ = new ResizeObserver((changes: ResizeObserverEntry[]) =>
    changes.forEach(this.handleChange, this)
  );

  /** Observed {@link ESLResizeTarget} of the {@link ESLResizeObserverTarget} instance */
  public readonly target: Element | Window;

  /** Internal method to handle {@link ResizeObserver} entry change */
  protected static handleChange(
    this: typeof ESLResizeObserverTarget,
    detail: ResizeObserverEntry | Event
  ): void {
    if (!detail.target) return;
    const adapter = this.mapping.get(detail.target);
    if (!adapter) return;
    const event = new CustomEvent('resize', {detail});
    overrideEvent(event, 'target', adapter.target);
    adapter.dispatchEvent(event);
  }

  /** Creates {@link ESLResizeObserverTarget} instance for the {@link ESLResizeTarget} */
  public static create(target: ESLResizeTarget): ESLResizeObserverTarget {
    return new ESLResizeObserverTarget(target);
  }

  /**
   * Creates {@link ESLResizeObserverTarget} for the {@link ESLResizeTarget}.
   * Note the {@link ESLResizeObserverTarget} instances are singletons relatively to the {@link ESLResizeTarget}
   */
  protected constructor(target: ESLResizeTarget) {
    if (!(target instanceof Window || target instanceof Element)) target = target.$host;
    const instance = ESLResizeObserverTarget.mapping.get(target);
    if (instance) return instance;
    super();
    this.target = target;
    ESLResizeObserverTarget.mapping.set(this.target, this);
  }

  /** Subscribes to the observed target {@link Element} or {@link Window} changes */
  public override addEventListener(callback: EventListener): void;
  public override addEventListener(event: 'resize', callback: EventListener): void;
  public override addEventListener(event: any, callback: EventListener = event): void {
    if (typeof event === 'string' && event !== 'resize') {
      console.warn(`[ESL]: ESLResizeObserverTarget does not support '${event}' type`);
      return;
    }

    super.addEventListener('resize', callback);
    if (this.hasEventListener('resize', 1)) return;

    if (this.target instanceof Window) {
      window.addEventListener('resize', (e: Event) => ESLResizeObserverTarget.handleChange(e));
    } else {
      ESLResizeObserverTarget.observer$$.observe(this.target);
    }
  }

  /** Unsubscribes from the observed target {@link Element} or {@link Window} changes */
  public override removeEventListener(callback: EventListener): void;
  public override removeEventListener(event: 'resize', callback: EventListener): void;
  public override removeEventListener(event: any, callback: EventListener = event): void {
    if (typeof event === 'string' && event !== 'resize') return;

    super.removeEventListener('resize', callback);
    if (this.hasEventListener('resize')) return;

    if (this.target instanceof Window) {
      window.removeEventListener('resize', (e: Event) => ESLResizeObserverTarget.handleChange(e));
    } else {
      ESLResizeObserverTarget.observer$$.unobserve(this.target);
    }
  }
}

import {SyntheticEventTarget} from '../../../esl-utils/dom/events/target';
import {resolveDomTarget} from '../../../esl-utils/abstract/dom-target';
import {ESLEventListener} from '../listener';
import {ESLElementResizeEvent} from './resize.adapter.event';

import type {ESLDomElementTarget} from '../../../esl-utils/abstract/dom-target';

export {ESLElementResizeEvent};

/** Adapter class for {@link ResizeObserver} that implements {@link EventTarget} */
export class ESLResizeObserverTarget extends SyntheticEventTarget {
  /** {@link ESLResizeObserverTarget} instances holder */
  protected static readonly mapping = new WeakMap<Element | Window, ESLResizeObserverTarget>();
  /** {@link ResizeObserver} instance to observe DOM element related to {@link ESLResizeObserverTarget} */
  protected static readonly observer$$ = new ResizeObserver((changes: ResizeObserverEntry[]) =>
    changes.forEach(this.handleChange, this)
  );

  /** Observed {@link Element} of the {@link ESLResizeObserverTarget} instance or {@link Window} object */
  public readonly target: Element | Window;

  /** Internal method to handle {@link ResizeObserver} entry change */
  protected static handleChange(
    this: typeof ESLResizeObserverTarget,
    entry: ResizeObserverEntry | Event
  ): void {
    const adapter = (this instanceof ESLResizeObserverTarget ? (this.constructor as typeof ESLResizeObserverTarget) : this)
      .mapping.get(entry.target as (Element | Window));
    if (!adapter) return;
    adapter.dispatchEvent(entry instanceof Event ? ESLElementResizeEvent.fromEvent(entry)! : ESLElementResizeEvent.fromEntry(entry));
  }

  /** Creates {@link ESLResizeObserverTarget} instance for the {@link ESLDomElementTarget} */
  public static for(target: ESLDomElementTarget | Window): ESLResizeObserverTarget {
    return new ESLResizeObserverTarget(target);
  }

  /**
   * Creates {@link ESLResizeObserverTarget} for the {@link ESLDomElementTarget}.
   * Note the {@link ESLResizeObserverTarget} instances are singletons relatively to the {@link Element} or {@link Window}
   */
  protected constructor(target: ESLDomElementTarget | Window) {
    if (!(target instanceof Window)) target = resolveDomTarget(target);
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
    if (this.getEventListeners('resize').length > 1) return;

    if (this.target instanceof Window) {
      ESLEventListener.subscribe(this, ESLResizeObserverTarget.handleChange, {event: 'resize', target: window});
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
      ESLEventListener.get(this, ESLResizeObserverTarget.handleChange, {event: 'resize', target: window}).forEach((listener) => listener.unsubscribe());
    } else {
      ESLResizeObserverTarget.observer$$.unobserve(this.target);
    }
  }
}

import {sequentialUID} from '../../misc/uid';
import {memoize} from '../../decorators/memoize';
import {isSimilar} from '../../misc/object/compare';
import {TraversingQuery} from '../../../esl-traversing-query/core';

/** Describes callback handler */
export type ESLListenerHandler<EType extends Event = Event> = (event: EType, listener?: ESLEventListener) => void;

/** Extended event map with the custom event definition */
export interface ESLListenerEventMap extends HTMLElementEventMap {
  /** User custom event or group of events */
  [e: string]: Event;
}

/** Descriptor to create {@link ESLEventListener} */
export type ESLListenerDescriptor<EType extends keyof ESLListenerEventMap = string> = {
  /** Event type (name) */
  event: EType;
  /** Use capture DOM Event phase */
  capture?: boolean;

  /** CSS selector to check delegated event */
  selector?: string;
  /** {@link TraversingQuery} selector or element target to subscribe */
  target?: string | EventTarget;

  /** Identifier to group event listeners */
  id?: string;
  /** Marks the listener to be automatically subscribed and unsubscribed within connected/disconnected elements hooks */
  auto?: boolean;
};

/** Condition (criteria) to find {@link ESLListenerDescriptor} */
export type ESLListenerCriteria = undefined | keyof ESLListenerEventMap | ESLListenerHandler | Partial<ESLListenerDescriptor>;

/** Function decorated as {@link ESLListenerDescriptor} */
export type ESLListenerDescriptorFn = ESLListenerHandler & ESLListenerDescriptor;

/** Type guard to check if the passed function is typeof {@link ESLListenerDescriptorFn} */
export const isDescriptorFn = (obj: any): obj is ESLListenerDescriptorFn => typeof obj === 'function' && typeof obj.event === 'string';

const STORE = '__listeners';

/** Event Listener instance, used as an 'inner' record to process subscriptions made by `EventUtils` */
export class ESLEventListener implements ESLListenerDescriptor {
  public readonly id: string;
  public readonly event: string;
  public readonly capture?: boolean;
  public readonly selector?: string;
  public readonly target?: string | EventTarget;

  constructor(
    public readonly $host: HTMLElement,
    public readonly handler: ESLListenerHandler,
    desc: ESLListenerDescriptor
  ) {
    desc.id = desc.id || sequentialUID('esl.event');
    Object.assign(this, {capture: false}, desc);
    this.handle = this.handle.bind(this);
  }

  /** @returns target element to listen */
  @memoize()
  public get $targets(): EventTarget[] {
    if (this.target instanceof Document || this.target instanceof Element || this.target instanceof Window) {
      return [this.target];
    }
    if (typeof this.target === 'string') {
      return TraversingQuery.all(this.target, this.$host);
    }
    return [this.$host];
  }

  /**
   * Checks if the passed criteria matches current event listener
   * - `string` type criteria checked by the `event` name
   * - `function` type criteria checked by the `handler` reference
   * - `object` type criteria checked as descriptor using `isSimilar` comparer
   * Note: `function` (handler) marcher has a priority over descriptor check, so handler function own properties will be ignored
   */
  public matches(desc?: ESLListenerCriteria): boolean {
    if (typeof desc === 'string') return this.event === desc;
    if (typeof desc === 'function') return this.handler === desc;
    if (typeof desc === 'object') return isSimilar(this, desc);
    return false;
  }

  /** Handles caught event (used as callback for low-level subscriptions) */
  protected handle(e: Event): void {
    if (this.isDelegatedTarget(e)) this.handler.call(this.$host, e, this);
  }

  /** Checks if the passed event can be handled by the curren event listener */
  protected isDelegatedTarget(e: Event): boolean {
    if (typeof this.selector !== 'string') return true;
    const target = e.target;
    const current = e.currentTarget;
    if (!(target instanceof HTMLElement) || !(current instanceof HTMLElement)) return false;
    return current.contains(target.closest(this.selector));
  }

  /** (Re-)Subscribes event listener instance */
  public subscribe(): void {
    this.unsubscribe();
    memoize.clear(this, '$targets');
    this.$targets.forEach((el: EventTarget) => el.addEventListener(this.event, this.handle, this.capture));
    ESLEventListener.get(this.$host).push(this);
  }

  /** Unsubscribes event listener instance */
  public unsubscribe(): void {
    this.$targets.forEach((el: EventTarget) => el.removeEventListener(this.event, this.handle, this.capture));
    const listeners = ESLEventListener.get(this.$host);
    const value = listeners.filter((listener) => listener !== this);
    Object.defineProperty(this.$host, STORE, {value, configurable: true});
  }

  /** Gets stored listeners array the passed `host` object */
  public static get(host?: any): ESLEventListener[] {
    if (!host) return [];
    if (!Object.hasOwnProperty.call(host, STORE)) host[STORE] = [];
    return host[STORE];
  }

  /** Gets descriptors from the passed object */
  public static descriptors(target?: any): ESLListenerDescriptorFn[] {
    if (!target) return [];
    const desc: ESLListenerDescriptorFn[] = [];
    for (const key in target) {
      if (isDescriptorFn(target[key])) desc.push(target[key]);
    }
    return desc;
  }

  /** Creates event listeners by handler and descriptors */
  public static create(target: HTMLElement, handler: ESLListenerHandler, desc: string | ESLListenerDescriptor): ESLEventListener[] {
    desc = typeof desc === 'string' ? {event: desc} : desc;
    return ESLEventListener.splitEventQ(desc.event).map((event) => {
      const spec: ESLListenerDescriptor = Object.assign({}, desc, {event});
      return new ESLEventListener(target, handler, spec);
    });
  }

  /** Splits and deduplicate event query */
  protected static splitEventQ(query: string): string[] {
    const terms = (query || '').split(' ').map((term) => term.trim());
    const deduplicate = new Set<string>();
    return terms.filter((term) => {
      if (!term || deduplicate.has(term)) return false;
      deduplicate.add(term);
      return true;
    });
  }
}

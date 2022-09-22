import {wrap} from '../../esl-utils/misc/array';
import {resolveProperty} from '../../esl-utils/misc/functions';
import {memoize} from '../../esl-utils/decorators/memoize';
import {isSimilar} from '../../esl-utils/misc/object/compare';
import {TraversingQuery} from '../../esl-traversing-query/core';
import {isPassiveByDefault} from '../../esl-utils/dom/events/misc';

import type {PropertyProvider} from '../../esl-utils/misc/functions';
import type {
  ESLListenerTarget,
  ESLListenerDefinition,
  ESLListenerDescriptor,
  ESLListenerHandler,
  ESLListenerCriteria
} from './descriptor';

/** Key to store listeners on the host */
const STORE = '__esl_listeners';

/**
 * Splits and deduplicates event string
 * @returns array of unique events presented in events string
 */
export const splitEvents = (events: string): string[] => {
  const terms = (events || '').split(' ').map((term) => term.trim());
  const deduplicate = new Set<string>();
  return terms.filter((term) => {
    if (!term || deduplicate.has(term)) return false;
    deduplicate.add(term);
    return true;
  });
};

/**
 * `EventListener` instance, used as an 'inner' record to process subscriptions made by `EventUtils`
 * Uses `EventListenerObject` interface to subscribe on event.
 *
 * Use Chrome console `getEventListeners` method to check subscribers details when debugging ESLEventListener subscriptions.
 * */
export class ESLEventListener implements ESLListenerDefinition, EventListenerObject {
  public readonly target?: ESLListenerTarget | PropertyProvider<ESLListenerTarget>;
  public readonly selector?: string;
  public readonly capture?: boolean;

  public readonly once?: boolean;
  public readonly auto?: boolean;
  public readonly passive?: boolean;
  public readonly context?: unknown;

  protected constructor(
    public readonly $host: HTMLElement,
    public readonly event: string,
    public readonly handler: ESLListenerHandler,
    desc: ESLListenerDescriptor
  ) {
    const defaults = {
      capture: false,
      passive: isPassiveByDefault(event)
    };
    Object.assign(this, defaults, desc, {event});
  }

  /** @returns target element to listen */
  @memoize()
  public get $targets(): EventTarget[] {
    const target = resolveProperty(this.target, this.context || this.$host);
    if (typeof target === 'undefined') return [this.$host];
    if (typeof target === 'string') return TraversingQuery.all(target, this.$host);
    if (typeof target === 'object' && target) return wrap(target);
    return [];
  }

  /** @returns resolved selector to check event target */
  public get delegate(): string | undefined {
    return resolveProperty(this.selector, this.context || this.$host);
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
    if (typeof desc === 'object') return isSimilar(this, desc, false);
    return false;
  }

  /** Handles caught event (used as callback for low-level subscriptions) */
  public handleEvent(e: Event): void {
    if (!this.isDelegatedTarget(e)) return;
    this.handler.call(this.context ?? this.$host, e, this);
    if (this.once) this.unsubscribe();
  }

  /** Checks if the passed event can be handled by the current event listener */
  protected isDelegatedTarget(e: Event): boolean {
    const target = e.target;
    const current = e.currentTarget;
    const delegate = this.delegate;
    if (typeof delegate !== 'string') return true;
    if (!delegate || !(target instanceof HTMLElement) || !(current instanceof HTMLElement)) return false;
    return current.contains(target.closest(delegate));
  }

  /**
   * (Re-)Subscribes event listener instance
   * @returns if subscription was successful
   */
  public subscribe(): boolean {
    const {passive, capture} = this;
    this.unsubscribe();
    memoize.clear(this, '$targets');
    if (!this.$targets.length) return false;
    this.$targets.forEach((el: EventTarget) => el.addEventListener(this.event, this, {passive, capture}));
    ESLEventListener.add(this.$host, this);
    return true;
  }

  /** Unsubscribes event listener instance */
  public unsubscribe(): void {
    const {capture} = this;
    if (!memoize.has(this, '$targets')) return;
    this.$targets.forEach((el: EventTarget) => el.removeEventListener(this.event, this, {capture}));
    ESLEventListener.remove(this.$host, this);
  }

  /**
   * Gets stored listeners array the passed `host` object
   * Supports additional filtration criteria
   */
  public static get(host?: any, ...criteria: ESLListenerCriteria[]): ESLEventListener[] {
    if (!host) return [];
    const listeners = (host[STORE] || []) as ESLEventListener[];
    if (!criteria.length) return listeners;
    return listeners.filter((listener) => criteria.every(listener.matches, listener));
  }
  /** Adds listener to the listener store of the host object */
  protected static add(host: any, instance: ESLEventListener): void {
    if (!host) return;
    if (!Object.hasOwnProperty.call(host, STORE)) host[STORE] = [];
    host[STORE].push(instance);
  }
  /** Removes listener from the listener store of the host object */
  protected static remove(host: any, instance: ESLEventListener): void {
    const listeners = ESLEventListener.get(host);
    const value = listeners.filter((listener) => listener !== instance);
    Object.defineProperty(host, STORE, {value, configurable: true});
  }

  /** Creates or resolve existing event listeners by handler and descriptors */
  public static createOrResolve(host: HTMLElement, handler: ESLListenerHandler, desc: ESLListenerDescriptor): ESLEventListener[] {
    const eventString = resolveProperty(desc.event, desc.context || host);

    const listeners: ESLEventListener[] = [];
    for (const event of splitEvents(eventString)) {
      const subscribed = ESLEventListener.get(host, event, handler, {
        target: desc.target,
        selector: desc.selector,
        capture: !!desc.capture
      });
      if (subscribed.length) listeners.push(...subscribed);
      else listeners.push(new ESLEventListener(host, event, handler, desc));
    }
    return listeners;
  }
}

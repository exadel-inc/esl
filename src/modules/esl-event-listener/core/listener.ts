import {wrap} from '../../esl-utils/misc/array';
import {isElement} from '../../esl-utils/dom/api';
import {isPassiveByDefault} from '../../esl-utils/dom/events/misc';
import {resolveProperty} from '../../esl-utils/misc/functions';
import {isObject, isObjectLike, isSimilar} from '../../esl-utils/misc/object';
import {resolveDomTarget} from '../../esl-utils/abstract/dom-target';
import {memoize} from '../../esl-utils/decorators/memoize';
import {ESLTraversingQuery} from '../../esl-traversing-query/core';

import type {PropertyProvider} from '../../esl-utils/misc/functions';
import type {
  ESLListenerTarget,
  ESLListenerDefinition,
  ESLListenerDescriptor,
  ESLListenerDescriptorFn,
  ESLListenerHandler,
  ESLListenerCriteria
} from './types';

/** Key to store listeners on the host */
const LISTENERS = (window.Symbol || String)('__esl_listeners');

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
 * `EventListener` instance, used as an 'inner' record to process subscriptions made by `ESLEventUtils`
 * Uses `EventListenerObject` interface to subscribe on event.
 *
 * Use Chrome console `getEventListeners` method to check subscribers details when debugging ESLEventListener subscriptions.
 * */
export class ESLEventListener implements ESLListenerDefinition, EventListenerObject {
  public readonly target?: ESLListenerTarget | PropertyProvider<ESLListenerTarget>;
  public readonly condition?: PropertyProvider<boolean>;
  public readonly selector?: string;
  public readonly capture?: boolean;

  public readonly once?: boolean;
  public readonly auto?: boolean;
  public readonly passive?: boolean;

  public readonly group?: string;

  protected constructor(
    public readonly host: object,
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
    const target = resolveProperty(this.target, this.host);
    if (isObject(target)) return wrap(target);
    const $host = resolveDomTarget(this.host);
    if (typeof target === 'string') return ESLTraversingQuery.all(target, $host);
    if (typeof target === 'undefined' && $host) return [$host];
    return [];
  }

  /** @returns resolved selector to check event target */
  public get delegate(): string | undefined {
    return resolveProperty(this.selector, this.host);
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

  /**
   * Memoized builder for bound and decorated low level subscription.
   * Implements DOM API {@link EventListenerObject.handleEvent}
   */
  @memoize()
  public get handleEvent(): EventListener {
    const handlerBound = this.handler.bind(this.host);
    const handlerFull = this.once
      ? (e: Event): void => (handlerBound(e), this.unsubscribe())
      : handlerBound;
    return this.selector
      ? (e: Event): void => this.handleDelegation(e, handlerFull)
      : handlerFull;
  }

  /** Executes a handler if the passed event is accepted by the selector */
  protected handleDelegation(e: Event, handler: EventListener): void {
    const {delegate} = this;
    const {target, currentTarget} = e;

    if (typeof delegate !== 'string' || !delegate) return;
    if (!isElement(target)) return;

    const $delegate = target.closest(delegate);
    if (!isElement($delegate) || isElement(currentTarget) && !currentTarget.contains($delegate)) return;

    handler(Object.assign(e, {$delegate}));
  }

  /**
   * (Re-)Subscribes event listener instance
   * @returns if subscription was successful
   */
  public subscribe(): boolean {
    const {passive, capture} = this;
    this.unsubscribe();
    memoize.clear(this, ['$targets', 'handleEvent']);
    if (resolveProperty(this.condition, this.host) === false) return false;
    if (!this.$targets.length) {
      console.warn('[ESL]: No targets found for event listener', this);
      return false;
    }
    this.$targets.forEach((el: EventTarget) => el.addEventListener(this.event, this, {passive, capture}));
    ESLEventListener.add(this.host, this);
    return true;
  }

  /** Unsubscribes event listener instance */
  public unsubscribe(): void {
    const {capture} = this;
    if (!memoize.has(this, '$targets')) return;
    this.$targets.forEach((el: EventTarget) => el.removeEventListener(this.event, this, {capture}));
    ESLEventListener.remove(this.host, this);
  }

  /**
   * Gets stored listeners array the passed `host` object
   * Supports additional filtration criteria
   */
  public static get(host?: object, ...criteria: ESLListenerCriteria[]): ESLEventListener[] {
    if (!isObjectLike(host)) return [];
    const listeners = ((host as any)[LISTENERS] || []) as ESLEventListener[];
    if (!criteria.length) return listeners;
    return listeners.filter((listener) => criteria.every(listener.matches, listener));
  }
  /** Adds a listener to the listener store of the host object */
  protected static add(host: object, instance: ESLEventListener): void {
    if (!Object.hasOwnProperty.call(host, LISTENERS)) (host as any)[LISTENERS] = [];
    (host as any)[LISTENERS].push(instance);
  }
  /** Removes listener from the listener store of the host object */
  protected static remove(host: object, instance: ESLEventListener): void {
    const listeners = ESLEventListener.get(host);
    const value = listeners.filter((listener) => listener !== instance);
    Object.defineProperty(host, LISTENERS, {value, configurable: true});
  }

  /**
   * Subscribes `handler` function with the passed event type or {@link ESLListenerDescriptor} with event type declared
   * @param host - host object (listeners context) to associate subscription
   * @param handler - handler function to subscribe
   * @param descriptor - event or {@link ESLListenerDescriptor} with defined event type
   */
  public static subscribe(
    host: object,
    handler: ESLListenerHandler | ESLListenerDescriptorFn,
    descriptor: ESLListenerDescriptor | ESLListenerDescriptorFn = handler as ESLListenerDescriptorFn
  ): ESLEventListener[] {
    if (typeof handler !== 'function') return [];
    const eventDesc = handler !== descriptor ? Object.assign({}, handler, descriptor) : descriptor;
    const listeners = ESLEventListener.createOrResolve(host, handler, eventDesc);
    return listeners.filter((listener) => listener.subscribe());
  }

  /**
   * Unsubscribes {@link ESLEventListener}(s) from the object
   * @param host - host element that stores subscriptions (listeners context)
   * @param criteria - optional set of criteria {@link ESLListenerCriteria} to filter listeners to remove
   */
  public static unsubscribe(host: object, ...criteria: ESLListenerCriteria[]): ESLEventListener[] {
    const listeners = ESLEventListener.get(host, ...criteria);
    listeners.forEach((listener) => listener.unsubscribe());
    return listeners;
  }

  /** Creates or resolves existing event listeners by handler and descriptors */
  public static createOrResolve(
    host: object,
    handler: ESLListenerHandler,
    desc: ESLListenerDescriptor
  ): ESLEventListener[] {
    if (!isObjectLike(host)) throw new Error('[ESL]: Host object is not provided for event listener subscription');
    const events = splitEvents(resolveProperty(desc.event, host));
    if (events.length === 0) console.warn('[ESL]: No valid events passed for event listener %o of host %o', desc, host);
    const listeners: ESLEventListener[] = [];
    for (const event of events) {
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

import {wrap} from '../../esl-utils/misc/array';
import {sequentialUID} from '../../esl-utils/misc/uid';
import {resolveProperty} from '../../esl-utils/misc/functions';
import {memoize} from '../../esl-utils/decorators/memoize';
import {isSimilar} from '../../esl-utils/misc/object/compare';
import {TraversingQuery} from '../../esl-traversing-query/core';
import {isPassiveByDefault, splitEvents} from '../../esl-utils/dom/events/misc';

import type {ESLListenerDefinition, ESLListenerDescriptor, ESLListenerEventMap} from './descriptor';


/** Describes callback handler */
export type ESLListenerHandler<EType extends Event = Event> = (event: EType, listener?: ESLEventListener) => void;

/** Condition (criteria) to find {@link ESLListenerDescriptor} */
export type ESLListenerCriteria = undefined | keyof ESLListenerEventMap | ESLListenerHandler | Partial<ESLListenerDefinition>;

const STORE = '__listeners';

/**
 * `EventListener` instance, used as an 'inner' record to process subscriptions made by `EventUtils`
 * Uses `EventListenerObject` interface to subscribe on event.
 *
 * Use Chrome console `getEventListeners` method to check subscribers details when debugging ESLEventListener subscriptions.
 * */
export class ESLEventListener implements ESLListenerDefinition, EventListenerObject {
  public readonly id: string;
  public readonly event: string;
  public readonly once?: boolean;
  public readonly auto?: boolean;
  public readonly target?: string | EventTarget | EventTarget[];
  public readonly capture?: boolean;
  public readonly passive?: boolean;
  public readonly selector?: string;
  public readonly context?: unknown;

  constructor(
    public readonly $host: HTMLElement,
    public readonly handler: ESLListenerHandler,
    desc: ESLListenerDescriptor
  ) {
    desc = Object.assign({}, desc);
    desc.id = desc.id || sequentialUID('esl.event');
    desc.target = resolveProperty(desc.target, desc.context || $host);
    desc.selector = resolveProperty(desc.selector, desc.context || $host);
    Object.assign(this, {
      capture: false,
      passive: isPassiveByDefault(this.event)
    }, desc);
  }

  /** @returns target element to listen */
  @memoize()
  public get $targets(): EventTarget[] {
    if (typeof this.target === 'string') return TraversingQuery.all(this.target, this.$host);
    if (typeof this.target === 'undefined') return [this.$host];
    if (typeof this.target === 'object' && this.target) return wrap(this.target);
    return [];
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
    if (typeof this.selector !== 'string') return true;
    const target = e.target;
    const current = e.currentTarget;
    if (!(target instanceof HTMLElement) || !(current instanceof HTMLElement)) return false;
    return current.contains(target.closest(this.selector));
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
    this.$targets.forEach((el: EventTarget) => el.removeEventListener(this.event, this, {capture}));
    ESLEventListener.remove(this.$host, this);
  }

  /** Gets stored listeners array the passed `host` object */
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
    const events = resolveProperty(desc.event, desc.context || host);
    if (!events.length) {
      console.warn('[ESL]: Can\'t create ESLEventListener with empty event type: %o %o', handler, desc);
    }
    return splitEvents(events).map((event) => {
      const spec = Object.assign({}, desc, {event}) as ESLListenerDefinition;
      const instance = ESLEventListener.get(host, handler, spec)[0];
      return instance || (new ESLEventListener(host, handler, spec));
    });
  }
}

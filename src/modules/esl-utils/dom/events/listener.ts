import {sequentialUID} from '../../misc/uid';
import {memoize} from '../../decorators/memoize';
import {isSimilar} from '../../misc/object/compare';
import {TraversingQuery} from '../../../esl-traversing-query/core';
import {isPassiveByDefault} from './misc';

/** Describes callback handler */
export type ESLListenerHandler<EType extends Event = Event> = (event: EType, listener?: ESLEventListener) => void;

/** Extended event map with the custom event definition */
export interface ESLListenerEventMap extends HTMLElementEventMap {
  /** User custom event or group of events */
  [e: string]: Event;
}

/** Descriptor to create {@link ESLEventListener} */
export type ESLListenerDescriptor<EType extends keyof ESLListenerEventMap = string> = {
  /** A case-sensitive string representing the event type to listen for */
  event: EType;
  /**
   * A boolean value indicating that events for this listener will be dispatched on the capture phase.
   * @see AddEventListenerOptions.capture
   */
  capture?: boolean;
  /**
   * A boolean value that indicates that the function specified by listener will never call preventDefault()
   * @see AddEventListenerOptions.passive
   */
  passive?: boolean;

  /** A string representing CSS selector to check delegated event target (undefined (disabled) by default) */
  selector?: string;
  /**
   * A string selector to find the target or {@link EventTarget} object to subscribe the event listener to
   * **Note**: string values are processed by the {@link TraversingQuery} syntax
   * (e.g. `button` selects all buttons globally, while `::find(button)` selects only buttons inside current element)
   */
  target?: string | EventTarget;

  /** Identifier of the event listener. Can be used to group and unsubscribe listeners */
  id?: string;
  /**
   * A reference to the component (mixin) that holds the event listener descriptor
   * Used as a call context for the event listener handler if defined
   */
  context?: unknown;

  /** A boolean value indicating that the listener should be automatically subscribed within connected callback */
  auto?: boolean;
  /** A boolean value indicating that the listener should be invoked at most once after being added */
  once?: boolean;
};

/** Condition (criteria) to find {@link ESLListenerDescriptor} */
export type ESLListenerCriteria = undefined | keyof ESLListenerEventMap | ESLListenerHandler | Partial<ESLEventListener>;

const STORE = '__listeners';

/**
 * `EventListener` instance, used as an 'inner' record to process subscriptions made by `EventUtils`
 * Uses `EventListenerObject` interface to subscribe on event.
 *
 * Use Chrome console `getEventListeners` method to check subscribers details when debugging ESLEventListener subscriptions.
 * */
export class ESLEventListener implements ESLListenerDescriptor, EventListenerObject {
  public readonly id: string;
  public readonly event: string;
  public readonly once?: boolean;
  public readonly auto?: boolean;
  public readonly target?: string | EventTarget;
  public readonly capture?: boolean;
  public readonly passive?: boolean;
  public readonly selector?: string;
  public readonly context?: unknown;

  constructor(
    public readonly $host: HTMLElement,
    public readonly handler: ESLListenerHandler,
    desc: ESLListenerDescriptor
  ) {
    desc.id = desc.id || sequentialUID('esl.event');
    Object.assign(this, {
      capture: false,
      passive: isPassiveByDefault(this.event)
    }, desc);
  }

  /** @returns target element to listen */
  @memoize()
  public get $targets(): EventTarget[] {
    if (typeof this.target === 'object' && this.target) {
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
    if (typeof desc === 'object') return isSimilar(this, desc, false);
    return false;
  }

  /** Handles caught event (used as callback for low-level subscriptions) */
  public handleEvent(e: Event): void {
    if (!this.isDelegatedTarget(e)) return;
    this.handler.call(this.context ?? this.$host, e, this);
    if (this.once) this.unsubscribe();
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
    const {passive, capture} = this;
    this.unsubscribe();
    memoize.clear(this, '$targets');
    this.$targets.forEach((el: EventTarget) => el.addEventListener(this.event, this, {passive, capture}));
    ESLEventListener.get(this.$host).push(this);
  }

  /** Unsubscribes event listener instance */
  public unsubscribe(): void {
    const {capture} = this;
    this.$targets.forEach((el: EventTarget) => el.removeEventListener(this.event, this, {capture}));
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

  /** Creates event listeners by handler and descriptors */
  public static create(target: HTMLElement, handler: ESLListenerHandler, desc: ESLListenerDescriptor): ESLEventListener[] {
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

import {sequentialUID} from '../../misc/uid';
import {memoize} from '../../decorators/memoize';
import {isSimilar} from '../../misc/object/compare';
import {TraversingQuery} from '../../../esl-traversing-query/core';

/** Describes callback handler */
export type ESLListenerHandler = (e: Event, listener: ESLEventListener) => void;
/** Descriptor to create {@link ESLEventListener} */
export type ESLListenerDescriptor = {
  /** Event type (name) */
  event: string;
  /** Use capture DOM Event phase */
  capture?: boolean;

  /** CSS selector to check delegated event */
  selector?: string;
  /** {@link TraversingQuery} selector or element target to subscribe */
  target?: string | Element | Document | Window;

  /** Identifier to group event listeners */
  id?: string;
  /** Marks listener to be automatically subscribed and unsubscribed with connected/disconnected elements hooks */
  auto?: boolean;
};

const STORE = '__listeners';

/** Event Listener instance, used as an 'inner' record to process subscriptions made by `EventUtils` */
export class ESLEventListener implements ESLListenerDescriptor {
  public readonly id: string;
  public readonly event: string;
  public readonly capture?: boolean;
  public readonly selector?: string;
  public readonly target?: string | Element | Document | Window;

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
  public get $targets(): HTMLElement[] | [Element | Document | Window] {
    if (this.target instanceof Document || this.target instanceof Element || this.target instanceof Window) {
      return [this.target];
    }
    return TraversingQuery.all(this.target || '', this.$host) as HTMLElement[];
  }

  /**
   * Checks if the passed criteria matches current event listener
   * - `string` type criteria checked by the `event` name
   * - `function` type criteria checked by the `handler` reference
   * - `object` type criteria checked as descriptor using `isSimilar` comparer
   * Note: `function` (handler) marcher has a priority over descriptor check, so handler function own properties will be ignored
   */
  public matches(desc?: Partial<ESLListenerDescriptor> | ESLListenerHandler | string): boolean {
    if (typeof desc === 'string') return this.event === desc;
    if (typeof desc === 'function') return this.handler === desc;
    if (typeof desc === 'object') return isSimilar(this, desc);
    return false;
  }

  /** Handles caught event (used as callback for low-level subscriptions) */
  protected handle(e: Event): void {
    if (this.canHandle(e)) this.handler.call(this.$host, e, this);
  }

  /** Checks if the passed event can be handled by the curren event listener */
  protected canHandle(e: Event): boolean {
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
    this.$targets.forEach((el: HTMLElement) => el.addEventListener(this.event, this.handle, this.capture));
    ESLEventListener.get(this.$host).push(this);
  }

  /** Unsubscribes event listener instance */
  public unsubscribe(): void {
    this.$targets.forEach((el: HTMLElement) => el.removeEventListener(this.event, this.handle, this.capture));
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
}

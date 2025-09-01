import {uniq} from '../../misc/array';
import {overrideEvent} from './misc';

/** Key to store listeners on the {@link SyntheticEventTarget} instance*/
const LISTENERS: unique symbol  = Symbol('_listeners'); // private

/**
 * Synthetic implementation of EventTarget
 * Replicates behavior of native event
 * Doesn't give explicit access to callback storage
 */
export class SyntheticEventTarget implements EventTarget {
  // Event type to use in the shortcut calls
  public static DEFAULT_EVENT = 'change';

  private readonly [LISTENERS]: Record<string, EventListenerOrEventListenerObject[]> = {};

  protected getEventListeners(): EventListenerOrEventListenerObject[];
  protected getEventListeners(type: string): EventListenerOrEventListenerObject[];
  protected getEventListeners(type?: string): EventListenerOrEventListenerObject[] {
    if (typeof type !== 'string') return uniq(Object.values(this[LISTENERS]).flat(1));
    return this[LISTENERS][type] || [];
  }

  public hasEventListener(type?: string): boolean {
    if (typeof type === 'string') return this.getEventListeners(type).length > 0;
    return this.hasEventListener((this.constructor as typeof SyntheticEventTarget).DEFAULT_EVENT);
  }

  public addEventListener(callback: EventListenerOrEventListenerObject): void;
  public addEventListener(type: string, callback: EventListenerOrEventListenerObject): void;
  public addEventListener(type: string | EventListenerOrEventListenerObject, callback?: EventListenerOrEventListenerObject): void {
    if (typeof type !== 'string') return this.addEventListener((this.constructor as typeof SyntheticEventTarget).DEFAULT_EVENT, type);

    validateEventListenerType(callback);
    const listeners = this[LISTENERS][type];
    if (listeners?.includes(callback!)) return;
    if (listeners) listeners.push(callback!);
    else Object.assign(this[LISTENERS], {[type]: [callback]});
  }

  public removeEventListener(callback: EventListenerOrEventListenerObject): void;
  public removeEventListener(type: string, callback: EventListenerOrEventListenerObject): void;
  public removeEventListener(type: string | EventListenerOrEventListenerObject, callback?: EventListenerOrEventListenerObject): void {
    if (typeof type !== 'string') return this.removeEventListener((this.constructor as typeof SyntheticEventTarget).DEFAULT_EVENT, type);

    validateEventListenerType(callback);
    const listeners = this[LISTENERS][type];
    if (!listeners) return;
    this[LISTENERS][type] = listeners.filter((cb) => cb !== callback);
  }

  public dispatchEvent(e: Event): boolean {
    overrideEvent(e, 'currentTarget', this);
    if (!e.target) overrideEvent(e, 'target', this);
    if (!e.srcElement) overrideEvent(e, 'srcElement', e.target);
    this.getEventListeners(e.type).forEach((listener) => {
      if (typeof listener === 'function') listener.call(this, e);
      else listener.handleEvent.call(listener, e);
    });
    return e.defaultPrevented;
  }
}

function validateEventListenerType(callback: any): void | never {
  if (!callback || typeof callback !== 'function' && typeof callback.handleEvent !== 'function') {
    throw Error('Callback should be a function or EventListenerObject');
  }
}

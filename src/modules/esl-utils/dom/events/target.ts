import {flat, uniq} from '../../misc/array';
import {overrideEvent} from './misc';

/** Key to store listeners on the {@link SyntheticEventTarget} instance*/
const LISTENERS: unique symbol  = (window.Symbol || String)('_listeners') as any;

/**
 * Synthetic implementation of EventTarget
 * Replicates behavior of native event
 * Doesn't give explicit access to callback storage
 */
export class SyntheticEventTarget implements EventTarget {
  // Event type to use in the shortcutted calls
  public static DEFAULT_EVENT = 'change';

  private readonly [LISTENERS]: Record<string, EventListenerOrEventListenerObject[]> = {};

  protected getEventListeners(): EventListenerOrEventListenerObject[];
  protected getEventListeners(type: string): EventListenerOrEventListenerObject[];
  protected getEventListeners(type?: string): EventListenerOrEventListenerObject[] {
    if (typeof type !== 'string') return uniq(flat(Object.values(this[LISTENERS])));
    return this[LISTENERS][type] || [];
  }

  public hasEventListener(): boolean;
  public hasEventListener(type: string): boolean;
  /** @deprecated alias for `addEventListener` */
  public hasEventListener(type: string | number): boolean;
  /** @deprecated alias for `addEventListener` */
  public hasEventListener(type: string, minCount: number): boolean;
  public hasEventListener(type: string | number = 'change', minCount: number = 0): boolean {
    if (typeof type !== 'string') return this.hasEventListener('change', type || 0); // TODO: remove in 5.0.0
    return this.getEventListeners(type).length > minCount;
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

  public dispatchEvent(e: Event): boolean;
  /** @deprecated use `overrideEvent` to declare `target` */
  public dispatchEvent(e: Event, target?: EventTarget): boolean;
  public dispatchEvent(e: Event, target?: EventTarget): boolean {
    overrideEvent(e, 'currentTarget', this);
    if (target) overrideEvent(e, 'target', target); // TODO: remove in 5.0.0
    if (!e.target) overrideEvent(e, 'target', this);
    if (!e.srcElement) overrideEvent(e, 'srcElement', e.target); // TODO: remove in 5.0.0
    this.getEventListeners(e.type).forEach((listener) => {
      if (typeof listener === 'function') listener.call(this, e);
      else listener.handleEvent.call(listener, e);
    });
    return e.defaultPrevented;
  }

  /** @deprecated alias for `addEventListener` */
  public addListener(cb: EventListener): void {
    this.addEventListener(cb);
  }
  /** @deprecated alias for `removeEventListener` */
  public removeListener(cb: EventListener): void {
    this.removeEventListener(cb);
  }
}

function validateEventListenerType(callback: any): void | never {
  if (!callback || typeof callback !== 'function' && typeof callback.handleEvent !== 'function') {
    throw Error('Callback should be a function or EventListenerObject');
  }
}

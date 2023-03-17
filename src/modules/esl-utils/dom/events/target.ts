import {overrideEvent} from './misc';

/**
 * Synthetic implementation of EventTarget
 * Replicates behavior of native event
 * Doesn't give explicit access to callback storage
 */
export class SyntheticEventTarget implements EventTarget {
  // Event type to use in the shortcutted calls
  public static DEFAULT_EVENT = 'change';

  private readonly _listeners: Record<string, EventListenerOrEventListenerObject[]> = {};

  public hasEventListener(): boolean;
  public hasEventListener(type: string | number): boolean;
  public hasEventListener(type: string, minCount: number): boolean;
  public hasEventListener(type: string | number = 'change', minCount: number = 0): boolean {
    if (typeof type !== 'string') return this.hasEventListener('change', type || 0);
    return this._listeners[type]?.length > minCount;
  }

  public addEventListener(callback: EventListenerOrEventListenerObject): void;
  public addEventListener(type: string, callback: EventListenerOrEventListenerObject): void;
  public addEventListener(type: string | EventListenerOrEventListenerObject, callback?: EventListenerOrEventListenerObject): void {
    if (typeof type !== 'string') return this.addEventListener((this.constructor as typeof SyntheticEventTarget).DEFAULT_EVENT, type);

    validateEventListenerType(callback);
    if (this._listeners[type] && this._listeners[type].includes(callback!)) return;
    if (this._listeners[type]) this._listeners[type].push(callback!);
    else Object.assign(this._listeners, {[type]: [callback]});
  }

  public removeEventListener(callback: EventListenerOrEventListenerObject): void;
  public removeEventListener(type: string, callback: EventListenerOrEventListenerObject): void;
  public removeEventListener(type: string | EventListenerOrEventListenerObject, callback?: EventListenerOrEventListenerObject): void {
    if (typeof type !== 'string') return this.removeEventListener((this.constructor as typeof SyntheticEventTarget).DEFAULT_EVENT, type);

    validateEventListenerType(callback);
    if (!this._listeners[type]) return;
    this._listeners[type] = this._listeners[type].filter((cb) => cb !== callback);
  }

  public dispatchEvent(e: Event): boolean;
  /** @deprecated use `overrideEvent` to declare `target` */
  public dispatchEvent(e: Event, target?: EventTarget): boolean;
  public dispatchEvent(e: Event, target?: EventTarget): boolean {
    overrideEvent(e, 'currentTarget', this);
    if (target) overrideEvent(e, 'target', target); // TODO: remove in 5.0.0
    if (!e.target) overrideEvent(e, 'target', this);
    if (!e.srcElement) overrideEvent(e, 'srcElement', e.target); // TODO: remove in 5.0.0
    this._listeners[e.type]?.forEach((listener) => {
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

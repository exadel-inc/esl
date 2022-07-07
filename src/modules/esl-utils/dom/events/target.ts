/**
 * Synthetic implementation of EventTarget
 * Uses a Set collection of listeners
 * Ignores event type
 */
export class SyntheticEventTarget implements EventTarget {
  protected readonly _listeners = new Set<EventListenerOrEventListenerObject>();

  public addEventListener(callback: EventListenerOrEventListenerObject): void;
  public addEventListener(type: 'change', callback: EventListenerOrEventListenerObject): void;
  public addEventListener(type: any, callback: EventListenerOrEventListenerObject = type): void {
    validateEventListenerType(callback);
    this._listeners.add(callback);
  }

  public removeEventListener(callback: EventListenerOrEventListenerObject): void;
  public removeEventListener(type: 'change', callback: EventListenerOrEventListenerObject): void;
  public removeEventListener(type: any, callback: EventListenerOrEventListenerObject = type): void {
    validateEventListenerType(callback);
    this._listeners.delete(callback);
  }

  public dispatchEvent(e: Event): boolean {
    const target = (): EventTarget => this; // use get due IE specific
    Object.defineProperty(e, 'target', {get: target, enumerable: true});
    Object.defineProperty(e, 'currentTarget', {get: target, enumerable: true});
    Object.defineProperty(e, 'srcElement', {get: target, enumerable: true});
    this._listeners.forEach((listener) => {
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

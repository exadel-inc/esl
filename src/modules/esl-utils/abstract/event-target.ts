/**
 * Synthetic implementation of EventTarget
 * Uses a Set collection of listeners
 * Ignores event type
 */
export class SyntheticEventTarget implements EventTarget {
  protected readonly _listeners = new Set<EventListener>();

  public addEventListener(callback: EventListener): void;
  public addEventListener(type: 'change', callback: EventListener): void;
  public addEventListener(type: any, callback: EventListener = type): void {
    if (typeof callback !== 'function') return;
    this._listeners.add(callback);
  }

  public removeEventListener(callback: EventListener): void;
  public removeEventListener(type: 'change', callback: EventListener): void;
  public removeEventListener(type: any, callback: EventListener = type): void {
    if (typeof callback !== 'function') return;
    this._listeners.delete(callback);
  }

  public dispatchEvent(e: Event): boolean {
    const target = (): EventTarget => this; // use get due IE specific
    Object.defineProperty(e, 'target', {get: target, enumerable: true});
    Object.defineProperty(e, 'currentTarget', {get: target, enumerable: true});
    Object.defineProperty(e, 'srcElement', {get: target, enumerable: true});
    this._listeners.forEach((listener) => listener.call(this, e));
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

/**
 * Synthetic implementation of EventTarget
 * Replicates behavior of native event
 * Doesn't give explicit access to callback storage
 */
export class SyntheticEventTarget implements EventTarget {
  // Event type to use in the shortcutted calls
  public static DEFAULT_EVENT = 'change';

  // @see https://github.com/Microsoft/TypeScript/issues/3841#issuecomment-337560146
  // eslint-disable-next-line @typescript-eslint/ban-types
  ['constructor']!: typeof SyntheticEventTarget & Function;

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
    if (typeof type !== 'string') return this.addEventListener(this.constructor.DEFAULT_EVENT, type);

    validateEventListenerType(callback);
    if (this._listeners[type] && this._listeners[type].includes(callback!)) return;
    if (this._listeners[type]) this._listeners[type].push(callback!);
    else Object.assign(this._listeners, {[type]: [callback]});
  }

  public removeEventListener(callback: EventListenerOrEventListenerObject): void;
  public removeEventListener(type: string, callback: EventListenerOrEventListenerObject): void;
  public removeEventListener(type: string | EventListenerOrEventListenerObject, callback?: EventListenerOrEventListenerObject): void {
    if (typeof type !== 'string') return this.removeEventListener(this.constructor.DEFAULT_EVENT, type);

    validateEventListenerType(callback);
    if (!this._listeners[type]) return;
    this._listeners[type] = this._listeners[type].filter((cb) => cb !== callback);
  }

  public dispatchEvent(e: Event, target: EventTarget = this): boolean {
    const targetDescriptor: PropertyDescriptor = {
      get: () => target,
      enumerable: true,
      configurable: true
    };
    Object.defineProperty(e, 'target', targetDescriptor);
    Object.defineProperty(e, 'currentTarget', targetDescriptor);
    Object.defineProperty(e, 'srcElement', targetDescriptor);

    this._listeners[e.type]?.forEach((listener) => {
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

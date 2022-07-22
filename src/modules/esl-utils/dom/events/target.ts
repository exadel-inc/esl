/**
 * Synthetic implementation of EventTarget
 * Replicates behavior of native event
 * Doesn't give explicit access to callback storage
 */

interface SyntheticTargetTypeListeners {
  [type: string]: EventListenerOrEventListenerObject[];
}

export class SyntheticEventTarget implements EventTarget {
  private readonly _listeners: SyntheticTargetTypeListeners = {};

  public hasEventListener(): boolean;
  public hasEventListener(type: string | number): boolean;
  public hasEventListener(type: string, minCount: number): boolean;
  public hasEventListener(type: string | number = 'change', minCount: number = 0): boolean {
    if (typeof type === 'number') {
      minCount = type;
      type = 'change';
    }
    return this._listeners[type]?.length > minCount;
  }

  public addEventListener(callback: EventListenerOrEventListenerObject): void;
  public addEventListener(type: string, callback: EventListenerOrEventListenerObject): void;
  public addEventListener(type: string | EventListenerOrEventListenerObject = 'change', callback?: EventListenerOrEventListenerObject): void {
    if (typeof type !== 'string') {
      callback = type;
      type = 'change';
    }

    validateEventListenerType(callback);
    const listeners = this._listeners[type];
    this.hasEventListener(type) ? listeners.push(callback!) : Object.assign(this._listeners, {[type]: [callback!]});
  }

  public removeEventListener(callback: EventListenerOrEventListenerObject): void;
  public removeEventListener(type: string, callback: EventListenerOrEventListenerObject): void;
  public removeEventListener(type: string | EventListenerOrEventListenerObject = 'change', callback?: EventListenerOrEventListenerObject): void {
    if (typeof type !== 'string') {
      callback = type;
      type = 'change';
    }

    validateEventListenerType(callback);
    const listeners = this._listeners[type];
    const cbIndex = listeners?.indexOf(callback!);
    if (cbIndex > -1) listeners.splice(cbIndex, 1);
  }

  public dispatchEvent(e: Event): boolean {
    const target = (): EventTarget => this; // use get due IE specific
    Object.defineProperty(e, 'target', {get: target, enumerable: true});
    Object.defineProperty(e, 'currentTarget', {get: target, enumerable: true});
    Object.defineProperty(e, 'srcElement', {get: target, enumerable: true});
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

export interface IMediaQueryCondition extends EventTarget {
  /** @returns true if current environment satisfies query */
  matches: boolean;

  /** @deprecated alias for `addEventListener` */
  addListener(cb: EventListener): void;
  /** Subscribes to media query state change. Shortcut for `addEventListener('change', callback)` */
  addEventListener(callback: EventListener): void;
  /** Subscribes to media query state change. Implements {@link EventTarget} interface */
  addEventListener(type: 'change', callback: EventListener): void;

  /** @deprecated alias for `removeEventListener` */
  removeListener(cb: EventListener): void;
  /** Unsubscribes from media query state change event. Shortcut for `removeEventListener('change', callback)` */
  removeEventListener(callback: EventListener): void;
  /** Unsubscribes from media query state change event. Implements {@link EventTarget} interface */
  removeEventListener(type: 'change', callback: EventListener): void;

  /** Optimize condition with nested hierarchy */
  optimize(): IMediaQueryCondition;
}

/** Custom event dispatched by {@link ESLMediaQuery} instances */
export class ESLMediaChangeEvent extends Event {
  /** `true` if the query is matched device conditions when event was dispatched */
  public readonly matches: boolean;
  public readonly target: IMediaQueryCondition;

  constructor(matches: boolean) {
    if (!window.Reflect) {
      // ES5 Target
      super('change');
      this.matches = matches;
    }
    // ES6 target
    const instance = Reflect.construct(Event, ['change'], ESLMediaChangeEvent.prototype.constructor);
    return Object.assign(instance, {matches});
  }

  /** Returns serialized value of the current {@link ESLMediaQuery} */
  public get media(): string {
    return String(this.target);
  }
}

export abstract class MediaQueryConditionBase implements IMediaQueryCondition {
  protected readonly _listeners = new Set<EventListener>();

  public abstract matches: boolean;
  public abstract optimize(): IMediaQueryCondition;

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
    Object.defineProperty(e, 'target', {value: this, enumerable: true});
    Object.defineProperty(e, 'currentTarget', {value: this, enumerable: true});
    Object.defineProperty(e, 'srcElement', {value: this, enumerable: true});
    this._listeners.forEach((listener) => listener.call(this, e));
    return e.defaultPrevented;
  }

  /** @deprecated alias for `addEventListener` */
  public addListener: (cb: EventListener) => void;
  /** @deprecated alias for `removeEventListener` */
  public removeListener: (cb: EventListener) => void;
}

// Legacy methods
MediaQueryConditionBase.prototype.addListener = MediaQueryConditionBase.prototype.addEventListener;
MediaQueryConditionBase.prototype.removeListener = MediaQueryConditionBase.prototype.removeEventListener;

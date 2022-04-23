export interface IMediaQueryCondition extends EventTarget {
  /** @returns true if current environment satisfies query */
  matches: boolean;

  /** @deprecated Use `addEventListener` instead */
  addListener(cb: EventListener): void;
  /** Subscribes to media query state change. Shortcut for `addEventListener('change', callback)` */
  addEventListener(callback: EventListener): void;
  /** Subscribes to media query state change. Implements {@link EventTarget} interface */
  addEventListener(type: 'change', callback: EventListener): void;

  /** @deprecated Use `removeEventListener` instead */
  removeListener(cb: EventListener): void;
  /** Unsubscribes from media query state change event. Shortcut for `removeEventListener('change', callback)` */
  removeEventListener(callback: EventListener): void;
  /** Unsubscribes from media query state change event. Implements {@link EventTarget} interface */
  removeEventListener(type: 'change', callback: EventListener): void;

  /** Optimize condition with nested hierarchy */
  optimize(): IMediaQueryCondition;
}

/**
 * Const media condition implementation
 * @author Alexey Stsefanovich (ala'n)
 *
 * Ignores listeners always return the same result.
 * Have only two instances: {@link ALL} and {@link NOT_ALL}
 */
class MediaQueryConstCondition implements IMediaQueryCondition {
  constructor(private readonly _matches: boolean) {}

  public get matches(): boolean {
    return this._matches;
  }

  public addListener(): void {}
  public addEventListener(): void {}

  public removeListener(): void {}
  public removeEventListener(): void {}

  public dispatchEvent(): boolean {
    return false;
  }

  public optimize(): IMediaQueryCondition {
    return this;
  }
  public toString(): string {
    return this._matches ? 'all' : 'not all';
  }

  /** Compare const media condition with the passed query instance or string */
  public eq(val: IMediaQueryCondition | string): boolean {
    return val.toString().trim() === this.toString();
  }
}

export const ALL = new MediaQueryConstCondition(true);
export const NOT_ALL = new MediaQueryConstCondition(false);

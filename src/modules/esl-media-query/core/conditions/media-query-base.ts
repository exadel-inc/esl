export interface IMediaQueryCondition {
  /** @returns true if current environment satisfies query */
  matches: boolean;
  /** Attach listener to wrapped media query list */
  addListener(cb: VoidFunction): void;
  /** Detach listener from wrapped media query list */
  removeListener(cb: VoidFunction): void;
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

  public get matches() {
    return this._matches;
  }

  public addListener(cb: VoidFunction) {}
  public removeListener(cb: VoidFunction) {}

  public optimize() { return this; }

  public toString() { return this._matches ? 'all' : 'not all'; }

  /** Compare const media condition with the passed query instance or string */
  public eq(val: IMediaQueryCondition | string): boolean {
    return val.toString().trim() === this.toString();
  }
}

export const ALL = new MediaQueryConstCondition(true);
export const NOT_ALL = new MediaQueryConstCondition(false);

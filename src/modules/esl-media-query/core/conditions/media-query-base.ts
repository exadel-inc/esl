export interface IMediaQueryCondition {
  /** @returns true if current environment satisfies query */
  matches: boolean;
  /** Attach listener to wrapped media query list */
  addListener(cb: () => void): void;
  /** Detach listener from wrapped media query list */
  removeListener(cb: () => void): void;
  /** Optimize condition with nested hierarchy */
  optimize: () => IMediaQueryCondition;
}

class MediaQueryConst implements IMediaQueryCondition {
  constructor(private readonly _matches: boolean) {}

  public get matches() {
    return this._matches;
  }

  public addListener(cb: () => void) {}
  public removeListener(cb: () => void) {}

  public optimize() { return this; }

  public toString() { return this._matches ? 'all' : 'not all'; }

  public eq(val: IMediaQueryCondition | string): boolean {
    return val.toString().trim() === this.toString();
  }
}

export const ALL = new MediaQueryConst(true);
export const NOT_ALL = new MediaQueryConst(false);

import type {IMediaQueryCondition} from './media-query-base';

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

  public addEventListener(): void {}

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

  /** Compares const media condition with the passed query instance or string */
  public eq(val: IMediaQueryCondition | string): boolean {
    return String(val).trim() === this.toString();
  }
}

export const ALL = new MediaQueryConstCondition(true);
export const NOT_ALL = new MediaQueryConstCondition(false);

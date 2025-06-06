import {SyntheticEventTarget} from '../../../esl-utils/dom/events/target';
import {ESLMediaChangeEvent} from './media-query-base';
import type {IMediaQueryCondition} from './media-query-base';

export class MediaQueryStaticCondition extends SyntheticEventTarget implements IMediaQueryCondition {
  private _matches: boolean;

  public constructor(
    public readonly name: string
  ) {
    super();
  }

  public get matches(): boolean {
    return this._matches;
  }
  public set matches(value: boolean) {
    const oldValue = this._matches;
    this._matches = value;
    if (oldValue !== value) {
      this.dispatchEvent(new ESLMediaChangeEvent(this._matches));
    }
  }

  public optimize(): IMediaQueryCondition {
    return this;
  }

  public override toString(): string {
    return `[${this.name} = ${this._matches}]`;
  }
}

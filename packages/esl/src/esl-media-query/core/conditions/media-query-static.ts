import {SyntheticEventTarget} from '../../../esl-utils/dom/events/target';
import {ESLMediaChangeEvent} from './media-query-base';
import {NOT_ALL} from './media-query-const';

import type {IMediaQueryCondition} from './media-query-base';

export class MediaQueryStaticCondition extends SyntheticEventTarget implements IMediaQueryCondition {
  protected _condition: IMediaQueryCondition = NOT_ALL;

  constructor(
    public readonly name: string
  ) {
    super();
    this._onChange = this._onChange.bind(this);
  }

  public get matches(): boolean {
    return this._condition.matches;
  }

  public get condition(): IMediaQueryCondition {
    return this._condition;
  }
  public set condition(value: IMediaQueryCondition) {
    const matched = this.matches;
    this._condition.removeEventListener('change', this._onChange);
    this._condition = value;
    this._condition.addEventListener('change', this._onChange);
    if (matched !== this.matches) this._onChange();
  }

  public optimize(): IMediaQueryCondition {
    return this;
  }

  public override toString(): string {
    return `[${this.name} = ${this._condition}]`;
  }

  private _onChange(): void {
    this.dispatchEvent(new ESLMediaChangeEvent(this.matches));
  }
}

import {ALL, NOT_ALL} from './media-query-const';

import type {IMediaQueryCondition} from './media-query-base';

export class MediaQueryNegation implements IMediaQueryCondition {
  constructor(
    protected readonly condition: IMediaQueryCondition
  ) {}

  public get matches(): boolean {
    return !this.condition.matches;
  }

  public optimize(): IMediaQueryCondition {
    if (ALL.eq(this.condition)) return NOT_ALL;
    if (NOT_ALL.eq(this.condition)) return ALL;
    if (this.condition instanceof MediaQueryNegation) {
      return this.condition.condition.optimize();
    }
    return this;
  }

  public toString(): string {
    const query = this.condition.toString();
    const complex = /\)[\s\w]+\(/.test(query);
    return (complex ? `not (${query})` : `not ${query}`).trim();
  }

  public addEventListener(callback: EventListener): void;
  public addEventListener(type: 'change', callback: EventListener): void;
  public addEventListener(...args: any[]): void {
    this.condition.addEventListener.apply(this.condition, args);
  }

  public removeEventListener(callback: EventListener): void;
  public removeEventListener(type: 'change', callback: EventListener): void;
  public removeEventListener(...args: any[]): void {
    this.condition.removeEventListener.apply(this.condition, args);
  }

  public dispatchEvent(event: Event): boolean {
    return this.condition.dispatchEvent(event);
  }
}

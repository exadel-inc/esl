import {ALL, NOT_ALL} from './media-query-const';

import type {ESLMediaChangeEvent, IMediaQueryCondition, MediaQueryListenerArgs} from './media-query-base';

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
  public addEventListener(...args: MediaQueryListenerArgs): void {
    (this.condition.addEventListener as (...args: MediaQueryListenerArgs) => void)(...args);
  }

  public removeEventListener(callback: EventListener): void;
  public removeEventListener(type: 'change', callback: EventListener): void;
  public removeEventListener(...args: MediaQueryListenerArgs): void {
    (this.condition.removeEventListener as (...args: MediaQueryListenerArgs) => void)(...args);
  }

  public dispatchEvent(event: ESLMediaChangeEvent): boolean {
    return this.condition.dispatchEvent(event);
  }
}

import {Observable} from '../../../esl-utils/abstract/observable';
import {ALL, NOT_ALL} from './media-query-base';

import type {IMediaQueryCondition} from './media-query-base';

/**
 * Abstract multiple media conditions container
 * @author Alexey Stsefanovich (ala'n)
 *
 * Observe all child items. Dispatch changes when the whole condition result is changed
 */
class MediaQueryContainer extends Observable<(matches: boolean) => void> implements IMediaQueryCondition {
  private _matches: boolean;

  constructor(protected readonly items: IMediaQueryCondition[] = []) {
    super();
    this._matches = this.matches;
    this._onChildChange = this._onChildChange.bind(this);
  }

  public addListener(listener: (matches: boolean) => void): void {
    super.addListener(listener);
    if (this._listeners.size > 1) return;
    this.items.forEach((item) => item.addListener(this._onChildChange));
  }
  public removeListener(listener: (matches: boolean) => void): void {
    super.removeListener(listener);
    if (this._listeners.size) return;
    this.items.forEach((item) => item.removeListener(this._onChildChange));
  }

  public get matches(): boolean {
    return false;
  }

  /** Exclude const conditions. Unwrap empty or trivial (with one item) containers */
  public optimize(): IMediaQueryCondition {
    return this;
  }

  /** Handle query change and dispatch it on top level in case result value is changed */
  protected _onChildChange(): void {
    const {matches} = this;
    if (this._matches ===  matches) return;
    this.fire(this._matches = matches);
  }
}

/** Conjunction (AND) group of media conditions */
export class MediaQueryConjunction extends MediaQueryContainer {
  public get matches(): boolean {
    return this.items.every((item) => item.matches);
  }

  public optimize(): IMediaQueryCondition {
    const optimizedItems = this.items.map((item) => item.optimize());
    if (optimizedItems.some((item) => NOT_ALL.eq(item))) return NOT_ALL;
    const items = optimizedItems.filter((item) => !ALL.eq(item));
    if (items.length === 0) return ALL;
    if (items.length === 1) return items[0];
    return new MediaQueryConjunction(items);
  }

  public toString(): string {
    return this.items.join(' and ');
  }
}

/** Disjunction (OR) group of media conditions */
export class MediaQueryDisjunction extends MediaQueryContainer {
  public get matches(): boolean {
    return this.items.some((item) => item.matches);
  }

  public optimize(): IMediaQueryCondition {
    const optimizedItems = this.items.map((item) => item.optimize());
    if (optimizedItems.some((item) => ALL.eq(item))) return ALL;
    const items = optimizedItems.filter((item) => !NOT_ALL.eq(item));
    if (items.length === 0) return NOT_ALL;
    if (items.length === 1) return items[0];
    return new MediaQueryDisjunction(items);
  }

  public toString(pretty = false): string {
    return this.items.join(pretty ? ' or ' : ', ');
  }
}

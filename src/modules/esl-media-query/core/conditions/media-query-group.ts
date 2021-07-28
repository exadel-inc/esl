import {ALL, NOT_ALL} from './media-query-base';
import type {IMediaQueryCondition} from './media-query-base';

// TODO: observer :(
export class MediaQueryGroup implements IMediaQueryCondition {
  private _matches: boolean;
  private _listeners = new Set<(match: boolean) => void>();

  constructor(protected readonly items: IMediaQueryCondition[] = []) {
    this._matches = this.matches;
    this._onChildChange = this._onChildChange.bind(this);
  }

  protected _onChildChange() {
    const {matches} = this;
    if (this._matches ===  matches) return;
    this._matches = matches;
    this._listeners.forEach((cb) => cb.call(this, matches, this));
  }

  public addListener(listener: (match: boolean) => void) {
    this._listeners.add(listener);
    if (this._listeners.size > 1) return;
    this.items.forEach((item) => item.addListener(this._onChildChange));
  }
  public removeListener(listener: (match: boolean) => void) {
    this._listeners.delete(listener);
    if (this._listeners.size) return;
    this.items.forEach((item) => item.removeListener(this._onChildChange));
  }

  public get matches() { return false; }
  public optimize(): IMediaQueryCondition { return this; }
}

/** Conjunction(AND) group of media conditions */
export class MediaQueryConjunction extends MediaQueryGroup{
  public get matches() {
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

  public toString() {
    return this.items.join(' and ');
  }
}

/** Disjunction(OR) group of media conditions */
export class MediaQueryDisjunction extends MediaQueryGroup{
  public get matches() {
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

  public toString(pretty = false) {
    return this.items.join(pretty ? ' or ' : ', ');
  }
}

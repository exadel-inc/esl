import {ALL, NOT_ALL} from './media-query-base';
import type {IMediaQueryCondition} from './media-query-base';

/**
 * Abstract multiple media conditions container
 * @author Alexey Stsefanovich (ala'n)
 *
 * Observe all child items. Dispatch changes when the whole condition result is changed
 */
class MediaQueryContainer implements IMediaQueryCondition {
  protected _matches: boolean;
  protected readonly _listeners = new Set<EventListener>();

  constructor(protected readonly items: IMediaQueryCondition[] = []) {
    this._matches = this.matches;
    this._onChildChange = this._onChildChange.bind(this);
  }

  public addListener(cb: EventListener): void {
    this.addEventListener('change', cb);
  }
  public addEventListener(callback: EventListener): void;
  public addEventListener(type: 'change', callback: EventListener): void;
  public addEventListener(type: any, callback: EventListener = type): void {
    if (typeof callback !== 'function') return;
    this._listeners.add(callback);
    if (this._listeners.size > 1) return;
    this.items.forEach((item) => item.addEventListener('change', this._onChildChange));
  }

  public removeListener(cb: EventListener): void {
    this.removeEventListener(cb);
  }
  public removeEventListener(callback: EventListener): void;
  public removeEventListener(type: 'change', callback: EventListener): void;
  public removeEventListener(type: any, callback: EventListener = type): void {
    if (typeof callback !== 'function') return;
    this._listeners.delete(callback);
    if (this._listeners.size) return;
    this.items.forEach((item) => item.removeEventListener('change', this._onChildChange));
  }

  public dispatchEvent(e: Event): boolean {
    this._listeners.forEach((listener) => listener.call(this, e));
    return false;
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
    this._matches = matches;
    const event: Event = Object.assign(new Event('change'), {matches});
    Object.defineProperty(event, 'media', {get: () => String(this)});
    this.dispatchEvent(event);
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

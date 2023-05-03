import {SyntheticEventTarget} from '../../../esl-utils/dom/events';
import {ESLMediaChangeEvent} from './media-query-base';
import {ALL, NOT_ALL} from './media-query-const';

import type {IMediaQueryCondition} from './media-query-base';

/**
 * Abstract multiple media conditions container
 * @author Alexey Stsefanovich (ala'n)
 *
 * Observe all child items. Dispatch changes when the whole condition result is changed
 */
abstract class MediaQueryContainer extends SyntheticEventTarget implements IMediaQueryCondition {
  protected _matches: boolean;

  constructor(protected readonly items: IMediaQueryCondition[] = []) {
    super();
    this._matches = this.matches;
    this._onChange = this._onChange.bind(this);
  }

  public override addEventListener(callback: EventListener): void;
  public override addEventListener(type: 'change', callback: EventListener): void;
  public override addEventListener(type: any, callback: EventListener = type): void {
    super.addEventListener(type, callback);
    if (this.getEventListeners('change').length > 1) return;
    this.items.forEach((item) => item.addEventListener('change', this._onChange));
  }

  public override removeEventListener(callback: EventListener): void;
  public override removeEventListener(type: 'change', callback: EventListener): void;
  public override removeEventListener(type: any, callback: EventListener = type): void {
    super.removeEventListener(type, callback);
    if (this.hasEventListener()) return;
    this.items.forEach((item) => item.removeEventListener('change', this._onChange));
  }

  public optimize(): IMediaQueryCondition {
    return this;
  }
  public get matches(): boolean {
    return false;
  }

  /** Handles query change and dispatches it on top level in case result value is changed */
  protected _onChange(): void {
    const {matches} = this;
    if (this._matches ===  matches) return;
    this.dispatchEvent(new ESLMediaChangeEvent(this._matches = matches));
  }
}

/** Conjunction (AND) group of media conditions */
export class MediaQueryConjunction extends MediaQueryContainer {
  public override get matches(): boolean {
    return this.items.every((item) => item.matches);
  }

  public override optimize(): IMediaQueryCondition {
    const optimizedItems = this.items.map((item) => item.optimize());
    if (optimizedItems.some((item) => NOT_ALL.eq(item))) return NOT_ALL;
    const items = optimizedItems.filter((item) => !ALL.eq(item));
    if (items.length === 0) return ALL;
    if (items.length === 1) return items[0];
    return new MediaQueryConjunction(items);
  }

  public override toString(): string {
    return this.items.join(' and ');
  }
}

/** Disjunction (OR) group of media conditions */
export class MediaQueryDisjunction extends MediaQueryContainer {
  public override get matches(): boolean {
    return this.items.some((item) => item.matches);
  }

  public override optimize(): IMediaQueryCondition {
    const optimizedItems = this.items.map((item) => item.optimize());
    if (optimizedItems.some((item) => ALL.eq(item))) return ALL;
    const items = optimizedItems.filter((item) => !NOT_ALL.eq(item));
    if (items.length === 0) return NOT_ALL;
    if (items.length === 1) return items[0];
    return new MediaQueryDisjunction(items);
  }

  public override toString(pretty = false): string {
    return this.items.join(pretty ? ' or ' : ', ');
  }
}

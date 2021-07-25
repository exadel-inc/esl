import {ALL, NOT_ALL} from './esl-mq-base';
import type {IESLMQCondition} from './esl-mq-base';

export class ESLMQGroup implements IESLMQCondition {
  private _matches: boolean;
  private _listeners = new Set<(match: boolean) => void>();

  constructor(protected readonly items: IESLMQCondition[] = []) {
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
  public optimize(): IESLMQCondition { return this; }
}

/** Conjunction(AND) group of media conditions */
export class ESLMQConjunction extends ESLMQGroup{
  public get matches() {
    return this.items.every((item) => item.matches);
  }

  public optimize(): IESLMQCondition {
    const optimizedItems = this.items.map((item) => item.optimize());
    if (optimizedItems.some((item) => NOT_ALL.eq(item))) return NOT_ALL;
    const items = optimizedItems.filter((item) => !ALL.eq(item));
    if (items.length === 0) return ALL;
    if (items.length === 1) return items[0];
    return new ESLMQConjunction(items);
  }

  public toString() {
    return this.items.join(' and ');
  }
}

/** Disjunction(OR) group of media conditions */
export class ESLMQDisjunction extends ESLMQGroup{
  public get matches() {
    return this.items.some((item) => item.matches);
  }

  public optimize(): IESLMQCondition {
    const optimizedItems = this.items.map((item) => item.optimize());
    if (optimizedItems.some((item) => ALL.eq(item))) return ALL;
    const items = optimizedItems.filter((item) => !NOT_ALL.eq(item));
    if (items.length === 0) return NOT_ALL;
    if (items.length === 1) return items[0];
    return new ESLMQDisjunction(items);
  }

  public toString(pretty = false) {
    return this.items.join(pretty ? ' or ' : ', ');
  }
}

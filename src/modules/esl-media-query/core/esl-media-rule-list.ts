import {ExportNs} from '../../esl-utils/environment/export-ns';
import {evaluate} from '../../esl-utils/misc/format';
import {deepMerge, isEqual} from '../../esl-utils/misc/object';
import {SyntheticEventTarget} from '../../esl-utils/dom/events';
import {ESLMediaRule} from './esl-media-rule';

import type {RulePayloadParser} from './esl-media-rule';

/** Custom event dispatched by {@link ESLMediaRuleList} instances */
export class ESLMediaRuleListEvent<T = any> extends Event {
  /** Current value of target {@link ESLMediaRuleList} instances */
  public readonly current: T;
  /** Previous value of target {@link ESLMediaRuleList} instances */
  public readonly previous: T;
  /** Target {@link ESLMediaRuleList} instances */
  public override readonly target: ESLMediaRuleList<T>;

  constructor(current: T, previous: T) {
    super('change');
    Object.assign(this, {current, previous});
  }
}

/**
 * ESLMediaRuleList - {@link ESLMediaRule} observable collection
 * @author Yuliya Adamskaya, Alexey Stsefanovich (ala'n)
 *
 * Represents observable object that wraps environment to value mapping
 */
@ExportNs('MediaRuleList')
export class ESLMediaRuleList<T = any> extends SyntheticEventTarget {
  /** String value parser (default) */
  public static STRING_PARSER: RulePayloadParser<string> = String;
  /** Object value parser. Uses {@link evaluate} to parse value */
  public static OBJECT_PARSER = <U = any>(val: string): U | undefined => evaluate(val);

  /**
   * @deprecated Method will be reintroduced in v5.0.0 with a different signature. For now use ESLMediaRuleList.parseQuery instead
   *
   * Creates `ESLMediaRuleList` from string query representation
   * Expect serialized {@link ESLMediaRule}s separated by '|'
   * Uses exact strings as rule list values
   *
   * @param query - query string
   */
  public static parse(query: string): ESLMediaRuleList<string>;
  /**
   * @deprecated Method will be reintroduced in v5.0.0 with a different signature. For now use ESLMediaRuleList.parseQuery instead
   *
   * Creates `ESLMediaRuleList` from string query representation.
   * Expect serialized {@link ESLMediaRule}s separated by '|'
   *
   * @param query - query string
   * @param parser - value parser function
   */
  public static parse<U>(query: string, parser: RulePayloadParser<U>): ESLMediaRuleList<U>;
  /**
   * @deprecated Method will be reintroduced in v5.0.0 with a different signature. For now use ESLMediaRuleList.parseTuple instead

   * Creates `ESLMediaRuleList` from two strings with conditions and values sequences
   *
   * @param mask - media conditions tuple string (uses '|' as separator)
   * @param values - values tuple string (uses '|' as separator)
   *
   * @example
   * ```ts
   * ESLMediaRuleList.parse('@XS|@SM|@MD|@LG|@XL', '1|2|3|4|5')
   * ```
   */
  public static parse(mask: string, values: string): ESLMediaRuleList<string>;
  /**
   * @deprecated Method will be reintroduced in v5.0.0 with a different signature. For now use ESLMediaRuleList.parseTuple instead
   *
   * Creates `ESLMediaRuleList` from two strings with conditions and values sequences
   *
   * @param mask - media conditions tuple string (uses '|' as separator)
   * @param values - values tuple string (uses '|' as separator)
   * @param parser - value parser function
   *
   * @example
   * ```ts
   * ESLMediaRuleList.parseTuple('@XS|@SM|@MD|@LG|@XL', '1|2|3|4|5', Number)
   * ```
   */
  public static parse<U>(mask: string, values: string, parser: RulePayloadParser<U>): ESLMediaRuleList<U>;
  public static parse(query: string, ...common: (string | RulePayloadParser<any>)[]): ESLMediaRuleList {
    const parser: RulePayloadParser<any> = typeof common[common.length - 1] === 'function' ? common.pop() as any : String;
    const value = common.pop();
    return typeof value === 'string' ?
      ESLMediaRuleList.parseTuple(query, value, parser) :
      ESLMediaRuleList.parseQuery(query, parser);
  }

  /**
   * Creates `ESLMediaRuleList` from string query representation
   * Uses exact strings as rule list values
   * @param query - query string
   */
  public static parseQuery(query: string): ESLMediaRuleList<string>;
  /**
   * Creates `ESLMediaRuleList` from string query representation
   * @param query - query string
   * @param parser - value parser function
   */
  public static parseQuery<U>(query: string, parser: RulePayloadParser<U>): ESLMediaRuleList<U>;
  public static parseQuery(query: string, parser: RulePayloadParser<any> = String): ESLMediaRuleList {
    const rules = query.split('|')
      .map((lex: string) => ESLMediaRule.parse(lex, parser))
      .filter((rule: ESLMediaRule) => !!rule) as ESLMediaRule[];
    return new ESLMediaRuleList(rules);
  }

  /**
   * Creates `ESLMediaRuleList` from two strings with conditions and values sequences
   *
   * @param mask - media conditions tuple string (uses '|' as separator)
   * @param values - values tuple string (uses '|' as separator)
   *
   * @example
   * ```ts
   * ESLMediaRuleList.parseTuple('@XS|@SM|@MD|@LG|@XL', '1|2|3|4|5')
   * ```
   */
  public static parseTuple(mask: string, values: string): ESLMediaRuleList<string>;
  /**
   * Creates `ESLMediaRuleList` from two strings with conditions and values sequences
   *
   * @param mask - media conditions tuple string (uses '|' as separator)
   * @param values - values tuple string (uses '|' as separator)
   * @param parser - value parser function
   *
   * @example
   * ```ts
   * ESLMediaRuleList.parseTuple(@XS|@SM|@MD|@LG|@XL', '1|2|3|4|5', Number)
   * ```
   */
  public static parseTuple<U>(mask: string, values: string, parser: RulePayloadParser<U>): ESLMediaRuleList<U>;
  public static parseTuple(mask: string, values: string, parser: RulePayloadParser<any> = String): ESLMediaRuleList {
    const queries = mask.split('|');
    const valueList = values.split('|');
    while (valueList.length < queries.length && valueList.length !== 0) valueList.push(valueList[valueList.length - 1]);
    if (valueList.length !== queries.length) throw Error('Value doesn\'t correspond to mask');
    const rules: (ESLMediaRule | undefined)[] = queries.map((query, i) => ESLMediaRule.create(valueList[i], query, parser));
    const validRules = rules.filter((rule) => !!rule) as ESLMediaRule[];
    return new ESLMediaRuleList(validRules);
  }

  protected _value: T | undefined;
  protected readonly _rules: ESLMediaRule<T>[];

  private constructor(rules: ESLMediaRule<T>[]) {
    super();
    this._rules = rules;
    this._onMatchChanged = this._onMatchChanged.bind(this);
  }

  /** Subscribes to the instance active rule change */
  public override addEventListener(callback: EventListener): void;
  public override addEventListener(type: 'change', callback: EventListener): void;
  public override addEventListener(type: any, callback: EventListener = type): void {
    super.addEventListener(type, callback);
    if (this.getEventListeners('change').length > 1) return;
    this._value = this.computedValue;
    this.rules.forEach((rule) => rule.addEventListener(this._onMatchChanged));
  }

  /** Unsubscribes from the instance active rule change */
  public override removeEventListener(callback: EventListener): void;
  public override removeEventListener(type: 'change', callback: EventListener): void;
  public override removeEventListener(type: any, callback: EventListener = type): void {
    super.removeEventListener(type, callback);
    if (this.hasEventListener()) return;
    delete this._value;
    this.rules.forEach((rule) => rule.removeEventListener(this._onMatchChanged));
  }

  /** Array of {@link ESLMediaRule}s that forms the current {@link ESLMediaRuleList} */
  public get rules(): ESLMediaRule<T>[] {
    return this._rules;
  }

  /** All active {@link ESLMediaRule}s */
  public get active(): ESLMediaRule<T>[] {
    return this.rules.filter((rule) => rule.matches);
  }
  /** Value of the last of active rules */
  public get activeValue(): T | undefined {
    return this.active.pop()?.payload;
  }
  /** All active rule values */
  public get activeValues(): T[] {
    return this.active.map((rule) => rule.payload);
  }

  /**
   * Current value of {@link ESLMediaRuleList} object
   * Uses cache if current object is under observation
   */
  public get value(): T | undefined {
    if (!this.hasEventListener()) return this.computedValue;
    return Object.hasOwnProperty.call(this, '_value') ? this._value : this.computedValue;
  }
  /** Always computed value of the current {@link ESLMediaRuleList} object */
  public get computedValue(): T | undefined {
    return deepMerge(undefined, ...this.activeValues);
  }

  /** Handles inner rules state change */
  private _onMatchChanged(): void {
    const curValue = this.value;
    const newValue = this.computedValue;
    if (isEqual(curValue, newValue)) return;
    this._value = newValue;
    this.dispatchEvent(new ESLMediaRuleListEvent(newValue, curValue));
  }

  /** @returns serialized {@link ESLMediaRuleList} object representation*/
  public override toString(): string {
    return this.rules.join('|');
  }
}

declare global {
  export interface ESLLibrary {
    MediaRuleList: typeof ESLMediaRuleList;
  }
}

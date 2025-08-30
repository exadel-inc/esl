import {ExportNs} from '../../esl-utils/environment/export-ns';
import {evaluate} from '../../esl-utils/misc/format';
import {deepMerge, isEqual} from '../../esl-utils/misc/object';
import {SyntheticEventTarget} from '../../esl-utils/dom/events';
import {ESLMediaRule} from './esl-media-rule';

import type {RulePayloadParser} from './esl-media-rule';

/** Custom event dispatched by {@link ESLMediaRuleList} instances */
export class ESLMediaRuleListEvent<T = any> extends Event {
  public static readonly TYPE = 'change';

  public override readonly type: typeof ESLMediaRuleListEvent.TYPE;

  /** Current value of target {@link ESLMediaRuleList} instances */
  public readonly current: T;
  /** Previous value of target {@link ESLMediaRuleList} instances */
  public readonly previous: T;
  /** Target {@link ESLMediaRuleList} instances */
  public override readonly target: ESLMediaRuleList<T>;

  constructor(current: T, previous: T) {
    super(ESLMediaRuleListEvent.TYPE);
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

  /** Empty {@link ESLMediaRuleList} instance */
  public static readonly EMPTY: ESLMediaRuleList<never> = new ESLMediaRuleList([]);

  /** @returns empty {@link ESLMediaRuleList} instance */
  public static empty<U>(): ESLMediaRuleList<U> {
    return ESLMediaRuleList.EMPTY as ESLMediaRuleList<U>;
  }

  /**
   * Creates {@link ESLMediaRuleList} from string query representation
   * Expect serialized {@link ESLMediaRule}s separated by '|'
   *
   * @throws TypeError if value is an invalid query string
   *
   * @param query - query ("arrow" syntax) string
   */
  public static parse(query: string): ESLMediaRuleList<string>;
  /**
   * Creates {@link ESLMediaRuleList} from string query representation.
   * Expect serialized {@link ESLMediaRule}s separated by '|'
   *
   * @param query - query string
   * @param parser - value parser function
   *
   * @throws TypeError if value is an invalid query string
   */
  public static parse<U>(query: string, parser: RulePayloadParser<U>): ESLMediaRuleList<U>;
  /**
   * Creates {@link ESLMediaRuleList} from the value string with automatic syntax detection.
   * Note: single value considered as query string and a single `all => value` rule will be created.
   * Use explicit tuple syntax {@link parseTuple} to create single rule with media condition.
   *
   * @param query - media rule query ('arrow' syntax) string or tuple string of values (uses '|' as separator)
   * @param mask - media conditions tuple string (uses '|' as separator), to be used in case of tuple syntax
   *
   * @throws TypeError if value is an invalid query string
   *
   * @example
   * ```ts
   * ESLMediaRuleList.parse('1|2|3|4|5', '@XS|@SM|@MD|@LG|@XL') // @xs => '1' | @sm => '2' | @md => '3' | @lg => '4' | @xl => '5'
   * ESLMediaRuleList.parse('1 | @XS => 2', '@XS|@SM|@MD|@LG|@XL') // all => '1' | @xs => '2' (second argument is ignored)
   * ```
   */
  public static parse(query: string, mask: string): ESLMediaRuleList<string>;
  /**
   * Creates {@link ESLMediaRuleList} from the value string with automatic syntax detection.
   * Note: single value considered as query string and a single `all => value` rule will be created.
   * Use explicit tuple syntax {@link parseTuple} to create single rule with media condition.
   *
   * @param query - media rule query ('arrow' syntax) string or tuple string of values (uses '|' as separator)
   * @param mask - media conditions tuple string (uses '|' as separator), to be used in case of tuple syntax
   * @param parser - value parser function
   *
   * @throws TypeError if value is an invalid query string
   *
   * @example
   * ```ts
   * ESLMediaRuleList.parse('1|2|3|4|5', '@XS|@SM|@MD|@LG|@XL', parseInt) // @xs => 1 | @sm => 2 | @md => 3 | @lg => 4 | @xl => 5
   * ESLMediaRuleList.parse('1 | @XS => 2', '@XS|@SM|@MD|@LG|@XL', parseInt) // all => 1 | @xs => 2 (second argument is ignored)
   * ```
   */
  public static parse<U>(query: string, mask: string, parser: RulePayloadParser<U>): ESLMediaRuleList<U>;
  public static parse(query: string, ...common: (string | RulePayloadParser<any>)[]): ESLMediaRuleList {
    const parser: RulePayloadParser<any> = typeof common[common.length - 1] === 'function' ? common.pop() as any : String;
    const mask = common.pop();
    if (typeof mask !== 'string' || query.includes('=>') || !query.includes('|')) {
      return ESLMediaRuleList.parseQuery(query, parser);
    }
    return ESLMediaRuleList.parseTuple(mask, query, parser);
  }

  /**
   * Creates {@link ESLMediaRuleList} from string query representation
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
   * Creates {@link ESLMediaRuleList} from two strings with conditions and values sequences
   *
   * @param mask - media conditions tuple string (uses '|' as separator)
   * @param values - values tuple string (uses '|' as separator)
   *
   * @throws TypeError if values count doesn't correspond to the mask conditions count
   *
   * @example
   * ```ts
   * ESLMediaRuleList.parseTuple('@XS|@SM|@MD|@LG|@XL', '1|2|3|4|5')
   * ```
   */
  public static parseTuple(mask: string, values: string): ESLMediaRuleList<string>;
  /**
   * Creates {@link ESLMediaRuleList} from two strings with conditions and values sequences
   *
   * @param mask - media conditions tuple string (uses '|' as separator)
   * @param values - values tuple string (uses '|' as separator)
   * @param parser - value parser function
   *
   * @throws TypeError if values count doesn't correspond to the mask conditions count
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
    if (valueList.length !== queries.length) throw new TypeError(`tuple "${values}" doesn't correspond to mask "${mask}"`);
    const rules: (ESLMediaRule | undefined)[] = queries.map((query, i) => ESLMediaRule.create(valueList[i], query, parser));
    const validRules = rules.filter((rule) => !!rule);
    return new ESLMediaRuleList(validRules);
  }

  protected _value: T | undefined;
  protected readonly _rules: readonly ESLMediaRule<T>[];

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
  public get rules(): readonly ESLMediaRule<T>[] {
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
    return this.rules.join(' | ');
  }
}

declare global {
  export interface ESLLibrary {
    MediaRuleList: typeof ESLMediaRuleList;
  }
}

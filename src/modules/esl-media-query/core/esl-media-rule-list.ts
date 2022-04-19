import {ExportNs} from '../../esl-utils/environment/export-ns';
import {Observable} from '../../esl-utils/abstract/observable';
import {evaluate} from '../../esl-utils/misc/format';
import {isPrimitive} from '../../esl-utils/misc/object';
import {ESLMediaRule} from './esl-media-rule';

import type {RulePayloadParser} from './esl-media-rule';

export type RuleChangedCallback<T> = (rule: ESLMediaRule<T | undefined>, list: ESLMediaRuleList<T>) => void;

/**
 * ESLMediaRuleList - {@link ESLMediaRule} observable collection
 * @author Yuliya Adamskaya
 *
 * Represents observable object that wraps environment to value mapping
 */
@ExportNs('MediaRuleList')
export class ESLMediaRuleList<T = any> extends Observable<RuleChangedCallback<T>> {
  /** String value parser (default) */
  public static STRING_PARSER: RulePayloadParser<string> = String;
  /** Object value parser. Uses {@link evaluate} to parse value */
  public static OBJECT_PARSER = <U = any>(val: string): U | undefined => evaluate(val);

  /**
   * Creates `ESLMediaRuleList` from string query representation
   * Uses exact strings as rule list values
   * @param query - query string
   */
  public static parse(query: string): ESLMediaRuleList<string>;
  /**
   * Creates `ESLMediaRuleList` from string query representation
   * @param query - query string
   * @param parser - value parser function
   */
  public static parse<U>(query: string, parser: RulePayloadParser<U>): ESLMediaRuleList<U>;
  public static parse(query: string, parser: RulePayloadParser<any> = String): ESLMediaRuleList {
    const rules: ESLMediaRule[] = [];
    query.split('|').forEach((lex: string) => {
      const rule = ESLMediaRule.parse(lex, parser);
      if (!rule) return;
      rule.default ? rules.unshift(rule) : rules.push(rule);
    });
    return new ESLMediaRuleList(rules);
  }

  /**
   * Creates `ESLMediaRuleList` from two strings with a value  and conditions tuple
   *
   * @param values - values tuple string (uses '|' as separator)
   * @param mask - media conditions tuple string (uses '|' as separator)
   *
   * @example
   * ```ts
   * ESLMediaRuleList.parseTuple('1|2|3|4|5', '@XS|@SM|@MD|@LG|@XL')
   * ```
   */
  public static parseTuple(values: string, mask: string): ESLMediaRuleList<string>;
  /**
   * Creates `ESLMediaRuleList` from two strings with a value  and conditions tuple
   *
   * @param values - values tuple string (uses '|' as separator)
   * @param mask - media conditions tuple string (uses '|' as separator)
   * @param parser - value parser function
   *
   * @example
   * ```ts
   * ESLMediaRuleList.parseTuple('1|2|3|4|5', '@XS|@SM|@MD|@LG|@XL', Number)
   * ```
   */
  public static parseTuple<U>(values: string, mask: string, parser: RulePayloadParser<U>): ESLMediaRuleList<U>;
  public static parseTuple(values: string, mask: string, parser: RulePayloadParser<any> = String): ESLMediaRuleList {
    const valueList = values.split('|');
    const conditions = mask.split('|');
    if (valueList.length !== conditions.length) throw new Error('Value doesn\'t correspond to mask');
    const rules: (ESLMediaRule | undefined)[] = conditions.map((query, i) => ESLMediaRule.create(valueList[i], query, parser));
    const validRules = rules.filter((rule) => !!rule) as ESLMediaRule[];
    return new ESLMediaRuleList(validRules);
  }

  private readonly _rules: ESLMediaRule<T>[];
  private readonly _default: ESLMediaRule<T | undefined> | undefined;
  private _active: ESLMediaRule<T | undefined>;

  private constructor(rules: ESLMediaRule<T>[]) {
    super();
    this._rules = rules;
    this._default = rules.filter((rule) => rule.default)[0];
    this._onMatchChanged = this._onMatchChanged.bind(this);
  }

  /** Subscribes to the instance active rule change */
  public addListener(listener: RuleChangedCallback<T>): void {
    super.addListener(listener);
    if (this._listeners.size > 1) return;
    this._rules.forEach((rule) => rule.addListener(this._onMatchChanged));
  }

  /** Unsubscribes from the instance active rule change */
  public removeListener(listener: RuleChangedCallback<T>): void {
    super.removeListener(listener);
    if (this._listeners.size) return;
    this._rules.forEach((rule) => rule.removeListener(this._onMatchChanged));
  }

  /** Array of {@link ESLMediaRule}s that forms the current {@link ESLMediaRuleList} */
  public get rules(): ESLMediaRule<T>[] {
    return this._rules;
  }

  /** Cached active {@link ESLMediaRule} */
  public get active(): ESLMediaRule<T | undefined> {
    if (!this._active || !this._listeners.size) {
      this._active = this.activeRule;
    }
    return this._active;
  }

  /** The last active rule in the list */
  public get activeRule(): ESLMediaRule<T | undefined> {
    const satisfiedRules = this.rules.filter((rule) => rule.matches);
    return satisfiedRules.length > 0 ? satisfiedRules[satisfiedRules.length - 1] : ESLMediaRule.empty();
  }

  /** Active rule payload value */
  public get activeValue(): T | undefined {
    const value = this.active.payload;
    if (isPrimitive(value) || !this.default || isPrimitive(this.default.payload)) return value;
    return Object.assign({}, this.default.payload || {}, value);
  }

  /** {@link ESLMediaRule} that is used as a default rule */
  public get default(): ESLMediaRule<T | undefined> | undefined {
    return this._default;
  }

  /** Handles inner rules state change */
  private _onMatchChanged(): void {
    const rule = this.activeRule;
    if (this._active === rule) return;
    this.fire(this._active = rule, this);
  }
}

declare global {
  export interface ESLLibrary {
    MediaRuleList: typeof ESLMediaRuleList;
  }
}

import {ExportNs} from '../../esl-utils/environment/export-ns';
import {Observable} from '../../esl-utils/abstract/observable';
import {evaluate} from '../../esl-utils/misc/format';
import {isPrimitive} from '../../esl-utils/misc/object';
import {ESLMediaRule} from './esl-media-rule';

export type RulePayloadParser<T> = (val: string) => T | undefined;
export type RuleChangedCallback<T> = (rule: ESLMediaRule<T | undefined>, list: ESLMediaRuleList<T>) => void;

/**
 * ESLMediaRuleList - {@link ESLMediaRule} observable collection
 * @author Yuliya Adamskaya
 *
 * Represents observable object that wraps environment to value mapping
 */
@ExportNs('MediaRuleList')
export class ESLMediaRuleList<T = any> extends Observable<RuleChangedCallback<T>> {
  /**
   * String value parser (used as a default)
   * @returns value string as it is
   */
  public static STRING_PARSER: RulePayloadParser<string> = (val: string): string => val;
  /**
   * Object value parser. Uses {@link evaluate} to parse value
   * @returns value - parsed JS Object
   */
  public static OBJECT_PARSER = <U>(val: string): U | undefined => evaluate(val);

  /**
   * Creates `ESLMediaRuleList` from string query representation
   * Uses exact strings as rule list values
   * @param query - query string
   */
  public static parse(query: string): ESLMediaRuleList<string>;
  /**
   * Creates `ESLMediaRuleList` from string query representation
   * @param query - query string
   * @param parser - value parser function. See built in {@link ESLMediaRuleList.OBJECT_PARSER} or {@link ESLMediaRuleList.STRING_PARSER} (default)
   */
  public static parse<U>(query: string, parser: RulePayloadParser<U>): ESLMediaRuleList<U>;
  public static parse(query: string, parser: RulePayloadParser<any> = ESLMediaRuleList.STRING_PARSER): ESLMediaRuleList<any> {
    const rules: ESLMediaRule<any>[] = [];
    query.split('|').forEach((part: string) => {
      const lex = part.trim();
      const rule = ESLMediaRule.parse(lex, parser);
      if (!rule) return;
      rule.default ? rules.unshift(rule) : rules.push(rule);
    });
    return new ESLMediaRuleList(rules);
  }

  /**
   * Creates `ESLMediaRuleList` from two strings with a value  and conditions tuple
   *
   * @example
   * ESLMediaRuleList.fromTuple('1|2|3|4|5', '@XS|@SM|@MD|@LG|@XL')
   *
   * @param value - values tuple string (uses '|' as separator)
   * @param mask - media conditions tuple string (uses '|' as separator)
   */
  public static parseTuple(value: string, mask: string) {
    const values = value.split('|');
    const conditions = mask.split('|');
    if (values.length !== conditions.length) throw new Error('Value doesn\'t correspond to mask');
    const rules = conditions.map((query, i) => new ESLMediaRule(values[i], query));
    return new ESLMediaRuleList(rules);
  }

  private readonly _rules: ESLMediaRule<T>[];
  private readonly _default: ESLMediaRule<T | undefined>;
  private _active: ESLMediaRule<T | undefined>;

  private constructor(rules: ESLMediaRule<T>[]) {
    super();
    this._rules = rules;
    this._default = rules.filter((rule) => rule.default)[0];
    this._onMatchChanged = this._onMatchChanged.bind(this);
  }

  /** Subscribes to the instance active rule change */
  public addListener(listener: RuleChangedCallback<T>) {
    super.addListener(listener);
    if (this._listeners.size > 1) return;
    this._rules.forEach((rule) => rule.addListener(this._onMatchChanged));
  }

  /** Unsubscribes from the instance active rule change */
  public removeListener(listener: RuleChangedCallback<T>) {
    super.removeListener(listener);
    if (this._listeners.size) return;
    this._rules.forEach((rule) => rule.removeListener(this._onMatchChanged));
  }

  /** List of inner {@link ESLMediaRule}s */
  public get rules() {
    return this._rules;
  }

  /** Cached active {@link ESLMediaRule} */
  public get active() {
    if (!this._active || !this._listeners.size) {
      this._active = this.activeRule;
    }
    return this._active;
  }

  /** Returns last active rule in the list */
  public get activeRule(): ESLMediaRule<T | undefined> {
    const satisfied = this.rules.filter((rule) => rule.matches);
    return satisfied.length > 0 ? satisfied[satisfied.length - 1] : ESLMediaRule.empty();
  }

  /** Active rule payload value */
  public get activeValue(): T | undefined {
    const value = this.active.payload;
    if (isPrimitive(value) || !this.default || isPrimitive(this.default.payload)) return value;
    return Object.assign({}, this._default.payload || {}, value);
  }

  /** {@link ESLMediaRule} that is used as a default */
  public get default() {
    return this._default;
  }

  /** Handle inner rules state change */
  private _onMatchChanged() {
    const rule = this.activeRule;
    if (this._active === rule) return;
    this.fire(this._active = rule, this);
  }
}

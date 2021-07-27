import {ExportNs} from '../../esl-utils/environment/export-ns';
import {Observable} from '../../esl-utils/abstract/observable';
import {evaluate} from '../../esl-utils/misc/format';
import {isPrimitive} from '../../esl-utils/misc/object';
import {ESLMediaRule} from './esl-media-rule';

export type RulePayloadParser<T> = (val: string) => T | undefined;
export type RuleChangedCallback<T> = (rule: ESLMediaRule<T | undefined>, list: ESLMediaRuleList<T>) => void;

/**
 * ESL Rule List - ESLMediaRule observable collection
 * @author Yuliya Adamskaya
 */
@ExportNs('MediaRuleList')
export class ESLMediaRuleList<T = any> extends Observable<RuleChangedCallback<T>> {
  public static STRING_PARSER: RulePayloadParser<string> = (val: string): string => val;
  public static OBJECT_PARSER = <U>(val: string): U | undefined => evaluate(val);

  public static from(query: string): ESLMediaRuleList<string>;
  public static from<U>(query: string, parser: RulePayloadParser<U>): ESLMediaRuleList<U>;
  public static from(query: string, parser: RulePayloadParser<any> = ESLMediaRuleList.STRING_PARSER): ESLMediaRuleList<any> {
    const rules: ESLMediaRule<any>[] = [];
    query.split('|').forEach((part: string) => {
      const lex = part.trim();
      const rule = ESLMediaRule.parse(lex, parser);
      if (!rule) return;
      rule.default ? rules.unshift(rule) : rules.push(rule);
    });
    return new ESLMediaRuleList(rules);
  }

  public static fromCortege(value: string, mask: string) {
    const values = value.split('|');
    const conditions = mask.split('|');
    const rules = conditions.map((query, i) => new ESLMediaRule(values[i], query));
    return new ESLMediaRuleList(rules);
  }

  /** @deprecated use {@link from} instead */
  public static parse<U>(query: string, parser: RulePayloadParser<U>) {
    return ESLMediaRuleList.from<U>(query, parser);
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

  public addListener(listener: RuleChangedCallback<T>) {
    super.addListener(listener);
    if (this._listeners.size > 1) return;
    this._rules.forEach((rule) => rule.addListener(this._onMatchChanged));
  }

  public removeListener(listener: RuleChangedCallback<T>) {
    super.removeListener(listener);
    if (this._listeners.size) return;
    this._rules.forEach((rule) => rule.removeListener(this._onMatchChanged));
  }

  get _activeRule(): ESLMediaRule<T | undefined> {
    const satisfied = this.rules.filter((rule) => rule.matches);
    return satisfied.length > 0 ? satisfied[satisfied.length - 1] : ESLMediaRule.empty();
  }

  get rules() {
    return this._rules;
  }

  get active() {
    if (!this._active) {
      this._active = this._activeRule;
    }
    return this._active;
  }

  get default() {
    return this._default;
  }

  get activeValue(): T | undefined {
    const value = this.active.payload;
    if (isPrimitive(value) || !this.default || isPrimitive(this.default.payload)) return value;
    return Object.assign({}, this._default.payload || {}, value);
  }

  private _onMatchChanged() {
    const rule = this._activeRule;
    if (this._active === rule) return;
    this.fire(this._active = rule, this);
  }
}

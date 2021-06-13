import {Observable} from '../../esl-utils/abstract/observable';
import {evaluate} from '../../esl-utils/misc/format';
import {ESLMediaRule} from './esl-media-rule';
import {isPrimitive} from '../../esl-utils/misc/object';

type PayloadParser<T> = (val: string) => T | undefined;

/**
 * ESL Rule List - ESLMediaRule observable collection
 * @author Yuliya Adamskaya
 */
export class ESLMediaRuleList<T> extends Observable {
  private _active: ESLMediaRule<T | undefined>;
  private readonly _default: ESLMediaRule<T>;
  private readonly _rules: ESLMediaRule<T>[];

  public static STRING_PARSER = (val: string) => val;
  public static OBJECT_PARSER = <U>(val: string): U | undefined => evaluate(val);

  private static parseRules<U>(str: string, parser: PayloadParser<U>): ESLMediaRule<U>[] {
    const parts = str.split('|');
    const rules: ESLMediaRule<U>[] = [];
    parts.forEach((_lex: string) => {
      const lex = _lex.trim();
      if (!lex) {
        return;
      }
      if (lex.indexOf('=>') === -1) {
        const value = parser(lex);
        // Default rule should have lower priority
        typeof value !== 'undefined' && rules.unshift(ESLMediaRule.all(value));
      } else {
        const rule = ESLMediaRule.parse(lex, parser);
        rule && rules.push(rule);
      }
    });
    return rules;
  }

  public static parse<U>(query: string, parser: PayloadParser<U>) {
    return new ESLMediaRuleList<U>(query, parser);
  }

  private constructor(query: string, parser: PayloadParser<T>) {
    super();
    if (typeof query !== 'string') {
      throw new Error('ESLRuleList require first parameter (query) typeof string');
    }
    this._rules = ESLMediaRuleList.parseRules(query, parser);
    this._rules.forEach((rule) => rule.addListener(this._onMatchChanged));
    this._default = this._rules.filter((rule) => rule.default)[0];
  }

  get rules() {
    return this._rules;
  }

  get _activeRule(): ESLMediaRule<T | undefined> {
    const satisfied = this.rules.filter((rule) => rule.matches);
    return satisfied.length > 0 ? satisfied[satisfied.length - 1] : ESLMediaRule.empty();
  }

  get active() {
    if (!this._active) {
      this._active = this._activeRule;
    }
    return this._active;
  }

  get activeValue(): T | undefined {
    const value = this.active.payload;
    if (isPrimitive(value) || !this._default || isPrimitive(this._default.payload)) return value;
    return Object.assign({}, this._default.payload || {}, value);
  }

  private _onMatchChanged = () => {
    const rule = this._activeRule;
    if (this._active !== rule) {
      this._active = rule;
      this.fire(rule);
    }
  };
}

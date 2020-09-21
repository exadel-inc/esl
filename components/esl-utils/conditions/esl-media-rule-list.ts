/**
 * ESL Rule List
 * @version 1.0.0
 * @author Yuliya Adamskaya
 *
 * Helper class that extend provide Observable Rule Handler that resolve payload based on current device configuration.
 * Supports
 * - CSS query matching check
 * - DPR display queries (@x1 | @x2 | @x3)
 * - Screen default sizes shortcuts @[-|+](XS|SM|MD|LG|XL)
 * - Query matching change listeners
 * - Mobile / full browser detection (@MOBILE|@DESKTOP)
 */

import {Observable} from '../abstract/observable';
import ESLMediaQuery from './esl-media-query';

type PayloadParser<T> = (val: string) => T | undefined;

class ESLMediaRule<T> extends ESLMediaQuery {
	private readonly _payload: T;
	private readonly _default: boolean;

	constructor(payload: T, query: string) {
		super(query);
		this._default = !query;
		this._payload = payload;
	}

	public toString() {
		return `${super.toString()} => ${this._payload}`;
	}

	get payload(): T {
		return this._payload;
	}
	get default(): boolean {
		return this._default;
	}

	public static parse<U>(lex: string, parser: PayloadParser<U>) {
		const [query, payload] = lex.split('=>');
		const payloadValue = parser(payload.trim());
		if (typeof payloadValue === 'undefined') return null;
		return new ESLMediaRule<U>(payloadValue, query.trim());
	}

	public static all<U>(payload: U) {
		return new ESLMediaRule<U>(payload, 'all');
	}
	public static empty(): ESLMediaRule<null> {
		return new ESLMediaRule(null, 'all');
	}
}

export default class ESLMediaRuleList<T> extends Observable {
	private _active: ESLMediaRule<T | null>;
	private readonly _default: ESLMediaRule<T>;
	private readonly _rules: ESLMediaRule<T>[];

	public static STRING_PARSER = (val: string) => val;
	public static OBJECT_PARSER = <U> (val: string): U | undefined => {
		try {
			return eval('(' + val + ')') as U;
		} catch (e) {
			return undefined;
		}
	};

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

	get _activeRule(): ESLMediaRule<T | null> {
		const satisfied = this.rules.filter((rule) => rule.matches);
		return satisfied.length > 0 ? satisfied[satisfied.length - 1] : ESLMediaRule.empty();
	}

	get active() {
		if (!this._active) {
			this._active = this._activeRule;
		}
		return this._active;
	}

	get activeValue(): T | null {
		const value = this.active.payload;
		if (typeof value === 'string' || !this._default) {
			return value;
		}
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

/**
 * Smart Rule List
 * @version 1.0.0
 * @author Yuliya Adamskaya
 *
 * Helper class that extend provide Observable Rule Handler that resolve payload based on current device configuration.
 * Supports
 * - CSS query matching check
 * - DPR display queries (@x1 | @x2 | @x3)
 * - Screen HPE default sizes shortcuts @[-|+](XS|SM|MD|LG|XL)
 * - Query matching change listeners
 * - Mobile / full browser detection (@MOBILE|@DESKTOP)
 */

import SmartQuery from './smart-query';
import {Observable} from '../../../helpers/abstract/observable';

type PayloadParser<T> = (val: string) => T;

class SmartRule<T> extends SmartQuery {
	private readonly _payload: T;

	constructor(payload: T, query: string) {
		super(query);
		this._payload = payload;
	}

	public toString() {
		return `${this.query.media} => ${this._payload}`;
	}

	get payload(): T {
		return this._payload;
	}

	public static parse<T>(lex: string, parser: PayloadParser<T>) {
		const [query, payload] = lex.split('=>');
		return new SmartRule<T>(parser(payload.trim()), query.trim());
	}

	public static all<T>(payload: T) {
		return new SmartRule<T>(payload, 'all');
	}
	public static empty() {
		return SmartRule.all(null);
	}
}

export default class SmartRuleList<T extends string | object> extends Observable {
	private _active: SmartRule<T>;
	private readonly _rules: Array<SmartRule<T>>;

	public static STRING_PARSER = (val: string) => val;
	public static OBJECT_PARSER = (val: string): object => {
		try {
			return eval('(' + val + ')');
		} catch (e) {
			return null;
		}
	};

	private static parseRules<T>(str: string, parser: PayloadParser<T>): Array<SmartRule<T>> {
		const parts = str.split('|');
		const rules: Array<SmartRule<T>> = [];
		parts.forEach((_lex: string) => {
			const lex = _lex.trim();
			if (!lex) {
				return;
			}
			if (lex.indexOf('=>') === -1) {
				// Default rule should have lower priority
				rules.unshift(SmartRule.all(parser(lex)));
			} else {
				const rule = SmartRule.parse(lex, parser);
				rule && rules.push(rule);
			}
		});
		return rules;
	}

	public static parse<T extends string | object>(query: string, parser: PayloadParser<T>) {
		return new SmartRuleList<T>(query, parser);
	}

	private constructor(query: string, parser: PayloadParser<T>) {
		super();
		if (typeof query !== 'string') {
			throw new Error('SmartRuleList require first parameter (query) typeof string');
		}
		this._rules = SmartRuleList.parseRules(query, parser);
		this._rules.forEach((rule) => rule.addListener(this._onMatchChanged));
	}

	get rules() {
		return this._rules;
	}

	get _activeRule() {
		const satisfied = this.rules.filter((rule) => rule.matches);
		return satisfied.length > 0 ? satisfied[satisfied.length - 1] : SmartRule.empty();
	}

	get active() {
		if (!this._active) {
			this._active = this._activeRule;
		}
		return this._active;
	}

	get activeValue(): T {
		return this.active.payload;
	}

	private _onMatchChanged = () => {
		const rule = this._activeRule;
		if (this._active !== rule) {
			this._active = rule;
			this.fire(rule);
		}
	};
}

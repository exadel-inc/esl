import SmartQuery from './smart-query';
import {Observable} from '../../../helpers/classes/observable';

class SmartRule extends SmartQuery {
	private readonly _payload: string | object;

	constructor(payload: string | object, query: string) {
		super(query);
		this._payload = payload;
	}

	public toString() {
		return `${this.query.media} => ${this._payload}`;
	}

	get payload() {
		return this._payload;
	}

	public static parse(lex: string) {
		const [query, payload] = lex.split('=>');
		const valueTerm = payload.trim();
		// todo: review
		if (valueTerm[0] === '{') {
			try {
				const value = eval('(' + valueTerm + ')');
				// JSON.parse(valueTerm.replace(/'/g, "\""))
				return new SmartRule(value, query.trim());
			} catch (e) {
				return null;
			}
		}
		return new SmartRule(valueTerm, query.trim());
	}

	public static all(payload: string | object) {
		return new SmartRule(payload, 'all');
	}

	public static empty() {
		return SmartRule.all(null);
	}
}

export default class SmartRuleList extends Observable {
	private readonly _rules: SmartRule[];
	private _value: string | object;

	constructor(query: string) {
		super();
		if (typeof query !== 'string') {
			throw new Error('SmartRuleList require first parameter (query) typeof string');
		}
		this._rules = this.parseRules(query);
		this._rules.forEach((rule) => rule.addListener(this._onMatchChanged));
	}

	private parseRules(str: string) {
		const parts = str.split('|');
		const rules: SmartRule[] = [];
		parts.forEach((lex: string) => {
			// Default rule should have lower priority
			if (lex && lex.trim().length) {
				if (lex.indexOf('=>') === -1) {
					rules.unshift(SmartRule.all(lex.trim()));
				} else {
					const rule = SmartRule.parse(lex);
					rule && rules.push(rule);
				}
			}
		});
		return rules;
	}

	get rules() {
		return this._rules;
	}

	get targetRule() {
		const satisfied = this.rules.filter((rule) => rule.matches);
		return satisfied.length > 0 ? satisfied[satisfied.length - 1] : SmartRule.empty();
	}

	get value(): string | object {
		if (typeof this._value === 'undefined') {
			this._value = this.targetRule.payload;
		}
		return this._value;
	}

	private _onMatchChanged = () => {
		const rule = this.targetRule;
		if (this._value !== rule.payload) {
			this._value = rule.payload;
			this.fire(this._value);
		}
	};

	public static parse(query: string) {
		return new SmartRuleList(query);
	}
}

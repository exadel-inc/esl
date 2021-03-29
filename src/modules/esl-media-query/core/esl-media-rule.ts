import {ESLMediaQuery} from './esl-media-query';

type PayloadParser<T> = (val: string) => T | undefined;

/**
 * ESL Rule
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
export class ESLMediaRule<T> extends ESLMediaQuery {
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

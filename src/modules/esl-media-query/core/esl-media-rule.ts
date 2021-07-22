import {ESLMediaQuery} from './esl-media-query';
import type {IESLMQCondition} from './esl-mq-base';

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
export class ESLMediaRule<T> {
  private readonly _query: IESLMQCondition;
  private readonly _payload: T;
  private readonly _default: boolean;

  constructor(payload: T, query: string) {
    this._query = ESLMediaQuery.for(query);
    this._default = !query;
    this._payload = payload;
  }

  public toString() {
    return `${this._query} => ${this._payload}`;
  }

  public addListener(listener: () => void) {
    this._query.addListener(listener);
  }
  public removeListener(listener: () => void) {
    this._query.removeListener(listener);
  }

  public get matches(): boolean {
    return this._query.matches;
  }
  public get payload(): T {
    return this._payload;
  }
  public get default(): boolean {
    return this._default;
  }

  public static parse<U>(lex: string, parser: PayloadParser<U>) {
    const [query, payload] = lex.split('=>');
    const payloadValue = parser(payload.trim());
    if (typeof payloadValue === 'undefined') return undefined;
    return new ESLMediaRule<U>(payloadValue, query.trim());
  }

  public static all<U>(payload: U) {
    return new ESLMediaRule<U>(payload, 'all');
  }
  public static empty(): ESLMediaRule<undefined> {
    return new ESLMediaRule(undefined, 'all');
  }
}

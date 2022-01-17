import {ESLMediaQuery} from './esl-media-query';

type PayloadParser<T> = (val: string) => T | undefined;

/**
 * ESL Media Rule
 * @author Yuliya Adamskaya
 *
 * Helper class to wrap {@link ESLMediaQuery} with the payload value
 * @see ESLMediaQuery
 * @see ESLMediaRuleList
 */
export class ESLMediaRule<T> {
  private readonly _query: ESLMediaQuery;
  private readonly _payload: T;
  private readonly _default: boolean;

  constructor(payload: T, query: string = '') {
    this._query = ESLMediaQuery.for(query);
    this._default = !query;
    this._payload = payload;
  }

  public toString(): string {
    return `${this._query} => ${this._payload}`;
  }

  /** Subscribes on inner {@link ESLMediaQuery} changes */
  public addListener(listener: () => void): void {
    this._query.addListener(listener);
  }
  /** Unsubscribes from inner {@link ESLMediaQuery} changes */
  public removeListener(listener: () => void): void {
    this._query.removeListener(listener);
  }

  /** Check if the inner {@link ESLMediaQuery} is matching current device configuration */
  public get matches(): boolean {
    return this._query.matches;
  }
  /** @returns wrapped payload value */
  public get payload(): T {
    return this._payload;
  }
  /**
   * Check if the rule was created with an empty query
   * @see ESLMediaRuleList
   */
  public get default(): boolean {
    return this._default;
  }

  /** Parse the rule string to the {@link ESLMediaRule} instance */
  public static parse<U>(lex: string, parser: PayloadParser<U>): ESLMediaRule<U> | undefined {
    const parts = lex.split('=>');
    const query = parts.length === 2 ? parts[0] : '';
    const payload = parts.length === 2 ? parts[1] : parts[0];
    const payloadValue = parser(payload.trim());
    if (typeof payloadValue === 'undefined') return undefined;
    return new ESLMediaRule<U>(payloadValue, query.trim());
  }

  /** Shortcut to create always active {@link ESLMediaRule} with passed value */
  public static all<U>(payload: U): ESLMediaRule<U> {
    return new ESLMediaRule<U>(payload, 'all');
  }
  /** Shortcut to create condition-less {@link ESLMediaRule} */
  public static default<U>(payload: U): ESLMediaRule<U> {
    return new ESLMediaRule<U>(payload);
  }
  /** Shortcut to create always inactive {@link ESLMediaRule} */
  public static empty(): ESLMediaRule<undefined> {
    return new ESLMediaRule(undefined, 'all');
  }
}

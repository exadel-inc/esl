import {ESLMediaQuery} from './esl-media-query';

export type RulePayloadParser<T> = (val: string) => T | undefined;

/**
 * ESL Media Rule
 * @author Yuliya Adamskaya
 *
 * Helper class to wrap {@link ESLMediaQuery} with the payload value
 * @see ESLMediaQuery
 * @see ESLMediaRuleList
 */
export class ESLMediaRule<T = any> {
  public readonly query: ESLMediaQuery;
  public readonly payload: T;

  constructor(payload: T, query: string = '') {
    this.query = ESLMediaQuery.for(query);
    this.payload = payload;
  }

  /** @returns if the inner {@link ESLMediaQuery} is matching current device configuration */
  public get matches(): boolean {
    return this.query.matches;
  }

  /** Subscribes on inner {@link ESLMediaQuery} changes */
  public addEventListener(callback: EventListener): void;
  public addEventListener(type: 'change', callback: EventListener): void;
  public addEventListener(type: any, callback: EventListener = type): void {
    this.query.addEventListener(callback);
  }

  /** Unsubscribes from inner {@link ESLMediaQuery} changes */
  public removeEventListener(callback: EventListener): void;
  public removeEventListener(type: 'change', callback: EventListener): void;
  public removeEventListener(type: any, callback: EventListener = type): void {
    this.query.removeEventListener(callback);
  }

  public toString(): string {
    const val = typeof this.payload === 'object' ?
      JSON.stringify(this.payload) :
      String(this.payload);
    return `${this.query} => ${val}`;
  }

  /**
   * Creates the {@link ESLMediaRule} instance from payload string, query and valueParser.
   * If the payload parse result is undefined then rule will be undefined.
   */
  public static create<U>(payload: string, query: string, parser: RulePayloadParser<U>): ESLMediaRule<U> | undefined {
    const payloadValue = parser(payload.trim());
    if (typeof payloadValue === 'undefined') return undefined;
    return new ESLMediaRule<U>(payloadValue, query.trim());
  }

  /** Parses the rule string to the {@link ESLMediaRule} instance */
  public static parse<U>(lex: string, parser: RulePayloadParser<U>): ESLMediaRule<U> | undefined {
    const parts = lex.split('=>');
    const query = parts.length === 2 ? parts[0] : '';
    const payload = parts.length === 2 ? parts[1] : parts[0];
    return ESLMediaRule.create(payload, query, parser);
  }

  /** Shortcut to create always active {@link ESLMediaRule} with passed value */
  public static all<U>(payload: U): ESLMediaRule<U> {
    return new ESLMediaRule<U>(payload, 'all');
  }
  /** Shortcut to create always inactive {@link ESLMediaRule} */
  public static empty(): ESLMediaRule<undefined> {
    return new ESLMediaRule(undefined, 'all');
  }
}

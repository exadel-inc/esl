import {memoize} from '../../esl-utils/decorators';
import {ExportNs} from '../../esl-utils/environment/export-ns';

import {ESLScreenDPR} from './common/screen-dpr';
import {ESLScreenBreakpoints} from './common/screen-breakpoint';
import {ESLEnvShortcuts} from './common/env-shortcuts';

import {ALL, NOT_ALL} from './conditions/media-query-const';
import {MediaQueryCondition} from './conditions/media-query-condition';
import {MediaQueryConjunction, MediaQueryDisjunction} from './conditions/media-query-containers';

import type {IMediaQueryCondition} from './conditions/media-query-base';

export interface IMediaQueryPreprocessor {
  process: (match: string) => string | boolean | undefined;
}

/**
 * ESL Media Query
 * @implements EventTarget
 * Provides special media condition syntax - ESLMediaQuery
 * @author Alexey Stsefanovich (ala'n), Yuliya Adamskaya, Natallia Harshunova
 *
 * Utility to support extended MediaQuery features
 * Supports
 * - CSS MediaQuery matching check
 * - DPR display queries (`@x1|@x2|@x3`)
 * - Registered screen default sizes (breakpoints) shortcuts (`@[-|+](XS|SM|MD|LG|XL)`)
 * - Device and browser shortcuts (`@MOBILE|@DESKTOP|@IE`)
 * - Custom static shortcuts and custom query preprocessors
 * - `not` logic operation (can have multiple not operators before any term of the query)
 * - `or` or `,` logical operator (have a lowest priority)
 * - Query matching change listeners
 * - Implements {@link EventTarget}, compatible with {@link ESLEventListener}
 *
 * Building query process:
 *
 * [Building query logical tree] - [preprocess nodes queries] - [building native MediaQueryList nodes] - [query tree optimization]
 */
@ExportNs('MediaQuery')
export abstract class ESLMediaQuery implements IMediaQueryCondition {
  /** Always true condition */
  public static readonly ALL: ESLMediaQuery = ALL;
  /** Always false condition */
  public static readonly NOT_ALL: ESLMediaQuery = NOT_ALL;

  protected static readonly SHORTCUT_PATTERN = /@([a-z0-9.+-]+)/i;
  protected static readonly _preprocessors: IMediaQueryPreprocessor[] = [];

  /** Adds {@link IMediaQueryPreprocessor} instance for query preprocessing step */
  public static use(preprocessor: IMediaQueryPreprocessor): typeof ESLMediaQuery {
    this._preprocessors.unshift(preprocessor);
    return this;
  }

  /** Cached method to create {@link ESLMediaQuery} condition instance from query string */
  @memoize()
  public static for(query: string): ESLMediaQuery {
    return ESLMediaQuery.from(query);
  }

  /** Creates {@link ESLMediaQuery} condition instance from query string */
  public static from(query: string): ESLMediaQuery {
    const conjunctions = query.split(/\sor\s|,/).map((term) => {
      const conditions = term.split(/\sand\s/).map(ESLMediaQuery.parseSimpleQuery);
      return new MediaQueryConjunction(conditions);
    });
    return new MediaQueryDisjunction(conjunctions).optimize();
  }

  /** Preprocess simple query term by applying replacers and shortcuts rules */
  protected static preprocess(term: string): string {
    if (!this.SHORTCUT_PATTERN.test(term)) return term;
    const shortcut = term.trim().substring(1).toLowerCase();
    for (const replacer of this._preprocessors) {
      const result = replacer.process(shortcut);
      if (typeof result === 'string') return result;
      if (typeof result === 'boolean') return result ? 'all' : 'not all';
    }
    return term;
  }

  /** Creates simple {@link ESLMediaQuery} condition */
  protected static parseSimpleQuery(term: string): ESLMediaQuery {
    const query = term.replace(/^\s*not\s+/, '');
    const queryInverted = query !== term;
    const processedQuery = ESLMediaQuery.preprocess(query);
    const sanitizedQuery = processedQuery.replace(/^\s*not\s+/, '');
    const resultInverted = processedQuery !== sanitizedQuery;
    const invert = queryInverted !== resultInverted;

    if (ALL.eq(sanitizedQuery)) return invert ? NOT_ALL : ALL;
    if (NOT_ALL.eq(sanitizedQuery)) return invert ? ALL : NOT_ALL;
    return new MediaQueryCondition(sanitizedQuery, invert);
  }

  // Implements IESLMQCondition to allow use ESLMediaQuery as IESLMQCondition type alias
  public abstract matches: boolean;

  public abstract optimize(): ESLMediaQuery;
  public abstract dispatchEvent(event: Event): boolean;
  public abstract toString(): string;

  public abstract addEventListener(callback: EventListener): void;
  public abstract addEventListener(type: 'change', callback: EventListener): void;
  public abstract removeEventListener(callback: EventListener): void;
  public abstract removeEventListener(type: 'change', callback: EventListener): void;
}

// Register otb preprocessors
ESLMediaQuery.use(ESLScreenDPR);
ESLMediaQuery.use(ESLScreenBreakpoints);
ESLMediaQuery.use(ESLEnvShortcuts);

declare global {
  export interface ESLLibrary {
    MediaQuery: typeof ESLMediaQuery;
  }
}

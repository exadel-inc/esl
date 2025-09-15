import {memoize} from '../../esl-utils/decorators';
import {isObject} from '../../esl-utils/misc/object/types';
import {ExportNs} from '../../esl-utils/environment/export-ns';

import {ESLScreenDPR} from './common/screen-dpr';
import {ESLScreenBreakpoints} from './common/screen-breakpoint';
import {ESLMediaShortcuts} from './common/media-shortcuts';

import {ALL, NOT_ALL} from './conditions/media-query-const';
import {MediaQueryCondition} from './conditions/media-query-condition';
import {MediaQueryNegation} from './conditions/media-query-negation';
import {MediaQueryConjunction, MediaQueryDisjunction} from './conditions/media-query-containers';

import type {IMediaQueryCondition} from './conditions/media-query-base';

export interface IMediaQueryPreprocessor {
  process: (match: string) => IMediaQueryCondition | undefined;
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
      const conditions = term.split(/\sand\s/).map(this.parseSingleQuery, this);
      return new MediaQueryConjunction(conditions);
    });
    return new MediaQueryDisjunction(conjunctions).optimize();
  }

  /** Creates simple {@link ESLMediaQuery} condition */
  protected static parseSingleQuery(term: string): ESLMediaQuery {
    // Wrap `not` operator
    const query = term.replace(/^\s*not\s+/, '');
    if (query !== term) return new MediaQueryNegation(this.parseSingleQuery(query));

    // Check for shortcuts
    if (this.SHORTCUT_PATTERN.test(term)) {
      const shortcut = term.trim().substring(1).toLowerCase();
      for (const replacer of this._preprocessors) {
        const result = replacer.process(shortcut);
        if (isObject(result)) return result;
      }
      return ESLMediaShortcuts.process(shortcut);
    }
    // Otherwise, wrap as MediaQueryCondition
    return new MediaQueryCondition(term.trim());
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

declare global {
  export interface ESLLibrary {
    MediaQuery: typeof ESLMediaQuery;
  }
}

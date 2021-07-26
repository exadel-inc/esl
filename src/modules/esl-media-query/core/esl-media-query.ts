import {memoize} from '../../esl-utils/decorators/memoize';
import {ExportNs} from '../../esl-utils/environment/export-ns';

import {ALL, NOT_ALL} from './impl/esl-mq-base';
import {ESLMQCondition} from './impl/esl-mq-condition';
import {ESLMQConjunction, ESLMQDisjunction} from './impl/esl-mq-group';

import type {IESLMQCondition} from './impl/esl-mq-base';

export interface ESLShortcutReplacer {
  replace: (match: string) => string | boolean | undefined;
}

/**
 * ESL Media Query
 * Provides special media condition syntax - ESLQuery
 * @author Alexey Stsefanovich (ala'n), Yuliya Adamskaya, Natallia Harshunova
 *
 * Helper class that extends MediaQueryList class
 * Supports
 * - CSS query matching check
 * - DPR display queries (@x1 | @x2 | @x3)
 * - Screen default sizes shortcuts @[-|+](XS|SM|MD|LG|XL)
 * - Query matching change listeners
 * - Mobile / full browser detection (@MOBILE|@DESKTOP)
 * - Exclude upper DPRs for bots
 */
@ExportNs('MediaQuery')
export abstract class ESLMediaQuery implements IESLMQCondition {
  /** Static always truthful condition */
  public static readonly ALL: IESLMQCondition = ALL;
  /** Static always falsy condition */
  public static readonly NOT_ALL: IESLMQCondition = NOT_ALL;

  protected static readonly SHORTCUT_PATTERN = /@([a-z0-9.+-]+)/i;
  protected static readonly _replacers: ESLShortcutReplacer[] = [];

  /** Cached method to create {@link ESLMediaQuery} condition instance from string */
  @memoize()
  public static for(query: string): IESLMQCondition {
    return ESLMediaQuery.parse(query);
  }

  /** Create {@link ESLMediaQuery} condition instance from string */
  public static parse(query: string): IESLMQCondition {
    const conjunctions = query.split(/\sor\s|,/).map((term) => {
      const conditions = term.split(/\sand\s/).map(ESLMediaQuery.wrap);
      return new ESLMQConjunction(conditions);
    });
    return new ESLMQDisjunction(conjunctions).optimize();
  }

  /** Create simple {@link ESLMediaQuery} condition */
  protected static wrap(term: string): IESLMQCondition {
    term = ESLMediaQuery.applyReplacers(term);
    if (ALL.eq(term)) return ALL;
    if (NOT_ALL.eq(term)) return NOT_ALL;
    return new ESLMQCondition(term);
  }

  /** Add {@link ESLShortcutReplacer} instance to preprocess query */
  public static addReplacer(replacer: ESLShortcutReplacer): typeof ESLMediaQuery {
    this._replacers.unshift(replacer);
    return this;
  }

  /** Preprocess simple query term by applying replacers and shortcuts rules */
  public static applyReplacers(term: string) {
    if (!this.SHORTCUT_PATTERN.test(term)) return term;
    const shortcut = term.trim().substr(1).toLowerCase();
    for (const replacer of this._replacers) {
      const result = replacer.replace(shortcut);
      if (typeof result === 'string') return result;
      if (typeof result === 'boolean') return result ? 'all' : 'not all';
    }
    return term;
  }

  // Implements IESLMQCondition to allow use ESLMediaQuery as IESLMQCondition type alias
  public abstract matches: boolean;
  public abstract optimize(): IESLMQCondition;
  public abstract addListener(cb: () => void): void;
  public abstract removeListener(cb: () => void): void;
}

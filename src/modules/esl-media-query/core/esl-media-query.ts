import {memoize} from '../../esl-utils/decorators/memoize';
import {ExportNs} from '../../esl-utils/environment/export-ns';

import {ESLMediaShortcuts} from './esl-media-shortcuts';
import {ALL, NOT_ALL} from './esl-mq-base';
import {ESLMQCondition} from './esl-mq-condition';
import {ESLMQConjunction, ESLMQDisjunction} from './esl-mq-group';

import type {IESLMQCondition} from './esl-mq-base';

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
export abstract class ESLMediaQuery implements IESLMQCondition{
  public static readonly ALL: IESLMQCondition = ALL;
  public static readonly NOT_ALL: IESLMQCondition = NOT_ALL;

  /** Cached shortcut to create {@link ESLMediaQuery} */
  @memoize()
  public static for(query: string): IESLMQCondition {
    return ESLMediaQuery.parse(query);
  }

  public static parse(query: string): IESLMQCondition {
    const conjunctions = query.split(/\sor\s|,/).map((term) => {
      const conditions = term.split(/\sand\s/).map(ESLMediaQuery.wrap);
      return new ESLMQConjunction(conditions);
    });
    return new ESLMQDisjunction(conjunctions).optimize();
  }

  public static wrap(query: string): IESLMQCondition {
    query = ESLMediaShortcuts.replace(query);
    query = query.trim();
    if (query === ALL.toString()) return ALL;
    if (query === NOT_ALL.toString()) return NOT_ALL;
    return new ESLMQCondition(query);
  }

  // To allow use ESLMediaQuery as IESLMQCondition type
  public abstract matches: boolean;
  public abstract optimize(): IESLMQCondition;
  public abstract addListener(cb: () => void): void;
  public abstract removeListener(cb: () => void): void;
}

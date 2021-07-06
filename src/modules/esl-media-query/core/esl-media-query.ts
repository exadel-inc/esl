import {memoize} from '../../esl-utils/decorators/memoize';
import {ExportNs} from '../../esl-utils/environment/export-ns';

import {ESLMediaShortcuts} from './esl-media-shortcuts';

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
export class ESLMediaQuery {

  @memoize()
  protected static matchMediaCached(query: string) {
    return matchMedia(query);
  }

  protected static cleanQuery(query: string) {
    query = query.replace(/(and|or)\s+(and|or)/, '$1');
    query = query.replace(/\sor\s/, ', ');
    query = query.replace(/^\s*(and|or)/, '');
    query = query.replace(/(and|or)\s*$/, '');
    return query.trim();
  }

  /** Shortcut to create MediaQuery. The constructor of MediaQuery is already optimized */
  @memoize()
  public static for(query: string) {
    return new ESLMediaQuery(query);
  }

  public static readonly ALL = 'all';
  public static readonly NOT_ALL = 'not all';

  /**
   * Option to disable DPR images handling for bots
   */
  static ignoreBotsDpr = false;

  private readonly _query: MediaQueryList;

  constructor(query: string) {
    // Applying known breakpoints shortcut
    query = ESLMediaShortcuts.replace(query);

    // Clean query
    query = ESLMediaQuery.cleanQuery(query);

    // Set the result query
    this._query = ESLMediaQuery.matchMediaCached(query || ESLMediaQuery.ALL);
  }

  /** inner MediaQueryList instance */
  public get query(): MediaQueryList {
    return this._query;
  }

  /** true if current environment satisfies query */
  public get matches(): boolean {
    return this.query.matches;
  }

  /** Attach listener to wrapped media query list */
  public addListener(listener: () => void) {
    if (typeof this.query.addEventListener === 'function') {
      this.query.addEventListener('change', listener);
    } else {
      this.query.addListener(listener);
    }
  }

  /** Detach listener from wrapped media query list */
  public removeListener(listener: () => void) {
    if (typeof this.query.removeEventListener === 'function') {
      this.query.removeEventListener('change', listener);
    } else {
      this.query.removeListener(listener);
    }
  }

  public toString(): string {
    return '[ESL MQ] (' + this.query.media + ')';
  }
}

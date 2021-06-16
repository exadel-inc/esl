import {memoize} from '../../esl-utils/decorators/memoize';
import {DeviceDetector} from '../../esl-utils/environment/device-detector';
import {ExportNs} from '../../esl-utils/environment/export-ns';

import {ESLMediaBreakpoints} from './esl-media-breakpoints';

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
  static get BreakpointRegistry() {
    return ESLMediaBreakpoints;
  }

  @memoize()
  static for(query: string) {
    return new ESLMediaQuery(query);
  }

  @memoize()
  static matchMediaCached(query: string) {
    return matchMedia(query);
  }

  static buildDprQuery(dpr: number) {
    if (ESLMediaQuery.ignoreBotsDpr && DeviceDetector.isBot && dpr !== 1) return ESLMediaQuery.NOT_ALL;
    if (DeviceDetector.isSafari) return `(-webkit-min-device-pixel-ratio: ${dpr})`;
    return `(min-resolution: ${(96 * dpr).toFixed(1)}dpi)`;
  }

  static readonly ALL = 'all';
  static readonly NOT_ALL = 'not all';

  /**
   * Option to disable DPR images handling for bots
   */
  static ignoreBotsDpr = false;

  private readonly _query: MediaQueryList;

  constructor(query: string) {
    // Applying known breakpoints shortcut
    query = ESLMediaBreakpoints.apply(query);

    // Applying dpr shortcut
    query = query.replace(
      /@(\d(\.\d)?)x/g,
      (match, ratio) => ESLMediaQuery.buildDprQuery(+ratio)
    );

    // Applying dpr shortcut for device detection
    query = query.replace(/(and )?(@MOBILE|@DESKTOP)( and)?/ig, (match, pre, type, post) => {
      if (DeviceDetector.isMobile !== (type.toUpperCase() === '@MOBILE')) {
        return ESLMediaQuery.NOT_ALL; // whole query became invalid
      }
      return pre && post ? 'and' : '';
    });

    this._query = ESLMediaQuery.matchMediaCached(query.trim() || ESLMediaQuery.ALL);
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

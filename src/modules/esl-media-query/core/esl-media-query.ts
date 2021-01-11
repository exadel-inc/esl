/**
 * ESL Media Query
 * Provides special media condition syntax - ESLQuery
 * @version 2.1.0
 * @author Alexey Stsefanovich (ala'n), Yuliya Adamskaya
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

import {memoize} from '../../esl-utils/decorators/memoize';
import {DeviceDetector} from '../../esl-utils/environment/device-detector';
import {ExportNs} from '../../esl-utils/environment/export-ns';

import {ESLMediaBreakpoints} from './esl-media-breakpoints';

@ExportNs('MediaQuery')
export class ESLMediaQuery {
  static get BreakpointRegistry() {
    return ESLMediaBreakpoints;
  }

  @memoize()
  static matchMediaCached(query: string) {
    return matchMedia(query);
  }

  static buildDprQuery(dpr: number) {
    if (DeviceDetector.isSafari) return `(-webkit-min-device-pixel-ratio: ${dpr})`;
    return `(min-resolution: ${(96 * dpr).toFixed(1)}dpi)`;
  }

  static readonly ALL = 'all';
  static readonly NOT_ALL = 'not all';

  /**
   * Option to disable DPR images handling for bots
   */
  static ignoreBotsDpr = false;

  private _dpr: number;
  private _mobileOnly: boolean | undefined;
  private readonly _query: MediaQueryList;

  constructor(query: string) {
    // Applying known breakpoints shortcut
    query = ESLMediaBreakpoints.apply(query);

    // Applying dpr shortcut
    this._dpr = 1;
    query = query.replace(/@(\d(\.\d)?)x/g, (match, ratio) => {
      this._dpr = +ratio;
      if (ESLMediaQuery.ignoreBotsDpr && DeviceDetector.isBot && this._dpr !== 1) {
        return ESLMediaQuery.NOT_ALL;
      }
      return ESLMediaQuery.buildDprQuery(ratio);
    });

    // Applying dpr shortcut for device detection
    query = query.replace(/(and )?(@MOBILE|@DESKTOP)( and)?/ig, (match, pre, type, post) => {
      this._mobileOnly = (type.toUpperCase() === '@MOBILE');
      if (DeviceDetector.isMobile !== this._mobileOnly) {
        return ESLMediaQuery.NOT_ALL; // whole query became invalid
      }
      return pre && post ? 'and' : '';
    });

    this._query = ESLMediaQuery.matchMediaCached(query.trim() || ESLMediaQuery.ALL);
  }

  /** Accepts only mobile devices */
  public get isMobileOnly(): boolean {
    return this._mobileOnly === true;
  }

  /** Accepts only desktop devices */
  public get isDesktopOnly(): boolean {
    return this._mobileOnly === false;
  }

  /** Current query dpr */
  public get dpr(): number {
    return this._dpr;
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

export default ESLMediaQuery;

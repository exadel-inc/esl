/**
 * ESL Media Query
 * Provides special media condition syntax - ESLQuery
 * @version 2.0.0
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

import {DeviceDetector} from '../../esl-utils/enviroment/device-detector';
import {BreakpointRegistry} from '../../esl-utils/enviroment/breakpoints';

const QUERY_CACHE: { [q: string]: MediaQueryList } = {};

function getQuery(query: string): MediaQueryList {
  const matcher = QUERY_CACHE[query] ? QUERY_CACHE[query] : window.matchMedia(query);
  if (matcher) {
    QUERY_CACHE[query] = matcher;
  }
  return matcher;
}

function getDprMediaQuery(ratio: number) {
  if (DeviceDetector.isSafari) {
    return `(-webkit-min-device-pixel-ratio: ${ratio})`;
  }
  return `(min-resolution: ${(96 * ratio).toFixed(1)}dpi)`;
}

export class ESLMediaQuery {
  static get BreakpointRegistry() {
    return BreakpointRegistry;
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
    query = BreakpointRegistry.apply(query);

    // Applying dpr shortcut
    this._dpr = 1;
    query = query.replace(/@(\d(\.\d)?)x/g, (match, ratio) => {
      this._dpr = Number.parseFloat(ratio);
      if (ESLMediaQuery.ignoreBotsDpr && DeviceDetector.isBot && this._dpr !== 1) {
        return ESLMediaQuery.NOT_ALL;
      }
      return getDprMediaQuery(ratio);
    });

    // Applying dpr shortcut for device detection
    query = query.replace(/(and )?(@MOBILE|@DESKTOP)( and)?/ig, (match, pre, type, post) => {
      this._mobileOnly = (type.toUpperCase() === '@MOBILE');
      if (DeviceDetector.isMobile !== this._mobileOnly) {
        return ESLMediaQuery.NOT_ALL; // whole query became invalid
      }
      return pre && post ? 'and' : '';
    });

    this._query = getQuery(query.trim() || ESLMediaQuery.ALL);
  }

  public get isMobileOnly(): boolean {
    return this._mobileOnly === true;
  }

  public get isDesktopOnly(): boolean {
    return this._mobileOnly === false;
  }

  public get DPR(): number {
    return this._dpr;
  }

  public get query(): MediaQueryList {
    return this._query;
  }

  public get matches(): boolean {
    return this.query.matches;
  }

  public addListener(listener: () => void) {
    if (typeof this.query.addEventListener === 'function') {
      this.query.addEventListener('change', listener);
    } else {
      this.query.addListener(listener);
    }
  }

  public removeListener(listener: () => void) {
    if (typeof this.query.removeEventListener === 'function') {
      this.query.removeEventListener('change', listener);
    } else {
      this.query.removeListener(listener);
    }
  }

  public toString(): string {
    return this.query.media;
  }
}

export default ESLMediaQuery;

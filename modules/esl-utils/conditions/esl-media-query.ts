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

import {DeviceDetector} from '../enviroment/device-detector';
import {BreakpointRegistry} from '../enviroment/breakpoints';

const QUERY_CACHE: { [q: string]: MediaQueryList } = {};

function getQuery(query: string): MediaQueryList | null {
  if (!query) return null;
  const matcher = QUERY_CACHE[query] ? QUERY_CACHE[query] : window.matchMedia(query);
  if (matcher) {
    QUERY_CACHE[query] = matcher;
  }
  return matcher;
}

function getDprMediaQuery(ratio: number) {
  const isWebkit = navigator.userAgent.indexOf('AppleWebKit') !== -1;
  return isWebkit ? `(-webkit-min-device-pixel-ratio: ${ratio})` : `(min-resolution: ${Math.round(96 * ratio)}dpi)`;
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
  private readonly _query: MediaQueryList | null;

  constructor(query: string) {

    // Applying known breakpoints shortcut
    query = BreakpointRegistry.apply(query);

    // Applying dpr shortcut
    this._dpr = 1;
    query = query.replace(/@([123])x/, (match, ratio) => {
      this._dpr = Math.floor(ratio);
      if (ESLMediaQuery.ignoreBotsDpr && DeviceDetector.isBot && this._dpr !== 1) {
        return ESLMediaQuery.NOT_ALL;
      }
      return getDprMediaQuery(ratio);
    });

    // Applying dpr shortcut for device detection
    query = query.replace(/(and )?(@MOBILE|@DESKTOP)( and)?/i, (match, pre, type, post) => {
      this._mobileOnly = (type.toUpperCase() === '@MOBILE');
      if (DeviceDetector.isMobile !== this._mobileOnly) {
        return ESLMediaQuery.NOT_ALL;
      }
      return pre && post ? ' and ' : '';
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

  public get query(): MediaQueryList | null {
    return this._query;
  }

  public get matches(): boolean {
    return !!(this.query && this.query.matches);
  }

  public addListener(listener: () => void) {
    if (!this.query) return;
    if (typeof this.query.addEventListener === 'function') {
      this.query.addEventListener('change', listener);
    } else {
      this.query.addListener(listener);
    }
  }

  public removeListener(listener: () => void) {
    if (!this.query) return;
    if (typeof this.query.removeEventListener === 'function') {
      this.query.removeEventListener('change', listener);
    } else {
      this.query.removeListener(listener);
    }
  }

  public toString(): string {
    if (!this.query) return 'NULL RULE';
    return this.query.media;
  }
}

export default ESLMediaQuery;

import {
  isAndroid,
  isBlink,
  isEdgeHTML,
  isGecko,
  isMobile,
  isMobileIOS,
  isMobileSafari,
  isSafari,
  isTouchDevice,
  isWebkit
} from '../../../esl-utils/environment/device-detector';
import {ExportNs} from '../../../esl-utils/environment/export-ns';
import {MediaQueryStaticCondition} from '../conditions/media-query-static';
import {ALL, NOT_ALL} from '../conditions/media-query-const';
import {MediaQueryCondition} from '../conditions/media-query-condition';

import type {IMediaQueryCondition} from '../conditions/media-query-base';

// Shortcut cannot start with a digit and cannot contain special characters
const SHORTCUT_REGEXP = /^[a-z][a-z0-9-_]*$/i;

// Global shortcuts store key
const SHORTCUTS_STORE = Symbol.for('ESLEnvShortcutsStore');

/**
 * Static shortcuts' preprocessor. Used to store device related shortcuts.
 * @author Alexey Stsefanovich (ala'n)
 *
 * @implements IMediaQueryPreprocessor statically
 */
@ExportNs('EnvShortcuts')
@ExportNs('MediaShortcuts')
export class ESLMediaShortcuts {
  /** Returns shortcuts map, ensures there is a single instance */
  protected static get shortcuts(): Map<string, MediaQueryStaticCondition> {
    if (!window[SHORTCUTS_STORE]) {
      window[SHORTCUTS_STORE] = new Map<string, MediaQueryStaticCondition>();
    }
    return window[SHORTCUTS_STORE];
  }

  /** Resolve shortcut by name. If not found, creates new instance */
  protected static resolve(name: string): MediaQueryStaticCondition {
    const {shortcuts} = this;
    name = name.toLowerCase().trim();
    if (!shortcuts.has(name)) shortcuts.set(name, new MediaQueryStaticCondition(name));
    return shortcuts.get(name)!;
  }

  /**
   * Add mapping
   * @param shortcut - term to find in query
   * @param value - media query string or boolean result (that represents `all` or `not all` conditions)
   */
  public static set(shortcut: string, value: boolean | string | IMediaQueryCondition): void {
    if (!value) return ESLMediaShortcuts.set(shortcut, NOT_ALL);
    if (typeof value === 'boolean') return ESLMediaShortcuts.set(shortcut, value ? ALL : NOT_ALL);
    if (typeof value === 'string') return ESLMediaShortcuts.set(shortcut, new MediaQueryCondition(value));
    if (!SHORTCUT_REGEXP.test(shortcut)) throw new Error(`[ESL] Invalid shortcut name: "${shortcut}"`);
    ESLMediaShortcuts.resolve(shortcut).condition = value.optimize();
  }

  /** Replaces shortcut to registered result */
  public static process(match: string): IMediaQueryCondition {
    if (!SHORTCUT_REGEXP.test(match)) return NOT_ALL;
    return this.resolve(match);
  }

  // Legacy support
  /** @deprecated use `set` method instead (Going to be removed in ESL 6.0.0)*/
  public static add = ESLMediaShortcuts.set;

  /**
   * Remove mapping for passed shortcut term.
   * @deprecated use `ESLEnvShortcuts.set(shortcut, false)` instead (Going to be removed in ESL 6.0.0)
   */
  public static remove(shortcut: string): boolean {
    const contain = this.shortcuts.has(shortcut.toLowerCase());
    ESLMediaShortcuts.set(shortcut, NOT_ALL);
    return contain;
  }
}

/** @deprecated use `ESLMediaShortcuts` instead (Going to be removed in ESL 6.0.0) */
export const ESLEnvShortcuts = ESLMediaShortcuts;

// Touch check
ESLMediaShortcuts.set('touch', isTouchDevice);

// Basic device type shortcuts
ESLMediaShortcuts.set('mobile', isMobile);
ESLMediaShortcuts.set('desktop', !isMobile);
ESLMediaShortcuts.set('android', isAndroid);
ESLMediaShortcuts.set('ios', isMobileIOS);

// Basic browser shortcuts
ESLMediaShortcuts.set('edge', isEdgeHTML);
ESLMediaShortcuts.set('gecko', isGecko);
ESLMediaShortcuts.set('webkit', isWebkit);
ESLMediaShortcuts.set('blink', isBlink);
ESLMediaShortcuts.set('safari', isSafari);
ESLMediaShortcuts.set('safari-ios', isMobileSafari);

declare global {
  export interface Window {
    [SHORTCUTS_STORE]: Map<string, MediaQueryStaticCondition>;
  }
  export interface ESLLibrary {
    /** @deprecated use `ESLMediaShortcuts` instead (Going to be removed in ESL 6.0.0) */
    EnvShortcuts: typeof ESLMediaShortcuts;
    MediaShortcuts: typeof ESLMediaShortcuts;
  }
}

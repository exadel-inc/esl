import {
  isAndroid,
  isBlink,
  isBot,
  isEdgeHTML,
  isGecko,
  isIE,
  isMobile,
  isMobileIOS,
  isMobileSafari,
  isSafari,
  isTouchDevice,
  isWebkit
} from '../../../esl-utils/environment/device-detector';
import {ExportNs} from '../../../esl-utils/environment/export-ns';

const shortcuts = new Map<string, string | boolean>();

/**
 * Static shortcuts preprocessor. Used to store device related shortcuts.
 * @author Alexey Stsefanovich (ala'n)
 *
 * @implements IMediaQueryPreprocessor statically
 */
@ExportNs('EnvShortcuts')
export class ESLEnvShortcuts {
  // For debug purposes
  private static readonly _shortcuts = shortcuts;

  /**
   * Add mapping
   * @param shortcut - term to find in query
   * @param value - media query string or boolean result (that represents `all` or `not all` conditions)
   */
  public static add(shortcut: string, value: string | boolean): void {
    if (!['boolean', 'string'].includes(typeof value)) value = false;
    shortcuts.set(shortcut.toLowerCase(), value);
  }

  /** Remove mapping for passed shortcut term */
  public static remove(shortcut: string): boolean {
    return shortcuts.delete(shortcut.toLowerCase());
  }

  /** Replaces shortcut to registered result */
  public static process(match: string): string | boolean | undefined {
    if (shortcuts.has(match)) return shortcuts.get(match);
  }
}

// Touch check
ESLEnvShortcuts.add('touch', isTouchDevice);

// Basic device type shortcuts
ESLEnvShortcuts.add('bot', isBot);
ESLEnvShortcuts.add('mobile', isMobile);
ESLEnvShortcuts.add('desktop', !isMobile);
ESLEnvShortcuts.add('android', isAndroid);
ESLEnvShortcuts.add('ios', isMobileIOS);

// Basic browser shortcuts
ESLEnvShortcuts.add('ie', isIE);
ESLEnvShortcuts.add('edge', isEdgeHTML);
ESLEnvShortcuts.add('gecko', isGecko);
ESLEnvShortcuts.add('webkit', isWebkit);
ESLEnvShortcuts.add('blink', isBlink);
ESLEnvShortcuts.add('safari', isSafari);
ESLEnvShortcuts.add('safari-ios', isMobileSafari);

declare global {
  export interface ESLLibrary {
    EnvShortcuts: typeof ESLEnvShortcuts;
  }
}

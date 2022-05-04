import {DeviceDetector} from '../../../esl-utils/environment/device-detector';
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
ESLEnvShortcuts.add('touch', DeviceDetector.isTouchDevice);

// Basic device type shortcuts
ESLEnvShortcuts.add('bot', DeviceDetector.isBot);
ESLEnvShortcuts.add('mobile', DeviceDetector.isMobile);
ESLEnvShortcuts.add('desktop', !DeviceDetector.isMobile);
ESLEnvShortcuts.add('android', DeviceDetector.isAndroid);
ESLEnvShortcuts.add('ios', DeviceDetector.isMobileIOS);

// Basic browser shortcuts
ESLEnvShortcuts.add('ie', DeviceDetector.isIE);
ESLEnvShortcuts.add('edge', DeviceDetector.isEdgeHTML);
ESLEnvShortcuts.add('gecko', DeviceDetector.isGecko);
ESLEnvShortcuts.add('webkit', DeviceDetector.isWebkit);
ESLEnvShortcuts.add('blink', DeviceDetector.isBlink);
ESLEnvShortcuts.add('safari', DeviceDetector.isSafari);
ESLEnvShortcuts.add('safari-ios', DeviceDetector.isMobileSafari);

declare global {
  export interface ESLLibrary {
    EnvShortcuts: typeof ESLEnvShortcuts;
  }
}

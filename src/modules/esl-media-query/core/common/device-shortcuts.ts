import {DeviceDetector} from '../../../esl-utils/environment/device-detector';

const shortcuts = new Map<string, string | boolean>();

export class ESLDeviceShortcuts {
  // For debug purposes
  private static readonly _shortcuts = shortcuts;  // TODO: do we need

  public static add(shortcut: string, value: string | boolean) {
    if (!['boolean', 'string'].includes(typeof value)) value = false;
    return shortcuts.set(shortcut.toLowerCase(), value);
  }

  public static remove(shortcut: string) {
    return shortcuts.delete(shortcut.toLowerCase());
  }

  public static replace(match: string) {
    if (shortcuts.has(match)) return shortcuts.get(match);
  }
}

// Touch check
ESLDeviceShortcuts.add('touch', DeviceDetector.isTouchDevice);

// Basic device type shortcuts
ESLDeviceShortcuts.add('bot', DeviceDetector.isBot);
ESLDeviceShortcuts.add('mobile', DeviceDetector.isMobile);
ESLDeviceShortcuts.add('desktop', !DeviceDetector.isMobile);

// Basic browser shortcuts
ESLDeviceShortcuts.add('ie', DeviceDetector.isIE);
ESLDeviceShortcuts.add('edge', DeviceDetector.isEdgeHTML);
ESLDeviceShortcuts.add('gecko', DeviceDetector.isGecko);
ESLDeviceShortcuts.add('blink', DeviceDetector.isBlink);
ESLDeviceShortcuts.add('safari', DeviceDetector.isSafari);

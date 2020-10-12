import {ExportNs} from './export-ns';

const ua = window.navigator.userAgent;
const vendor = window.navigator.vendor;

/**
 * Device detection utility
 * @readonly
 */
@ExportNs('DeviceDetector')
export abstract class DeviceDetector {
  // IE Detection
  public static readonly isTrident = /trident/i.test(ua);
  public static readonly isIE = DeviceDetector.isTrident;

  // Edge Detection
  public static readonly isEdgeHTML = /edg([ea]|ios)/i.test(ua);
  public static readonly isBlinkEdge = /\sedg\//i.test(ua);
  public static readonly isEdge = DeviceDetector.isEdgeHTML || DeviceDetector.isBlinkEdge;

  // Gecko
  public static readonly isGecko = /gecko/i.test(ua) && !/like gecko/i.test(ua);
  public static readonly isFirefox = /firefox|iceweasel|fxios/i.test(ua);

  // Opera / Chrome
  public static readonly isOpera = /(?:^opera.+?version|opr)/.test(ua);
  public static readonly isChrome = !DeviceDetector.isOpera && /google inc/.test(vendor);

  // Webkit
  public static readonly isWebkit = /(apple)?webkit/i.test(ua);

  // Safari
  public static readonly isSafari = DeviceDetector.isWebkit && /^((?!chrome|android).)*safari/i.test(ua);

  // Blink
  public static readonly isBlink = DeviceDetector.isWebkit && !DeviceDetector.isSafari;

  // Bot detection
  public static readonly isBot = /Chrome-Lighthouse|Google Page Speed Insights/i.test(ua);

  // Mobile
  public static readonly isAndroid = /Android/i.test(ua);
  public static readonly isMobileIOS = /iPad|iPhone|iPod/i.test(ua);
  public static readonly isLegacyMobile = /webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  public static readonly isMobile = DeviceDetector.isMobileIOS || DeviceDetector.isAndroid || DeviceDetector.isLegacyMobile;
  public static readonly isMobileSafari = DeviceDetector.isMobileIOS && DeviceDetector.isWebkit && /CriOS/i.test(ua);

  // Touch Detection
  protected static touchMQ = (() => {
    const prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
    const mediaQuery = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
    return matchMedia(mediaQuery);
  })();

  public static get isTouchDevice() {
    if (('ontouchstart' in window) || 'TouchEvent ' in window || 'DocumentTouch' in window && document instanceof Touch) {
      return true;
    }
    return DeviceDetector.touchMQ.matches;
  }

  static get TOUCH_EVENTS() {
    const isTouch = DeviceDetector.isTouchDevice;
    return {
      START: isTouch ? 'touchstart' : 'pointerdown',
      MOVE: isTouch ? 'touchmove' : 'pointermove',
      END: isTouch ? 'touchend' : 'pointerup'
    };
  }
}

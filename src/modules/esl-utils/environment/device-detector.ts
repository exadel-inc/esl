import {ExportNs} from './export-ns';

const {userAgent, vendor, platform} = window.navigator;

/**
 * Device detection utility
 * @readonly
 */
@ExportNs('DeviceDetector')
export abstract class DeviceDetector {
  // IE Detection
  public static readonly isTrident = /trident/i.test(userAgent);
  public static readonly isIE = DeviceDetector.isTrident;

  // Edge Detection
  public static readonly isEdgeHTML = /edg([ea]|ios)/i.test(userAgent);
  public static readonly isBlinkEdge = /\sedg\//i.test(userAgent);
  public static readonly isEdge = DeviceDetector.isEdgeHTML || DeviceDetector.isBlinkEdge;

  // Gecko
  public static readonly isGecko = /gecko/i.test(userAgent) && !/like gecko/i.test(userAgent);
  public static readonly isFirefox = /firefox|iceweasel|fxios/i.test(userAgent);

  // Opera / Chrome
  public static readonly isOpera = /(?:^opera.+?version|opr)/.test(userAgent);
  public static readonly isChrome = !DeviceDetector.isOpera && /google inc/.test(vendor);

  // Webkit
  public static readonly isWebkit = /(apple)?webkit/i.test(userAgent);

  // Safari
  public static readonly isSafari = DeviceDetector.isWebkit && /^((?!chrome|android).)*safari/i.test(userAgent);

  // Blink
  public static readonly isBlink = DeviceDetector.isWebkit && !DeviceDetector.isSafari;

  // Bot detection
  public static readonly isBot = /Chrome-Lighthouse|Google Page Speed Insights/i.test(userAgent);

  // Mobile
  public static readonly isAndroid = /Android/i.test(userAgent);
  public static readonly isMobileIOS13 = /* iOS 13+ detection */ (platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);
  public static readonly isMobileIOS = /iPad|iPhone|iPod/.test(platform) || DeviceDetector.isMobileIOS13;
  public static readonly isLegacyMobile = /webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  public static readonly isMobile = DeviceDetector.isMobileIOS || DeviceDetector.isAndroid || DeviceDetector.isLegacyMobile;
  public static readonly isMobileSafari = DeviceDetector.isMobileIOS && DeviceDetector.isWebkit && /CriOS/i.test(userAgent);

  // Touch Detection
  public static get isTouchDevice() {
    if (window.navigator.maxTouchPoints || window.navigator.msMaxTouchPoints) return true;
    return ('ontouchstart' in window) || ('DocumentTouch' in window && document instanceof Touch);
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

const {userAgent, vendor, platform} = window.navigator;

// IE Detection
export const isTrident = /trident/i.test(userAgent);
export const isIE = isTrident;

// Edge Detection
export const isEdgeHTML = /edg([ea]|ios)/i.test(userAgent);
export const isBlinkEdge = /\sedg\//i.test(userAgent);
export const isEdge = isEdgeHTML || isBlinkEdge;

// Gecko
export const isGecko = /gecko/i.test(userAgent) && !/like gecko/i.test(userAgent);
export const isFirefox = /firefox|iceweasel|fxios/i.test(userAgent);

// Opera / Chrome
export const isOpera = /(?:^opera.+?version|opr)/.test(userAgent);
export const isChrome = !isOpera && /google inc/.test(vendor);

// Webkit
export const isWebkit = /(apple)?webkit/i.test(userAgent);

// Safari
export const isSafari = isWebkit && /^((?!chrome|android).)*safari/i.test(userAgent);

// Blink
export const isBlink = isWebkit && !isSafari;

// Mobile
export const isAndroid = /Android/i.test(userAgent);
export const isMobileIOS13 = /* iOS 13+ detection */ (platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);
export const isMobileIOS = /iPad|iPhone|iPod/.test(platform) || isMobileIOS13;
export const isLegacyMobile = /webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export const isMobile = isMobileIOS || isAndroid || isLegacyMobile;
export const isMobileSafari = isMobileIOS && isWebkit && /CriOS/i.test(userAgent);

// Touch Detection
export const isTouchDevice = ((): boolean => {
  const navApi: any = window.navigator;
  if (navApi.maxTouchPoints || navApi.msMaxTouchPoints) return true;
  return ('ontouchstart' in window) || ('DocumentTouch' in window && document instanceof Touch);
})();

// Hover check
// Note: always true for IE
export const hasHover = !matchMedia('(hover: none)').matches;

/** true if a user prefers to minimize the amount of non-essential motion */
export const isReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

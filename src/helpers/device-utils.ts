const ua = window.navigator.userAgent;

/**
 * Device detection utility
 */
export class DeviceDetector {
	public static readonly isBot = /Chrome-Lighthouse|Google Page Speed Insights/i.test(ua);

	public static readonly isAndroid = /Android/i.test(ua);
	public static readonly isMobileIOS = /iPad|iPhone|iPod/i.test(ua);
	public static readonly isLegacyMobile = /webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

	public static readonly isMobile = DeviceDetector.isMobileIOS || DeviceDetector.isAndroid || DeviceDetector.isLegacyMobile;
	public static readonly isMobileSafari = DeviceDetector.isMobileIOS && /WebKit/i.test(ua) && /CriOS/i.test(ua);

	protected static touchMQ = (() => {
		const prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
		return ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
	})();
	public static get isTouchDevice() {
		// TODO: simplify
		if (('ontouchstart' in window) || 'TouchEvent ' in window || 'DocumentTouch' in window && document instanceof Touch) {
			return true;
		}
		return matchMedia(DeviceDetector.touchMQ).matches;
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

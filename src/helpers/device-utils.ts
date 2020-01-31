const ua = window.navigator.userAgent;

export class DeviceDetector {
	public static isMobile() {
		return DeviceDetector.isMobileIOS() ||
			DeviceDetector.isAndroid() ||
			/webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	}

	public static isMobileIOS() {
		return /iPad|iPhone|iPod/i.test(ua);
	}

	public static isMobileSafari = () => {
		return DeviceDetector.isMobileIOS() && /WebKit/i.test(ua) && /CriOS/i.test(ua);
	};

	public static isAndroid() {
		return /Android/i.test(ua);
	}

	public static isTouchDevice() {
		const prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
		const mq = function (q: string) {
			return window.matchMedia(q).matches;
		};

		if (('ontouchstart' in window) || 'TouchEvent ' in window || 'DocumentTouch' in window && document instanceof Touch) {
			return true;
		}

		const query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
		return mq(query);
		// TODO: compare solutions
		// @ts-ignore
		// return 'ontouchstart' in document.documentElement || navigator.MaxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
	}
}

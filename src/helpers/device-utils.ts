const ua = window.navigator.userAgent;

export class DeviceDetector {

	static isMobile() {
		return DeviceDetector.isMobileIOS() ||
			DeviceDetector.isAndroid() ||
			/webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	}

	static isMobileIOS() {
		return /iPad|iPhone|iPod/i.test(ua);
	}

	static isMobileSafari = () => {
		return DeviceDetector.isMobileIOS() && /WebKit/i.test(ua) && /CriOS/i.test(ua);
	};

	static isAndroid() {
		return /Android/i.test(ua);
	}

	static isTouchDevice() {
		// @ts-ignore
		return 'ontouchstart' in document.documentElement || navigator.MaxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
	}
}
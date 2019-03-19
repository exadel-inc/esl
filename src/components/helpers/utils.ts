 export function defer(fn : Function, time = 10, scope: object = null) {
	let timeout: ReturnType<typeof setTimeout> = null;
	return function () {
		let args = arguments;
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(function () {
			fn.apply(scope, args);
			timeout = null;
		}, time);
	};
}

export function throttle(fn: Function, threshold = 250, scope: object = null) {
	let last: number, deferTimer: ReturnType<typeof setTimeout>;
	return function () {
		let context = scope || this;
		let now = Date.now(), args = arguments;
		if (last && now < last + threshold) {
			// hold on to it
			clearTimeout(deferTimer);
			deferTimer = setTimeout(function () {
				last = now;
				fn.apply(context, args);
			}, threshold);
		} else {
			last = now;
			fn.apply(context, args);
		}
	};
}

interface HandlerMap {
	[propName: string]: Function
}
type TargetElem = HTMLElement & HandlerMap;

export function triggerComponentEvent(target: TargetElem, eventName: string, args: Array<string>) {
	let eventHandlerName = 'on' + eventName,
		eventHandlerAttr = target.getAttribute(eventHandlerName);
	if (eventHandlerAttr) {
		try {
			if (typeof target[eventHandlerName] !== 'function') {
				target[eventHandlerName] = function () { eval(eventHandlerAttr); }; //eslint-disable-line
			}
			target[eventHandlerName].apply(target, args);
		} catch (e) {
			console.log(`Error executing ${target.tagName} ${eventName} hook function.\n ${e}`); //eslint-disable-line
		}
	}
	target.dispatchEvent(new Event(eventName));
}

/**
 * Common function that loads script async
 * @param {String} id - unique script id that used as a marker to prevent feature load
 * @param {String} src - script src (url) to load
 * */
export function loadScript(id: string, src: string) {
	if (!document.getElementById(id)) {
		let tag = document.createElement('script');
		tag.id = id;
		tag.async = true;
		tag.src = src;
		let firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	}
}

/**
 * Generate unique id
 * @returns {String}
 * */
export function generateUId(): string {
	let fp = Date.now().toString(32);
	let sp = Math.round(Math.random() * 1024 * 1024).toString(32);
	return fp + '-' + sp;
}

export interface LanguageCode {
	lang: string,
	code: string
}
/**
 * get page language code
 * @returns {Object}
 * */
export function getPageLanguageCode(): LanguageCode {
	const lang = (document.documentElement.lang || 'en').toLowerCase();
	const metaCountry = document.querySelector('meta[name="target_country"]');
	const country = (metaCountry && metaCountry.getAttribute('content') || 'us').toLowerCase();
	return {lang: lang, code: lang + '-' + country};
}

export const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

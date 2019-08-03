/**
 * Common function that loads script async
 * @param {String} id - unique script id that used as a marker to prevent feature load
 * @param {String} src - script src (url) to load
 */
export function loadScript(id: string, src: string) {
	if (!document.getElementById(id)) {
		const tag = document.createElement('script');
		tag.id = id;
		tag.async = true;
		tag.src = src;
		const firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	}
}

/**
 * Generate unique id
 * @returns {String}
 */
export function generateUId(): string {
	const fp = Date.now().toString(32);
	const sp = Math.round(Math.random() * 1024 * 1024).toString(32);
	return fp + '-' + sp;
}

if (!Object.is) {
	Object.is = function(x, y) {
		// SameValue algorithm
		if (x === y) { // Steps 1-5, 7-10
			// Steps 6.b-6.e: +0 != -0
			return x !== 0 || 1 / x === 1 / y;
		} else {
			// Step 6.a: NaN == NaN
			return x !== x && y !== y;
		}
	};
}

/**
 * Deep compare
 * */
export function deepCompare(obj1: any, obj2: any) : boolean {
	if (Object.is(obj1, obj2)) return true;
	if (typeof obj1 !== typeof obj1) return false;
	if (typeof obj1 === 'object') {
		const keys1 = Object.keys(obj1);
		const keys2 = Object.keys(obj2);
		if (keys1.length !== keys2.length) return false;
		return !keys1.some((key) => !deepCompare(obj1[key], obj2[key]));
	}
	return false;
}

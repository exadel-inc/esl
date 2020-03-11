/**
 * Common function that loads script async
 * @param {String} id - unique script id that used as a marker to prevent feature load
 * @param {String} src - script src (url) to load
 */
export function loadScript(id: string, src: string): Promise<Event> {
	return new Promise((resolve, reject) => {
		if (document.getElementById(id)) {
			resolve();
			return;
		}
		const tag = document.createElement('script');
		tag.id = id;
		tag.async = true;
		tag.onload = resolve;
		tag.onerror = reject;
		tag.src = src;
		const firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	});
}

/**
 * Generate unique id
 * @returns {String} - random id
 */
export function generateUId(): string {
	const fp = Date.now().toString(32);
	const sp = Math.round(Math.random() * 1024 * 1024).toString(32);
	return fp + '-' + sp;
}

/**
 * Deep compare
 */
export function deepCompare(obj1: any, obj2: any): boolean {
	if (Object.is(obj1, obj2)) return true;
	if (typeof obj1 !== typeof obj2) return false;
	if (typeof obj1 === 'object') {
		const keys1 = Object.keys(obj1);
		const keys2 = Object.keys(obj2);
		if (keys1.length !== keys2.length) return false;
		return !keys1.some((key) => !deepCompare(obj1[key], obj2[key]));
	}
	return false;
}

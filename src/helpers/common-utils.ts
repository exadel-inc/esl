/**
 * Creates new async script tag by id and src
 */
const createAsyncScript = (id: string, src: string) => {
	const script = document.createElement('script');
	script.id = id;
	script.async = true;
	script.src = src;
	return script;
};

/**
 * Common function that loads script async
 * @param {string} id - unique script id that is used as a marker to prevent future load
 * @param {string} src - script src (url) to load
 */
export function loadScript(id: string, src: string): Promise<Event> {
	return new Promise((resolve, reject) => {
		const script: HTMLScriptElement =
			(document.getElementById(id) || createAsyncScript(id, src)) as HTMLScriptElement;
		const state = script.getAttribute('state');

		switch (state) {
			case 'success': resolve(); break;
			case 'error': reject(); break;
			default:
				script.addEventListener('load', () => {
					script.setAttribute('state', 'success');
					resolve();
				});
				script.addEventListener('error', () => {
					script.setAttribute('state', 'error');
					reject();
				});
		}
		if (!script.parentNode) {
			const firstScriptTag = document.querySelector('script') ||
				document.querySelector('head title');
			firstScriptTag.parentNode.insertBefore(script, firstScriptTag);
		}
	});
}

/**
 * Generate unique id
 * @returns {string} - random id
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

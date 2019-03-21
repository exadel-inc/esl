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

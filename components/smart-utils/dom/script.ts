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

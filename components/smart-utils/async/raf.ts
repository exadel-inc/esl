/**
 * Postpone action after next render
 * @param {function} callback
 */
export const afterNextRender = (callback: () => void) => requestAnimationFrame(() => requestAnimationFrame(callback));

/**
 * Decorate function to schedule execution after next render
 * @param {function} fn
 * @returns {function} - decorated function
 */

export const rafDecorator = (fn: Function) => {
	let rafScheduled = false;
	return function (...args: any) {
		if (!rafScheduled) {
			requestAnimationFrame(() => {
				fn.call(this, ...args);
				rafScheduled = false;
			});
		}
		rafScheduled = true;
	};
};

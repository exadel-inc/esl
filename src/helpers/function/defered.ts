/**
 * CallableSubject is a {Function} that can be lisened to continue execution
 */
export interface CallableSubject extends Function {
	requested: boolean;

	then(cb: Function, invokeIfNoDeferred?: boolean): CallableSubject;
}

/**
 * Creates a debounced function that implements {@link CallableSubject}.
 * Debounced function delays invoking func until after wait milliseconds have elapsed
 * since the last time the debounced function was invoked.
 * The func is invoked with the last arguments provided to the debounced function.
 * @param fn
 * @param [wait]
 * @returns {Function}
 */
export function deferred<T extends Function>(fn: T, wait = 10): (T & CallableSubject) {
	let timeout: ReturnType<typeof setTimeout> = null;
	const observers: Set<Function> = new Set();

	function callableDeferedSubject(...args: any[]) {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			timeout = null;
			fn.apply(this, args);
			observers.forEach((cb) => cb());
			observers.clear();
		}, wait);
	}

	Object.defineProperty(callableDeferedSubject, 'requested', {
		get: () => timeout !== null
	});
	Object.defineProperty(callableDeferedSubject, 'then', {
		value: (cb: Function, invokeIfNoDeferred = false) => {
			(invokeIfNoDeferred && timeout === null) ? cb() : observers.add(cb);
			return callableDeferedSubject;
		}
	});
	return callableDeferedSubject as any as (T & CallableSubject);
}
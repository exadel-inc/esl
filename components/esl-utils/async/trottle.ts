import type {AnyToVoidFnSignature} from '../misc/functions';

/**
 * Creates a throttled executed function.
 * The func is invoked with the last arguments provided to the throttled function.
 * @param fn
 * @param threshold - indicates how often function could be called
 * @returns {Function}
 */
export function throttle<T extends AnyToVoidFnSignature>(fn: T, threshold = 250): T {
	let last: number;
	let deferTimer: ReturnType<typeof setTimeout>;
	return function (...args: any[]) {
		const now = Date.now();
		if (last && now < last + threshold) {
			// hold on to it
			clearTimeout(deferTimer);
			deferTimer = setTimeout(() => {
				last = now;
				fn.apply(this, args);
			}, threshold);
		} else {
			last = now;
			fn.apply(this, args);
		}
	} as T;
}
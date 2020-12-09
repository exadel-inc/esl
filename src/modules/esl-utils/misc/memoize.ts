import {AnyToAnyFnSignature} from './functions';

/**
 * Memoization decorator function
 */
export function memoizeFn(fn: AnyToAnyFnSignature, hashFn: MemoHashFn = defaultArgsHashFn) {
	function memo(...args: any[]): any {
		const key = hashFn(...args);
		if (key !== null && typeof key !== 'string') {
			console.warn(`Can't cache value for ${fn.name} call, make sure that your pass correct hash function for that.`);
			return fn.apply(this, args);
		}
		if (!memo.cache.has(key)) {
			memo.cache.set(key, fn.apply(this, args));
		}
		return memo.cache.get(key);
	}

	memo.cache = new Map();
	memo.clear = () => memo.cache.clear();
	return memo;
}

export type MemoHashFn = (...args: any[]) => undefined | null | string;

/**
 * Default argument hash.
 * Supports only 0-1 arguments function with a primitive argument type.
 */
export function defaultArgsHashFn(...args: any[]) {
	if (args.length === 0) return null;
	if (args.length > 1) return;
	if (typeof args[0] !== 'string' && typeof args[0] !== 'number' && typeof args[0] !== 'boolean') return;
	return String(args[0]);
}

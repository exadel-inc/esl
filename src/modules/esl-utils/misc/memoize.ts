import type {AnyToAnyFnSignature} from './functions';

/** Memoized function type */
export type MemoizedFn<T extends AnyToAnyFnSignature> = T & {
  /** Cache instance */
  cache: Map<null | string, ReturnType<T>>;
  /** Clear memoization cache */
  clear: () => void;
  /** Check existence of cache for passed params */
  has: (...params: Parameters<T>) => boolean;
};

/**
 * Memoization decorator function. Caches the original function result according to hash generated from arguments.
 * In case the hash function returns `undefined` value will not be memoized.
 * @see MemoHashFn Hash function signature.
 */
export function memoizeFn<F extends AnyToAnyFnSignature>(fn: F, hashFn: MemoHashFn<F> = defaultArgsHashFn): MemoizedFn<F> {
  function memo(...args: Parameters<F>): any {
    const key = hashFn(...args);
    if (key !== null && typeof key !== 'string') {
      console.warn(`[ESL]: Can't cache value for ${fn.name} call.`);
      return fn.apply(this, args);
    }
    if (!memo.cache.has(key)) {
      memo.cache.set(key, fn.apply(this, args));
    }
    return memo.cache.get(key);
  }

  memo.cache = new Map<null | string, ReturnType<F>>();
  memo.clear = (): void => memo.cache.clear();
  memo.has = (...args: Parameters<F>): boolean => {
    const key = hashFn(...args);
    return key === undefined ? false : memo.cache.has(key);
  };
  return memo as MemoizedFn<F>;
}

/**
 * Describe abstract memoization hash function. Memoization should have the same or compatible signature as the decorated function.
 * Hash function can return string or null as a hash result. Note: null is correct hash for arguments!
 * If the result is `undefined` - it means that the hash can not be generated.
 */
export type MemoHashFn<F extends AnyToAnyFnSignature = AnyToAnyFnSignature> = (...args: Parameters<F>) => undefined | null | string;

/**
 * Default arguments hash function.
 * Supports only 0-1 arguments with a primitive type.
 */
export function defaultArgsHashFn(...args: any[]): string | null | undefined {
  if (args.length === 0) return null;
  if (args.length > 1) return;
  if (typeof args[0] !== 'string' && typeof args[0] !== 'number' && typeof args[0] !== 'boolean') return;
  return String(args[0]);
}

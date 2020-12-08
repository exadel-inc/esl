/**
 * Function that do nothing
 */
export const noop = (...args: any[]): void => undefined;

/**
 * Function that return first argument
 */
export const identity = <T>(arg: T): T => arg;

export type NoopFnSignature = () => void;

export type AnyToVoidFnSignature = (...args: any[]) => void;

export type AnyToAnyFnSignature = (...args: any[]) => any;

export type MethodTypedDecorator<T> = (target: any, property: string, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void;

/**
 * Find the first defined param
 */
export function defined<T>(...params: T[]) {
  for (const param of params) {
    if (param !== undefined) return param;
  }
}

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
// TODO: discuss basic support for multiple
export function defaultArgsHashFn(...args: any[]) {
  if (args.length === 0) return null;
  if (args.length > 1) return;
  if (typeof args[0] !== 'string' && typeof args[0] !== 'number' && typeof args[0] !== 'boolean') return;
  return String(args[0]);
}

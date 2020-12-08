import {getPropertyDescriptor} from '../misc/object';
import {AnyToAnyFnSignature} from '../misc/functions';

export function memoize(target: object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
  if (typeof descriptor.value === 'function') {
    descriptor.value = memoizeFn(descriptor.value);
  } else if (typeof descriptor.get === 'function') {
    descriptor.get = memoizeFn(descriptor.get);
  } else {
    throw new TypeError('Only get accessors or class methods can be decorated via @memoize');
  }
}
memoize.clear = function (target: any, name: string) {
  let clearFn = null;
  const desc = getPropertyDescriptor(target, name);
  if (desc && typeof desc.value === 'function') clearFn = desc.value.clear;
  if (desc && typeof desc.get === 'function') clearFn = (desc.get as any).clear;
  (typeof clearFn === 'function') && clearFn();
};

export function memoizeFn(fn: AnyToAnyFnSignature, hashFn: MemoHashFn = defaultHashFn) {
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
function defaultHashFn(...args: any[]) {
  if (args.length === 0) return null;
  if (args.length > 1) return;
  if (typeof args[0] !== 'string' && typeof args[0] !== 'number' && typeof args[0] !== 'boolean') return;
  return String(args[0]);
}

import {getPropertyDescriptor} from '../misc/object';
import {defaultArgsHashFn, memoizeFn} from '../misc/memoize';
import type {MemoHashFn} from '../misc/memoize';
import type {MethodTypedDecorator} from '../misc/functions';


export function memoize(): MethodDecorator;
export function memoize<H extends MemoHashFn>(hashFn: H): MethodTypedDecorator<(...args: Parameters<H>) => any>;
/**
 * Memoization decorator helper.
 * @see memoizeFn Original memoizeFn function decorator.
 */
export function memoize(hashFn: MemoHashFn = defaultArgsHashFn) {
  return function (target: any, prop: string, descriptor: TypedPropertyDescriptor<any>) {
    const isPrototype = Object.hasOwnProperty.call(target, 'constructor');
    if (descriptor && typeof descriptor.value === 'function') {
      descriptor.value = isPrototype ?
        memoizeMember(descriptor.value, prop, false, hashFn) :
        memoizeFn(descriptor.value, hashFn);
    } else if (descriptor && typeof descriptor.get === 'function') {
      descriptor.get = isPrototype ?
        memoizeMember(descriptor.get, prop, true, hashFn) :
        memoizeFn(descriptor.get, hashFn);
    } else {
      throw new TypeError('Only get accessors or class methods can be decorated via @memoize');
    }
  };
}

// Lock storage to prevent cache logic for some key
const locks = new WeakMap();

/** Cache memo function in the current context on call */
function memoizeMember(originalMethod: any, prop: string, isGetter: boolean, hashFn: MemoHashFn) {
  return function (this: any, ...args: any[]): any {
    if (locks.get(this) === prop) return originalMethod;
    const memo = memoizeFn(originalMethod, hashFn);
    locks.set(this, prop); // IE try to get key with the prototype instance call, so we lock it
    Object.defineProperty(this, prop, isGetter ? {get: memo} : {value: memo});
    locks.delete(this); // Free property key
    return memo.apply(this, args);
  };
}

/**
 * Clear memoization cache for passed target and property.
 * Accepts not own properties.
 */
memoize.clear = function (target: any, property: string) {
  let clearFn = null;
  const desc = getPropertyDescriptor(target, property);
  if (desc && typeof desc.value === 'function') clearFn = desc.value.clear;
  if (desc && typeof desc.get === 'function') clearFn = (desc.get as any).clear;
  (typeof clearFn === 'function') && clearFn();
};

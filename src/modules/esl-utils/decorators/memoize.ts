import {defaultArgsHashFn, memoizeFn} from '../misc/memoize';
import {isPrototype, getPropertyDescriptor} from '../misc/object';

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
    if (!descriptor || typeof (descriptor.value || descriptor.get) !== 'function') {
      throw new TypeError('Only get accessors or class methods can be decorated via @memoize');
    }

    if (isPrototype(target)) {
      // Object members
      (typeof descriptor.get === 'function') && (descriptor.get = memoizeGetter(descriptor.get, prop));
      (typeof descriptor.value === 'function') && (descriptor.value = memoizeMethod(descriptor.value, prop, hashFn));
    } else {
      // Static members
      (typeof descriptor.get === 'function') && (descriptor.get = memoizeFn(descriptor.get));
      (typeof descriptor.value === 'function') && (descriptor.value = memoizeFn(descriptor.value, hashFn));
    }
  };
}

// Lock storage to prevent cache logic for some key
const locks = new WeakMap();
const defineOwnKeySafe = (obj: any, prop: string, value: any) => {
  locks.set(obj, prop); // IE try to get key with the prototype instance call, so we lock it
  Object.defineProperty(obj, prop, {value, writable: true, configurable: true});
  locks.delete(obj); // Free property key
};

/** Cache getter result as an object own property */
function memoizeGetter(originalMethod: any, prop: string) {
  return function (this: any, ...args: any[]): any {
    if (locks.get(this) === prop) return originalMethod;
    const value = originalMethod.call(this);
    defineOwnKeySafe(this, prop, value);
    return value;
  };
}

/** Cache method memo function in the current context on call */
function memoizeMethod(originalMethod: any, prop: string, hashFn: MemoHashFn) {
  return function (this: any, ...args: any[]): any {
    if (locks.get(this) === prop) return originalMethod;
    const memo = memoizeFn(originalMethod, hashFn);
    defineOwnKeySafe(this, prop, memo);
    return memo.apply(this, args);
  };
}

/**
 * Clear memoization cache for passed target and property.
 * Accepts not own properties.
 * Note: be sure that you targeting memoized property or function.
 * Clear utility has no 100% check to prevent modifying incorrect (not memoized) property keys
 */
memoize.clear = function (target: any, property: string) {
  const desc = getPropertyDescriptor(target, property);
  if (!desc) return;
  if (typeof desc.get === 'function' && typeof (desc.get as any).clear === 'function') return (desc.get as any).clear();
  if (typeof desc.value === 'function' && typeof desc.value.clear === 'function') return desc.value.clear();
  if (Object.hasOwnProperty.call(target, property)) delete target[property];
};

/** Check if property has cache for the passed params */
memoize.has = function (target: any, property: string, ...params: any[]) {
  const desc = getPropertyDescriptor(target, property);
  if (!desc) return false;
  if (typeof desc.get === 'function' && typeof (desc.get as any).has === 'function') return (desc.get as any).has(...params);
  if (typeof desc.value === 'function' && typeof desc.value.has === 'function') return desc.value.has(...params);
  return Object.hasOwnProperty.call(target, property);
};

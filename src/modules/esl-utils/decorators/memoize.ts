import {getPropertyDescriptor} from '../misc/object';
import {MethodTypedDecorator} from '../misc/functions';
import {defaultArgsHashFn, MemoHashFn, memoizeFn} from '../misc/memoize';

export function memoize(): MethodDecorator;
export function memoize<H extends MemoHashFn>(hashFn: H): MethodTypedDecorator<(...args: Parameters<H>) => any>;
/**
 * Memoization decorator helper.
 * @see memoizeFn Original memoizeFn function decorator.
 */
export function memoize(hashFn: MemoHashFn = defaultArgsHashFn) {
  return function (target: any, prop: string, descriptor: TypedPropertyDescriptor<any>) {
    if (descriptor && typeof descriptor.value === 'function') {
      descriptor.value = memoizeFn(descriptor.value, hashFn);
    } else if (descriptor && typeof descriptor.get === 'function') {
      descriptor.get = memoizeFn(descriptor.get, hashFn);
    } else {
      throw new TypeError('Only get accessors or class methods can be decorated via @memoize');
    }
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

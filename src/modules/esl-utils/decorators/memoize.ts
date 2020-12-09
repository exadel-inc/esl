import {getPropertyDescriptor} from '../misc/object';
import {MethodTypedDecorator} from '../misc/functions';
import {defaultArgsHashFn, MemoHashFn, memoizeFn} from '../misc/memoize';

export function memoize(): PropertyDecorator | MethodDecorator;
export function memoize<H extends MemoHashFn>(hashFn: H): MethodTypedDecorator<(...args: Parameters<H>) => any>;
export function memoize(hashFn: MemoHashFn = defaultArgsHashFn) {
  return function (target: any, prop: string, descriptor: TypedPropertyDescriptor<any>) {
    if (typeof descriptor.value === 'function') {
      descriptor.value = memoizeFn(descriptor.value, hashFn);
    } else if (typeof descriptor.get === 'function') {
      descriptor.get = memoizeFn(descriptor.get, hashFn);
    } else {
      throw new TypeError('Only get accessors or class methods can be decorated via @memoize');
    }
  };
}

memoize.clear = function (target: any, name: string) {
  let clearFn = null;
  const desc = getPropertyDescriptor(target, name);
  if (desc && typeof desc.value === 'function') clearFn = desc.value.clear;
  if (desc && typeof desc.get === 'function') clearFn = (desc.get as any).clear;
  (typeof clearFn === 'function') && clearFn();
};

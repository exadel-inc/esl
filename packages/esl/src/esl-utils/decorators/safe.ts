import {resolveProperty} from '../misc/functions';
import type {ValueOrProvider, AnyToAnyFnSignature} from '../misc/functions';

/**
 * `@safe` decorator: wraps a method or getter in try/catch and returns a fallback value on synchronous error.
 * - Supports static or provider fallback (ValueOrProvider)
 * - Invokes instance hook `$$error(error, name, original)` before returning fallback
 * - Only handles synchronous throws (async rejections pass through)
 *
 * @param fallback - value or provider used when the original function throws (default: null)
 * @throws Error when applied to a non-function / non-getter
 */
export function safe<R>(fallback: ValueOrProvider<R>): (
  target: any,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<R> | TypedPropertyDescriptor<(...args: any[]) => R>
) => void;
export function safe(): MethodDecorator & PropertyDecorator; // no-fallback variant (fallback defaults to null)
/** Implementation */
export function safe(fallback?: ValueOrProvider<any>): MethodDecorator & PropertyDecorator {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor | void {
    const originalMethod: AnyToAnyFnSignature | undefined = descriptor.value || descriptor.get;
    if (typeof originalMethod !== 'function') throw new Error('@safe can only be applied to methods or getters');
    const isGetter = !!descriptor.get && !descriptor.value;
    const wrappedMethod = function (this: any, ...args: any[]): any {
      try {
        return originalMethod.apply(this, args);
      } catch (error) {
        if (typeof this.$$error === 'function') this.$$error(error, propertyKey);
        return resolveProperty(fallback, this);
      }
    } as AnyToAnyFnSignature;

    if (isGetter) {
      descriptor.get = wrappedMethod;
    } else {
      descriptor.value = wrappedMethod;
    }
    return descriptor;
  } as MethodDecorator & PropertyDecorator;
}

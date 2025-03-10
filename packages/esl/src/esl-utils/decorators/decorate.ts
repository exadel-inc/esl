import {getPropertyDescriptor} from '../misc/object/utils';
import type {AnyToAnyFnSignature} from '../misc/functions';

/**
 * Common TS decorator to apply decorator function
 * (like {@link debounce}, {@link throttle}, {@link rafDecorator})
 * to the class method
 * @param decorator - function decorator, should accept decorated method as first argument
 * @param args - additional arguments to pass into `decorator`
 */
export function decorate<Args extends any[], Fn extends AnyToAnyFnSignature>(
  decorator: (fn: Fn, ...params: Args) => Fn,
  ...args: Args
) {
  return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<Fn>): TypedPropertyDescriptor<Fn> {
    if (!descriptor || typeof descriptor.value !== 'function') {
      throw new TypeError('Only class methods can be decorated');
    }

    const originalFn: Fn = descriptor.value;

    return descriptor = {
      enumerable: descriptor.enumerable,
      configurable: true,

      get: function getBound(): Fn {
        // Skip own properties
        const proto = Object.getPrototypeOf(this);
        // Find the closest descriptor for property
        const desc = getPropertyDescriptor(proto, propertyKey);
        // Return original function in case of prototype or super call
        if (!desc || desc.get !== getBound) return originalFn;
        // Create a new decorated instance of function
        const decoratedFn = decorator(originalFn.bind(this), ...args);
        // Copy original function own keys
        Object.assign(decoratedFn, originalFn);
        // Defines own property with the decorated instance
        return this[propertyKey] = decoratedFn;
      },
      set(value: Fn): void {
        Object.defineProperty(this, propertyKey, {
          value,
          writable: true,
          configurable: true,
          enumerable: descriptor.enumerable
        });
      }
    };
  };
}

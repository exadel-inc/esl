import {getPropertyDescriptor} from '../misc/object/utils';
import type {AnyToAnyFnSignature} from '../misc/functions';

/**
 * `@decorate` decorator: adapts a higher-order function `(fn) => wrappedFn` into a lazy method decorator.
 * - Applies only to class (prototype or static) methods (value descriptors)
 * - First instance access: binds original to `this`, passes it to `decorator(...args)`, caches wrapped fn on the instance
 * - Prototype (or super) access returns the original unwrapped function
 * - Reassignment replaces accessor with a normal writable value (no further wrapping)
 * - Copy of original own enumerable properties is assigned to the wrapped function
 *
 * @param decorator - higher‑order function receiving the bound original method
 * @param args - extra arguments forwarded to `decorator` after the original function
 * @throws TypeError when applied to a non-method (accessor / field)
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
        // Create a new decorated instance of function (original first bound to instance)
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

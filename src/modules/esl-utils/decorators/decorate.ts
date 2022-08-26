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

    return {
      enumerable: descriptor.enumerable,
      configurable: true,

      get(): Fn {
        if (!Object.hasOwnProperty.call(this, propertyKey)) {
          return this[propertyKey] = decorator(originalFn, ...args);
        }
        return originalFn;
      },
      set(value: Fn): void {
        Object.defineProperty(this, propertyKey, {
          value,
          writable: descriptor.writable,
          enumerable: descriptor.enumerable,
          configurable: true,
        });
      }
    };
  };
}

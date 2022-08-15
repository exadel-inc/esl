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
  return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<Fn>): void {
    if (!descriptor || typeof descriptor.value !== 'function') {
      throw new TypeError('Only class methods can be decorated');
    }
    const originalFn: Fn = descriptor.value;
    descriptor.value = function BindDecoration(...selfArgs: Parameters<Fn>): ReturnType<Fn> {
      const value: Fn = decorator(originalFn, ...args);
      Object.defineProperty(this, propertyKey, {value, writable: true, configurable: true});
      return value.apply(this, selfArgs);
    } as Fn;
  };
}

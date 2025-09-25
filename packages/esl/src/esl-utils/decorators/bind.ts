import {getPropertyDescriptor} from '../misc/object/utils';

/**
 * `@bind` decorator: lazily binds a class prototype method to its instance (`this`).
 * - Lazy one-time binding performed on first instance access
 * - Access via prototype returns the original (unbound) function
 * - Caches bound function on the instance (no further getter overhead)
 * - Only applicable to plain prototype methods (not accessors / fields)
 * - Reassignment installs the new function as a normal writable value (no rebinding logic)
 * - Preserves original enumerability; descriptor remains configurable
 *
 * @throws TypeError when applied to a non-method
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function bind<Fn extends Function>(target: object,
                                          propertyKey: string,
                                          descriptor: TypedPropertyDescriptor<Fn>): TypedPropertyDescriptor<Fn> {
  // Validation check
  if (!descriptor || (typeof descriptor.value !== 'function')) {
    throw new TypeError('Only class methods can be decorated via @bind');
  }
  // Original function
  const originalFn = descriptor.value;

  return descriptor = {
    enumerable: descriptor.enumerable,
    configurable: true,

    get: function getBound(): Fn {
      const proto = Object.getPrototypeOf(this);
      const desc = getPropertyDescriptor(proto, propertyKey);
      const isProtoCall = !desc || desc.get !== getBound;
      return isProtoCall ? originalFn : (this[propertyKey] = originalFn.bind(this));
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
}

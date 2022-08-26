/** Decorator "bind" allows to bind prototype method context to class instance */
// eslint-disable-next-line @typescript-eslint/ban-types
export function bind<Fn extends Function>(target: object,
                                          propertyKey: string,
                                          descriptor: TypedPropertyDescriptor<Fn>): TypedPropertyDescriptor<Fn> {
  // Validation check
  if (!descriptor || (typeof descriptor.value !== 'function')) {
    throw new TypeError('Only class methods can be decorated via @bind');
  }
  // Original function
  const originalFn = descriptor.value;

  return {
    enumerable: descriptor.enumerable,
    configurable: true,

    get(): Fn {
      if (!Object.hasOwnProperty.call(this, propertyKey)) {
        return this[propertyKey] = originalFn.bind(this);
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
}

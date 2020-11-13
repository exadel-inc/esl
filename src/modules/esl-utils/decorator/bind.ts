const BINDING_STORE_KEY = '__fnBindings';
// eslint-disable-next-line @typescript-eslint/ban-types
export function bind<T extends Function>(target: object,
                                         propertyKey: string,
                                         descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> {
  // Validation check
  if (!descriptor || (typeof descriptor.value !== 'function')) {
    throw new TypeError(`${propertyKey} is not a function. Only class methods can be decorated via @bind`);
  }
  // Original function
  const fn = descriptor.value;

  return {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,

    get() {
      // Accessing via prototype returns original function
      if (this === target) {
        return fn;
      }

      // If object have own definition then it has priority
      if (Object.prototype.hasOwnProperty.call(this, propertyKey)) {
        return this[propertyKey];
      }

      // Bounded functions store
      let binding = this[BINDING_STORE_KEY];
      if (!binding) {
        binding = this[BINDING_STORE_KEY] = new WeakMap<T, T>();
      }

      // Store binding if it's not exist
      if (!binding.has(fn)) {
        binding.set(fn, fn.bind(this));
      }

      // Return binding
      return binding.get(fn);
    },
    set(value: T) {
      Object.defineProperty(this, propertyKey, {
        writable: true,
        enumerable: false,
        configurable: true,
        value
      });
    }
  };
}

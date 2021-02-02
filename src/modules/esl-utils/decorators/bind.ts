const BINDINGS_STORE_KEY = '__fnBindings';
/** Decorator "bind" allows to bind prototype method context to class instance */
// eslint-disable-next-line @typescript-eslint/ban-types
export function bind<T extends Function>(target: object,
                                         propertyKey: string,
                                         descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> {
  // Validation check
  if (!descriptor || (typeof descriptor.value !== 'function')) {
    throw new TypeError('Only class methods can be decorated via @bind');
  }
  // Original function
  const fn = descriptor.value;

  return {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,

    get() {
      // Accessing via prototype returns original function
      // If the constructor property is in the context then it's not an instance
      if (!this || this === target || Object.hasOwnProperty.call(this, 'constructor')) {
        return fn;
      }

      // Bounded functions store
      let bindings = this[BINDINGS_STORE_KEY];
      if (!bindings) {
        bindings = this[BINDINGS_STORE_KEY] = new WeakMap<T, T>();
      }

      // Store binding if it does not exist
      if (!bindings.has(fn)) {
        bindings.set(fn, fn.bind(this));
      }

      // Return binding
      return bindings.get(fn);
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

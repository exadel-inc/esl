import type {PropertyProvider, ValueOrProvider} from '../misc/functions';

/** Property configuration */
export type OverrideDecoratorConfig = {
  /** To define readonly property */
  readonly?: boolean;
  /** To define enumerable property */
  enumerable?: boolean;
};

/** Builds getter from provider */
function getter<T>(provider: PropertyProvider<T>) {
  return function (this: any): T {
    return provider.call(this, this);
  };
}

/** Builds own property setter */
function setter(name: string, readonly?: boolean) {
  if (readonly) return (): void => void 0;
  return function (value: any): void {
    Object.defineProperty(this, name, {
      value,
      writable: true,
      configurable: true
    });
  };
}

/**
 * `@prop` decorator: defines a prototype-level property (value or computed via provider) with optional flags.
 * - Static value: defined on prototype (writable unless `readonly`)
 * - Provider function: installed as getter; each access invokes provider with `(this)`; optional setter creates own value
 * - Readonly: setter becomes no-op (provider case) or value made non-writable (static case)
 * - Enumerable flag passed through
 * - Throws if attempting to decorate an already own property on the prototype object
 *
 * @param value - static value or provider function producing the value per access
 * @param prototypeConfig - configuration object with optional `readonly` and `enumerable` flags
 */
export function prop<T = any>(value?: ValueOrProvider<T>, prototypeConfig: OverrideDecoratorConfig = {}) {
  return function (obj: any, name: string): any {
    if (Object.hasOwnProperty.call(obj, name)) {
      throw new TypeError('Can\'t override own property');
    }
    if (typeof value === 'function') {
      Object.defineProperty(obj, name, {
        get: getter(value as PropertyProvider<any>),
        set: setter(name, prototypeConfig.readonly),
        enumerable: prototypeConfig.enumerable,
        configurable: true
      });
    } else {
      Object.defineProperty(obj, name, {
        value,
        writable: !prototypeConfig.readonly,
        enumerable:  prototypeConfig.enumerable,
        configurable: true
      });
    }
    return {/* To make babel transpiler work */};
  };
}

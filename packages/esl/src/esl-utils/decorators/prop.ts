import type {PropertyProvider} from '../misc/functions';

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
 * `@prop` is auxiliary decorator to define a field on the prototype level.
 *` @prop` can be used to override decorated property from the parent level
 *
 * You can also use an @override decorator in combination with ECMA Script class property definition:
 * `@prop() public field: any = initial value;`
 *
 * The class property initial value is a part of object creation, so it goes to the object itself,
 * while the @override value is defined on the prototype level.
 *
 * If the value is a provider function, it will be resolved via instance each time property accessed.
 *
 * @param value - value or PropertyProvider to set up in prototype
 * @param prototypeConfig - prototype property configuration
 */
export function prop<T = any>(value?: T | PropertyProvider<T>, prototypeConfig: OverrideDecoratorConfig = {}) {
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

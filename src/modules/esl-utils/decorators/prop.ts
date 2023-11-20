/** Property configuration */
export type OverrideDecoratorConfig = {
  /** To define enumerable property */
  enumerable?: boolean;
  /** To define readonly property */
  readonly?: boolean;
};

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
 * @param value - value to setup in prototype
 * @param prototypeConfig - prototype property configuration
 */
export function prop(value?: any, prototypeConfig: OverrideDecoratorConfig = {}) {
  return function (obj: any, name: string): any {
    if (Object.hasOwnProperty.call(obj, name)) {
      throw new TypeError('Can\'t override own property');
    }
    Object.defineProperty(obj, name, {
      value,
      writable: !prototypeConfig.readonly,
      enumerable:  !prototypeConfig.enumerable,
      configurable: true
    });
    return {};
  };
}

/** Property configuration */
export type OverrideDecoratorConfig = {
  /** Value to set in the prototype */
  value?: any;
  /** To define mutable property */
  readonly?: false;
} | {
  /** Value to set in the prototype */
  value: any;
  /** To define readonly property */
  readonly: true;
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
 * @param prototypeConfig - prototype property configuration
 */
export function prop(prototypeConfig: OverrideDecoratorConfig = {}) {
  return function (obj: any, name: string): void {
    if (Object.hasOwnProperty.call(obj, name)) {
      throw new TypeError('Can\'t override own property');
    }
    Object.defineProperty(obj, name, {
      value: prototypeConfig.value,
      writable: !prototypeConfig.readonly,
      enumerable: true,
      configurable: true
    });
  };
}

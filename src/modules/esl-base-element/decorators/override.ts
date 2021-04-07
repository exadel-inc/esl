/**
 * `@override` is auxiliary decorator to override field that decorated in the parent class.
 *
 *  Typically used to override {@link attr}, {@link boolAttr}, etc
 *
 *  @param [value] - initial property value
 *  @param [readonly] - make a non writable constant
 */
export function override(value: any = undefined, readonly = false) {
  return function (obj: any, name: string): void {
    if (Object.hasOwnProperty.call(obj, name)) {
      throw new TypeError('Can\'t override own property');
    }
    Object.defineProperty(obj, name, {value, enumerable: true, writable: !readonly});
  };
}

/**
 * @deprecated This decorator is deprecated use {@link property} decorator instead.
 *
 * `@override` is auxiliary decorator to override a field that is decorated in the parent class.
 * The override _value_ is always defined on the object prototype level.
 *
 * You can also use an @override decorator in combination with ECMA Script class property definition:
 *  `@override public field: any = initial value;`
 *
 * The class property initial value is a part of object creation, so it goes to the object itself,
 * while the @override value is defined on the prototype level.
 *
 *  @param value - initial property value
 */
export function override(value: any = undefined) {
  return function (obj: any, name: string): void {
    if (Object.hasOwnProperty.call(obj, name)) {
      throw new TypeError('Can\'t override own property');
    }
    Object.defineProperty(obj, name, {value, enumerable: true, writable: true});
  };
}

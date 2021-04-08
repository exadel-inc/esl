/**
 * `@readonly` is auxiliary decorator to create a readonly field on prototype level.
 *
 *  @param value - property value
 *  @param [silent] - to not throw error on setting value
 */
export function readonly(value: any, silent = false) {
  return function (obj: any, name: string): void {
    if (Object.hasOwnProperty.call(obj, name)) {
      throw new TypeError('Can\'t override own property');
    }
    Object.defineProperty(obj, name, {
      get: () => value,
      set: (val: any) => {
        if (silent || val === value) return;
        throw new ReferenceError(`Can't override readonly ${name} property`);
      }
    });
  };
}

export type CopyPredicate = (key: string, value: any) => boolean;

/** Makes a plain copy of obj with properties satisfying the predicate
 * If no predicate provided copies all own properties */
export function copy<T>(obj: T, predicate: CopyPredicate = (): boolean => true): Partial<T> {
  const result: any = Object.assign({}, obj || {});
  Object.keys(result).forEach((key) => {
    (!predicate(key, result[key])) && delete result[key];
  });
  return result;
}

/** Makes a flat copy without undefined keys */
export function copyDefinedKeys<T>(obj?: T): Partial<T> {
  return copy(obj || {}, (key, value) => value !== void 0);
}

/** Omits copying provided properties from object */
export function omit<T>(obj: T, keys: string[]): Partial<T> {
  return copy(obj, (key) => !keys.includes(key));
}

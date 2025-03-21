export type CopyPredicate = (key: string, value: any) => boolean;

/** Makes a plain copy of obj with properties satisfying the predicate
 * If no predicate provided copies all own properties */
export function copy<T extends object>(obj: T, predicate: CopyPredicate = (): boolean => true): Partial<T> {
  const result: any = Object.assign({}, obj || {});
  Object.keys(result).forEach((key) => {
    (!predicate(key, result[key])) && delete result[key];
  });
  return result;
}

/** Makes a flat copy without undefined keys */
export function copyDefinedKeys<T extends object>(obj?: T): Partial<T> {
  return copy(obj || {}, (key, value) => value !== void 0);
}

/** Omits copying provided properties from object */
export function omit<T extends object>(obj: T, keys: string[]): Partial<T> {
  return copy(obj, (key) => !keys.includes(key));
}

/** Picks only provided properties from object */
export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result: Record<K, any> = {} as any;
  if (!obj) return result;
  for (const key of keys) {
    if (key in obj) result[key] = obj[key];
  }
  return result as Pick<T, K>;
}

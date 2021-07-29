export const isObject = (obj: any): obj is Record<string, any> => obj && typeof obj === 'object';
export const isObjectLike = (obj: any) => isObject(obj) || typeof obj === 'function';
export const isPrimitive = (obj: any): obj is string | number | boolean =>
  typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean';

export const isPrototype = (obj: any) => Object.hasOwnProperty.call(obj, 'constructor');

export type CopyPredicate = (key: string, value: any) => boolean;

/** Deep object compare */
export function deepCompare(obj1: any, obj2: any): boolean {
  if (Object.is(obj1, obj2)) return true;
  if (typeof obj1 !== typeof obj2) return false;
  if (isObject(obj1) && isObject(obj2)) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) return false;
    return !keys1.some((key) => !deepCompare(obj1[key], obj2[key]));
  }
  return false;
}

/** Find the closest property descriptor */
export function getPropertyDescriptor(o: any, prop: PropertyKey) {
  let proto = o;
  while (proto) {
    const desc = Object.getOwnPropertyDescriptor(proto, prop);
    if (desc) return desc;
    proto = Object.getPrototypeOf(proto);
  }
}

/** @returns first defined param */
export function defined<T>(...params: T[]) {
  for (const param of params) {
    if (param !== undefined) return param;
  }
}

/** Makes a plain copy of obj with properties satisfying the predicate
 * If no predicate provided copies all own properties */
export function copy<T>(obj: T, predicate: CopyPredicate = () => true): Partial<T> {
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

/** Omit copying provided properties from object */
export function omit<T>(obj: T, keys: string[]) {
  return copy(obj, key => !keys.includes(key));
}

/**
 * Set object property using "path" key
 *
 * @param target - object
 * @param path - key path, use '.' as delimiter
 * @param value - value of property
 */
export const set = (target: any, path: string, value: any) => {
  const parts = (path || '').split('.');
  const depth = parts.length - 1;
  parts.reduce((cur: any, key: string, index: number) => {
    if (index === depth) return cur[key] = value;
    return cur[key] = isObjectLike(cur[key]) ? cur[key] : {};
  }, target);
};

/**
 * Gets object property using "path" key
 * Creates empty object if sub-key value is not presented.
 *
 * @param data - object
 * @param path - key path, use '.' as delimiter
 * @param defaultValue - default
 */
export const get = (data: any, path: string, defaultValue?: any): any => {
  const parts = (path || '').split('.');
  const result = parts.reduce((curr: any, key: string) => {
    if (isObjectLike(curr)) return curr[key];
    return undefined;
  }, data);
  return typeof result === 'undefined' ? defaultValue : result;
};

/**
 * Performs a deep merge of objects and returns new object.
 * Does not modify objects (immutable)
 * @param objects to merge
 * @returns new object with merged key/values
 */
export function deepMerge(...objects: any[]): any {
  return objects.reduce((res: any, obj: any) => {
    isObject(obj) && Object.keys(obj).forEach((key) => {
      const resultVal = res[key];
      const objectVal = obj[key];

      if (Array.isArray(objectVal)) {
        res[key] = objectVal.slice();
      } else if (isObject(resultVal) && isObject(objectVal)) {
        res[key] = deepMerge(resultVal, objectVal);
      } else {
        res[key] = objectVal;
      }
    });

    return res;
  }, {});
}

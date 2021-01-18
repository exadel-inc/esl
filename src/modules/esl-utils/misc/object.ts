export const isObject = (obj: any): obj is Record<string, any> => obj && typeof obj === 'object';
export const isObjectLike = (obj: any) => isObject(obj) || typeof obj === 'function';

/** Deep object compare */
export function deepCompare(obj1: any, obj2: any): boolean {
  if (Object.is(obj1, obj2)) return true;
  if (typeof obj1 !== typeof obj2) return false;
  if (typeof obj1 === 'object') {
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

/**
 * Find the first defined param
 */
export function defined<T>(...params: T[]) {
  for (const param of params) {
    if (param !== undefined) return param;
  }
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

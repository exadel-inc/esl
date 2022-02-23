/** Checks that passed value is object, but not a callable-object (function) */
export const isObject = (obj: any): obj is Record<string, any> => !!obj && typeof obj === 'object';
/** Checks that passed value is an object or function */
export const isObjectLike = (obj: any): boolean => isObject(obj) || typeof obj === 'function';
/** Checks if the passed value is primitive */
export const isPrimitive = (obj: any): obj is string | number | boolean | symbol | undefined | null =>
  obj === null ||
  typeof obj === 'undefined' ||
  typeof obj === 'string' ||
  typeof obj === 'number' ||
  typeof obj === 'boolean' ||
  typeof obj === 'symbol';
/** Checks that passed object is prototype of some class */
export const isPrototype = (obj: any): boolean => Object.hasOwnProperty.call(obj, 'constructor');

/** Array-like type definition */
export type ArrayLike<T = any> = {
  [key: number]: T;
  length: number;
};
/** Checks that passed object is array-like */
export const isArrayLike = (value: any): value is ArrayLike => {
  if (!value || typeof value !== 'object') return false;
  if (Array.isArray(value)) return true;
  if (typeof value.length !== 'number' || value.length < 0) return false;
  return !value.length || Object.hasOwnProperty.call(value, value.length - 1);
};

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
export function getPropertyDescriptor(o: any, prop: PropertyKey): PropertyDescriptor | undefined {
  let proto = o;
  while (proto) {
    const desc = Object.getOwnPropertyDescriptor(proto, prop);
    if (desc) return desc;
    proto = Object.getPrototypeOf(proto);
  }
}

/** @returns first defined param */
export function defined<T>(...params: T[]): T | undefined {
  for (const param of params) {
    if (param !== undefined) return param;
  }
}

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

/** Omit copying provided properties from object */
export function omit<T>(obj: T, keys: string[]): Partial<T> {
  return copy(obj, key => !keys.includes(key));
}

/**
 * Gets object property using "path" key
 * Creates empty object if sub-key value is not presented.
 *
 * @param data - object
 * @param path - key path, use '.' as delimiter
 * @param defaultValue - default
 * @returns specified object property
 */
export const get = (data: any, path: string, defaultValue?: any): any => {
  const parts = (path || '').split('.');
  const result = parts.reduce((curr: any, key: string) => {
    if (isObjectLike(curr)) return curr[key];
    return undefined;
  }, data);
  return typeof result === 'undefined' ? defaultValue : result;
};

/** Key definition for {@link set} */
export type PathKeyDef = {
  /** Key name */
  key: string | number;
  /** Key represents collection index */
  isIndex?: boolean;
  // /** Key should produce array is not exists */
  isIndexed?: boolean;
};
export type PathKey = PathKeyDef | string | number;

/** @returns PathKeyDef from the PathDef */
const toKeyDef = (key: PathKey): PathKeyDef => typeof key === 'object' ? key : {key};

/** Parse path to full {@link PathKeyDef} array */
const parseKeys = (path: string | (number | string | PathKey)[], strict: boolean): PathKeyDef[] => {
  if (typeof path === 'string' && path && !strict) return parseKeysExt(path);
  const parts = Array.isArray(path) ? path : (path || '').split('.');
  return parts.map(toKeyDef);
};

/** Parse path to the PathKeysDefinition */
export const parseKeysExt = (path: string): any => {
  let match;
  const parts: PathKeyDef[] = [];
  const matcher = /^([^[.]+)|\.([^[.]*)|\[([^\]]*)]/g;
  // eslint-disable-next-line no-cond-assign
  while (match = matcher.exec(path)) {
    const [, key1, key2, index] = match;
    if (index !== undefined && (!index || !isNaN(+index))) {
      parts.push({key: index, isIndex: true});
    } else {
      parts.push({key: key1 || key2 || index || ''});
    }
  }
  return parts;
};

/**
 * Set object property using "path" key
 * There is four types of key definition
 * - full: array of {@link PathKeyDef}
 * - array: array of keys (string or number), can be mixed with a full definitions {@link PathKeyDef}
 * - simple path mode: uses '.' as a key separator, indexes and arrays creation is not supported
 * (should be enabled with a fourth param set to true)
 * - full path mode: index syntax supported with a collection creation:
 *   - `a.b` - simple key access (`{a : {b: val}}`)
 *   - `a[0]` - index access, creates collection if it's not exists  (`{a : [val]}`)
 *   - `a[]` - pushes to the end of collection (`{a : [..., val]}`)
 *   - `a[a.b.c]` - escaping: non-numeric indexes uses as a simple keys, delimiters inside square brackets are ignored (`{a : {'a.b.c': val}}`)
 *
 * @param target - object
 * @param path - key path. string or {@link PathKey} array
 * @param value - value of property
 * @param simple - enable simple parsing mode (only '.' syntax separator, without collection support)
 * @returns original object
 */
export const set = (target: any, path: string | PathKey[], value: any, simple = false): any => {
  const keys = parseKeys(path, simple);
  const depth = keys.length - 1;
  keys.reduce((cur: any, {key, isIndex, isIndexed}: PathKeyDef, pos: number) => {
    if (isIndex && !key) key = cur.length || 0; // a[] only
    if (pos !== depth && isObjectLike(cur[key])) return cur[key]; // key already presented
    if (isIndexed === undefined && pos !== depth) isIndexed = keys[pos + 1].isIndex;
    return cur[key] = (pos === depth) ? value : (isIndexed ? [] : {});
  }, target);
  return target;
};

/**
 * Performs a deep copy of object.
 * @returns deep copy of the object
 */
export function deepMerge<T>(obj: T): T;
/**
 * Performs a deep merge of two objects. Does not modify objects (immutable)
 * @returns new object with merged key/values
 */
export function deepMerge<T, U>(obj1: T, obj2: U): T & U;
/**
 * Performs a deep merge of three objects. Does not modify objects (immutable)
 * @returns new object with merged key/values
 */
export function deepMerge<T, U, V>(obj1: T, obj2: U, obj3: V): T & U & V;
/**
 * Performs a deep merge of four objects. Does not modify objects (immutable)
 * @returns new object with merged key/values
 */
export function deepMerge<T, U, V, W>(obj1: T, obj2: U, obj3: V, obj4: W): T & U & V & W;
/**
 * Performs a deep merge of objects and returns new object. Does not modify objects (immutable)
 * @returns new object with merged key/values
 */
export function deepMerge(...objects: any[]): any;
export function deepMerge(...objects: any[]): any {
  return objects.reduce((res: any, obj: any, index: number) => {
    if (index === 0 && Array.isArray(obj)) res = [];

    isObject(obj) && Object.keys(obj).forEach((key) => {
      const resultVal = res[key];
      const objectVal = obj[key];

      let mergeResult = objectVal;
      if (isObject(objectVal)) {
        if (typeof resultVal === 'undefined') mergeResult = deepMerge(objectVal);
        else if (isObject(resultVal)) mergeResult = deepMerge(resultVal, objectVal);
      }
      res[key] = mergeResult;
    });

    return res;
  }, {});
}

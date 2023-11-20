/** Checks that passed value is object, but not a callable-object (function) */
export const isObject = (obj: any): obj is Record<string | symbol, any> => !!obj && typeof obj === 'object';
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

/** Checks that passed value is a plain object */
export const isPlainObject = (obj: any): obj is Record<string | symbol, any> => {
  if (!isObjectLike(obj)) return false;
  const proto = Object.getPrototypeOf(obj);
  return proto === null || proto === Object.prototype;
};

import {isObject} from './types';

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
  return objects.reduce((res: any, obj: any) => {
    if (typeof obj === 'undefined') return res;
    if (typeof res === 'undefined') res = Array.isArray(obj) ? [] : {};
    if (!isObject(obj) || !isObject(res)) return obj;

    Object.keys(obj).forEach((key) => {
      res[key] = isObject(obj[key]) ? deepMerge(res[key], obj[key]) : obj[key];
    });

    return res;
  }, undefined);
}

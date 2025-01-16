import {isObject} from './types';

/** Deeply compares passed objects */
export function isEqual(obj1: any, obj2: any): boolean {
  if (Object.is(obj1, obj2)) return true;
  if (typeof obj1 !== typeof obj2) return false;
  if (isObject(obj1) && isObject(obj2)) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) return false;
    return !keys1.some((key) => !isEqual(obj1[key], obj2[key]));
  }
  return false;
}

/** Check if arr and arr mask has intersection */
function isIntersect(arrObj: any[], arrMask: any[], comparer: (a: any, b: any) => boolean): boolean {
  return arrMask.every((key) => arrObj.some((itm) => comparer(itm, key)));
}

/**
 * Checks if all keys presented in the `mask` are equal to the `obj` keys
 * Note: array order is not taken into account and uses intersection strategy
 */
export function isSimilar(obj: any, mask: any, deep: boolean = true): boolean {
  if (Array.isArray(obj) && Array.isArray(mask)) return isIntersect(obj, mask, deep ? isSimilar : Object.is);
  if (!isObject(obj) || !isObject(mask)) return Object.is(obj, mask);
  return Object.keys(mask).every((key: string) => (deep ? isSimilar : Object.is)(obj[key], mask[key]));
}

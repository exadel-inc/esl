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

/** @deprecated */
export const deepCompare = isEqual;

/**
 * Checks if all keys presented in the `mask` equal to the `obj` keys
 * Note: array order is not taken into account and uses intersection strategy
 */
export function isSimilar(obj: any, mask: any): boolean {
  if (Array.isArray(obj)) {
    if (Array.isArray(mask)) return mask.every((key) => isSimilar(obj, key));
    return obj.some((key) => isSimilar(key, mask));
  }
  if (!isObject(obj) || !isObject(mask)) return Object.is(obj, mask);
  return Object.keys(mask).every((key: string) => isSimilar(obj[key], mask[key]));
}

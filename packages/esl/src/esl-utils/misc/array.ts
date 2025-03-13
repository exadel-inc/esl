import {identity} from './functions';
import {isArrayLike} from './object';

type Tuple<T> = [T?, T?];

/** Split array into tuples */
export const tuple = <T>(arr: T[]): Tuple<T>[] => arr.reduce((acc: Tuple<T>[], el) => {
  if (acc.length === 0 || acc[acc.length - 1].length >= 2) acc.push([]);
  acc[acc.length - 1].push(el);
  return acc;
}, []);

/**
 * Flat array - unwraps one level of nested arrays
 * @deprecated use `Array.prototype.flat` instead
 */
export const flat = <T>(arr: (null | T | T[])[]): T[] => arr.flat(1) as T[];

/** Wraps passed object or primitive to array */
export const wrap = <T>(arr: undefined | null | T | T[]): T[] => {
  if (arr === undefined || arr === null) return [];
  if (Array.isArray(arr)) return arr;
  return [arr];
};

/** Unwraps empty collection to `undefined` */
export function unwrap(value: []): undefined;
/** Unwraps and returns the first element of array-like object */
export function unwrap<T>(value: (ArrayLike<T> & {0: T})): T;
/** Unwraps and returns the first element if array-like object */
export function unwrap<T>(value: ArrayLike<T>): T | undefined;
/** Unwraps and returns the first element Node of passed NodeList object */
export function unwrap<T extends Node>(value: NodeListOf<T>): T | undefined;
/** Unwraps and returns the first element if passed object is array-like, returns an original object otherwise */
export function unwrap<T>(value: T): T;
export function unwrap(value: any): any {
  return isArrayLike(value) ? value[0] : value;
}

/** Makes array values unique */
export const uniq = <T> (arr: T[]): T[] =>
  arr.length > 1 ? [...new Set<T>(arr)] : arr.slice(0);

/** Create an array filled with the range [0,..,N-1] */
export function range(n: number): number[];
/** Create an array filled with values returned by the filler callback */
export function range<T>(n: number, filler: (i: number) => T): T[];
export function range(n: number, filler: (i: number) => any = identity): any[] {
  const arr = Array(n);
  let i = 0;
  while (i < n) arr[i] = filler(i++);
  return arr;
}

/**
 * @returns object with a criteria value as a key and an array of original items that belongs to the current criteria value
 */
export const groupBy = <T, V extends string | number>(array: T[], group: (item: T) => V): Record<V, T[]> => {
  return array.reduce((obj: Record<V, T[]>, el: T) => {
    const key = group(el);
    obj[key] ? obj[key].push(el) : obj[key] = [el];
    return obj;
  }, {} as Record<V, T[]>);
};

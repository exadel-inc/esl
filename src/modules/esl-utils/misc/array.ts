import {identity} from './functions';

type Tuple<T> = [T?, T?];

/** Split array into tuples */
export const tuple = <T>(arr: T[]): Tuple<T>[] => arr.reduce((acc: Tuple<T>[], el) => {
  if (acc.length === 0 || acc[acc.length - 1].length >= 2) acc.push([]);
  acc[acc.length - 1].push(el);
  return acc;
}, []);

/** Flat array */
export const flat = <T>(arr: (null | T | T[])[]): T[] =>
  arr.reduce((acc: T[], el) => el ? acc.concat(el) : acc, []) as T[];

/** Wrap to array */
export const wrap = <T>(arr: undefined | null | T | T[]): T[] => {
  if (arr === undefined || arr === null) return [];
  if (Array.isArray(arr)) return arr;
  return [arr];
};

/** Make array values unique */
export const uniq = <T> (arr: T[]): T[] => {
  const result: T[] = [];
  const set = new Set<T>();
  arr.forEach((item) => set.add(item));
  set.forEach((item) => result.push(item));
  return result;
};

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

/** Create an array of unique values from two arrays*/
export function intersection(a: any, b: any): any[] {
  const arr = new Set([...a, ...b]);
  return [...arr];
}

/** Create an array from two arrays*/
export function union(a: any, b: any): any[] {
  return [...a, ...b];
}

/** Creates an array of unique values from the first array that are not present in the second array*/
export function complement(a: any, b: any): any[] {
  return a.filter((item: any) => !b.includes(item));
}

/** Check for elements from array B in array A*/
export function fullIntersection(a: any, b: any): boolean {
  return a.length === 0 && b.length === 0 ? true : !b.filter((item: any) => !a.includes(item)).length;
}

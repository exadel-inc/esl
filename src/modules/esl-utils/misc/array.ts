import {identity} from './functions';

type Tuple<T> = [T?, T?];

/** Split array into tuples */
export const tuple = <T>(arr: T[]): Tuple<T>[] => arr.reduce((acc: Tuple<T>[], el) => {
  if (acc.length === 0 || acc[acc.length - 1].length >= 2) acc.push([]);
  acc[acc.length - 1].push(el);
  return acc;
}, []);

/** Flat array - unwraps one level of nested arrays */
export const flat = <T>(arr: (null | T | T[])[]): T[] =>
  arr.reduce((acc: T[], el) => el ? acc.concat(el) : acc, []) as T[];

/** Wrap passed object to array */
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

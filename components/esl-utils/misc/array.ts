type Tuple<T> = [T?, T?];
/**
 * Split array into tuples
 */
export const tuple = <T>(arr: T[]): Tuple<T>[] => arr.reduce((acc: Tuple<T>[], el) => {
  if (acc.length === 0 || acc[acc.length - 1].length >= 2) acc.push([]);
  acc[acc.length - 1].push(el);
  return acc;
}, []);

/**
 * Flat array
 */
export const flat = <T>(arr: (null | T | T[])[]): T[] =>
  arr.reduce((acc: T[], el) => el ? acc.concat(el) : acc, []) as T[];

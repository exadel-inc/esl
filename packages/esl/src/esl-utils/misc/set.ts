/** Create an array of unique values that presented in each of the passed arrays */
export function intersection<T>(...rest: T[][]): T[];
export function intersection<T>(a: T[], b: T[], ...rest: T[][]): T[] {
  if (arguments.length < 2) return a ? a.slice() : [];
  if (rest.length) return intersection(a, intersection(b, ...rest));
  return a.filter(Set.prototype.has, new Set(b));
}

/** Create an array with unique values from each of the passed arrays */
export function union<T>(...rest: T[][]): T[]  {
  const set = new Set<T>();
  rest.forEach((item) => item.forEach((i) => set.add(i)));
  return [...set];
}

/** Creates an array of unique values from the first array that are not present in the other arrays */
export function complement<T>(...rest: T[][]): T[];
export function complement<T>(a: T[], b: T[], ...rest: T[][]): T[] | undefined {
  if (!b) return a ? a.slice() : [];
  if (rest.length > 1)  return complement(a, complement(b, ...rest));
  const setB = new Set(b);
  return a.filter((element) => !setB.has(element));
}

/**
 * @returns if the passed arrays have a full intersection
 * Expect uniq values in collections
 */
export function fullIntersection<T>(a: T[], b: T[]): boolean {
  if (a.length === 0 && b.length === 0) return true;
  const [larger, smaller] = a.length >= b.length ? [a, b] : [b, a];
  const set = new Set(larger);
  return !smaller.filter((item: T) => !set.has(item)).length;
}

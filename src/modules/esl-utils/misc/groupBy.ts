/**
 * @returns object with a criteria value as a key and an array of original items that belongs to the current criteria value
 */

export const groupBy = <T, V extends string | number | symbol>(array: T[], group: (item: T) => V | undefined | null): Record<V, T[]> => {
  return array.reduce((obj: Record<V, T[]>, el: T) => {
    const key = String(group(el)) as V;
    obj[key] ? obj[key].push(el) : obj[key] = [el];
    return obj;
  }, {} as Record<V, T[]>);
};

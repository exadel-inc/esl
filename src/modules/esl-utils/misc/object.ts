/** Deep object compare */
export function deepCompare(obj1: any, obj2: any): boolean {
  if (Object.is(obj1, obj2)) return true;
  if (typeof obj1 !== typeof obj2) return false;
  if (typeof obj1 === 'object') {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) return false;
    return !keys1.some((key) => !deepCompare(obj1[key], obj2[key]));
  }
  return false;
}

/** Find the closest property descriptor */
export function getPropertyDescriptor(o: any, prop: PropertyKey) {
  let proto = o;
  while (proto) {
    const desc = Object.getOwnPropertyDescriptor(proto, prop);
    if (desc) return desc;
    proto = Object.getPrototypeOf(proto);
  }
}

/**
 * Find the first defined param
 */
export function defined<T>(...params: T[]) {
  for (const param of params) {
    if (param !== undefined) return param;
  }
}

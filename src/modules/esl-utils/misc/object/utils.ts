/** @returns first defined param */
export function defined<T>(...params: T[]): T | undefined {
  for (const param of params) {
    if (param !== undefined) return param;
  }
}

/** Finds the closest property descriptor */
export function getPropertyDescriptor(o: any, prop: PropertyKey): PropertyDescriptor | undefined {
  let proto = o;
  while (proto) {
    const desc = Object.getOwnPropertyDescriptor(proto, prop);
    if (desc) return desc;
    proto = Object.getPrototypeOf(proto);
  }
}

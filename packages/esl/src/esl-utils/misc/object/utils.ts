export function defined(): undefined;
export function defined<T>(a: T): T;
export function defined(a: undefined, b: undefined): undefined;
export function defined<T>(a: T | undefined, b: T): T;
export function defined(a: undefined, b: undefined, c: undefined): undefined;
export function defined<T>(a: T | undefined, b: T | undefined, c: T): T;
export function defined<T>(...params: T[]): T | undefined;
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


export function extractValues(obj: any, filter: (value: any, key: string | symbol) => boolean): any[];
export function extractValues<T>(obj: any, filter: (value: any, key: string | symbol) => value is T): T[];
export function extractValues(obj: any, filter: (value: any, key: string | symbol) => boolean): any[] {
  if (!obj) return [];
  const desc: any[] = [];
  for (const key in obj) {
    if (filter(obj[key], key)) desc.push(obj[key]);
  }
  return desc;
}

/**
 * Function that do nothing
 */
export const noop = (...args: any[]): void => undefined;

/**
 * Function that return first argument
 */
export const identity = <T>(arg: T): T => arg;

export type NoopFnSignature = () => void;

export type AnyToVoidFnSignature = (...args: any[]) => void;

export type AnyToAnyFnSignature = (...args: any[]) => any;

/**
 * Find the first defined param
 */
export function defined<T>(...params: T[]) {
  for (const param of params) {
    if (param !== undefined) return param;
  }
}

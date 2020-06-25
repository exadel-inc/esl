/**
 * Function that do nothing
 */
export const noop = (): void => undefined;

/**
 * Function that return first argument
 */
export const identity = <T> (arg: T): T => arg;

export type NoopFnSignature = () => void;

export type AnyToVoidFnSignature = (...args: any[]) => void;

export type AnyToAnyFnSignature = (...args: any[]) => any;

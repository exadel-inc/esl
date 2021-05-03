/**
 * Function that does nothing
 */
export const noop: AnyToVoidFnSignature = () => undefined;

/**
 * Function that returns the first argument
 */
export const identity = <T>(arg: T): T => arg;

export type NoopFnSignature = () => void;

export type AnyToVoidFnSignature = (...args: any[]) => void;

export type AnyToAnyFnSignature = (...args: any[]) => any;

export type MethodTypedDecorator<T> = (target: any, property: string, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void;

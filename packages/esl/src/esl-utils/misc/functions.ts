/** Function that does nothing */
export const noop: AnyToVoidFnSignature = () => undefined;

/** Function that returns the first argument */
export const identity = <T>(arg: T): T => arg;

export type NoopFnSignature = () => void;

export type MaybeArgFn<T> = (() => void) | ((arg: T) => void);

export type AnyToVoidFnSignature = (...args: any[]) => void;

export type AnyToAnyFnSignature = (...args: any[]) => any;

export type MethodTypedDecorator<T> = (target: any, property: string, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void;

export type Predicate<T> = (el: T) => boolean;

/**
 * Property provider function
 * @param that - (equal to `this` context) host or context
 */
export type PropertyProvider<T> = (this: unknown, that: unknown) => T;

export type ResolvableProperty<PropType> = PropType | PropertyProvider<PropType>;

/** Resolves {@link PropertyProvider} function to the value */
export const resolveProperty = <T>(val: T | PropertyProvider<T>, origin: unknown): T => typeof val === 'function' ? val.call(origin, origin) : val;

/** Function that does nothing */
export const noop: AnyToVoidFnSignature = () => undefined;

/** Function that returns the first argument */
export const identity = <T>(arg: T): T => arg;

export type NoopFnSignature = () => void;

export type BivariantCallback<T> = {bivarianceHack(arg: T): void}['bivarianceHack'];

export type MaybeArgFn<T> = NoopFnSignature | BivariantCallback<T>;

export type AnyToVoidFnSignature = (...args: any[]) => void;

export type AnyToAnyFnSignature = (...args: any[]) => any;

export type MethodTypedDecorator<T> = (target: any, property: string, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void;

export type Predicate<T> = (el: T) => boolean;

/**
 * Property provider function
 * @param that - (equal to `this` context) host or context
 */
export type PropertyProvider<T, Host = any> = (this: Host, that: Host) => T;

export type ValueOrProvider<PropType, Host = any> = PropType | PropertyProvider<PropType, Host>;

/** Resolves {@link PropertyProvider} function to the value */
export const resolveProperty = <T, Host = unknown>(val: T | PropertyProvider<T, Host>, origin: Host): T =>
  typeof val === 'function' ? (val as PropertyProvider<T, Host>).call(origin, origin) : val;

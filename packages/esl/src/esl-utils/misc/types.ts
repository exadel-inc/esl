
/** Utility to remove trailing whitespace from a string literal type */
export type Trim<S extends string> = S extends ` ${infer T}` | `${infer T} ` ? Trim<T> : S;

/** Utility type to make complex types more readable by removing excess properties */
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};


/** Utility to remove trailing whitespace from a string literal type */
export type Trim<S extends string> = S extends ` ${infer T}` | `${infer T} ` ? Trim<T> : S;

/** Utility type to make complex types more readable by removing excess properties */
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

/** Build all 2-element combinations (permutations without repetition) from a string union. */
export type StrComb2<T extends string> = [T] extends [never] ? never : {
  [A in T]: {
    [B in Exclude<T, A>]: `${A} ${B}`
  }[Exclude<T, A>]
}[T] & `${T} ${T}`;

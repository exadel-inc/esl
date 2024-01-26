type EnumParser<V> = (str: string) => V;
/** Parses string to 2-value union type */
export function buildEnumParser<
  T0 extends string,
  T1 extends string
>(def: T0, v1: T1): EnumParser<T0 | T1>;
/** Parses string to 3-value union type */
export function buildEnumParser<
  T0 extends string,
  T1 extends string,
  T2 extends string
>(def: T0, v1: T1, v2: T2): EnumParser<T0 | T1 | T2>;
/** Parses string to 4-value union type */
export function buildEnumParser<
  T0 extends string,
  T1 extends string,
  T2 extends string,
  T3 extends string
>(def: T0, v1: T1, v2: T2, v3: T3): EnumParser<T0 | T1 | T2 | T3>;
/** Parses string to 5-value union type */
export function buildEnumParser<
  T0 extends string,
  T1 extends string,
  T2 extends string,
  T3 extends string,
  T4 extends string
>(def: T0, v1: T1, v2: T2, v3: T3, v4: T4): EnumParser<T0 | T1 | T2 | T3 | T4>;
export function buildEnumParser(def: string, ...values: string[]): EnumParser<string> {
  return (str: string): string => {
    const value = str.trim().toLowerCase();
    return values.includes(value) ? value : def;
  };
}

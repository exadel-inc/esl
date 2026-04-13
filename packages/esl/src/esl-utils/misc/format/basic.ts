/** Parses `null` and `undefined` as an empty string */
export const parseString = (val: string | null): string => String(val ?? '');

/**
 * Serialize to boolean string (`'true'|'false'`)
 * Preserve null, undefined and empty string
 */
export const toBooleanAttribute = (val: any): string | null => {
  if (val === null || val === undefined) return val;
  return String(!!val && val !== 'false' && val !== '0');
};
/** Parses string representation of the boolean value */
export const parseBoolean = (val: string | null): boolean => val !== null && val !== 'false' && val !== '0';

/**
 * Parses number with the ability to pass an alternative fallback for NaN.
 * Note: falsy values except 0 are treated as NaN
 */
export function parseNumber(str: string | number): number | undefined;
/**
 * Parses number with the ability to pass an alternative fallback for NaN.
 * Note: falsy values except 0 are treated as NaN
 */
export function parseNumber(str: string | number, nanValue: number): number;
export function parseNumber(str: string | number, nanValue?: number): number | undefined {
  if (str === 0) return 0;
  const value = +(str || NaN);
  return isNaN(value) ? nanValue : value;
}

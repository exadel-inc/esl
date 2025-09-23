/**
 * Common function that returns coefficient aspect ratio
 * Supported formats: w:h, w/h, coefficient
 * @example
 * `16:9`, `16/9`, `1.77`
 * @param str - string to parse
 * @returns aspect ratio coefficient
 */
export function parseAspectRatio(str: string): number {
  const [w, h] = str.split(/[:/]/);
  if (typeof h !== 'undefined') return +w / +h;
  return +w || 0;
}

/**
 * Common parser for lazy attribute. Case insensitive. Note:
 * - empty string or unknown values are treated as `auto`.
 * - `null` (or non string objects) is treated as `none`.
 * - `manual` or `none` are treated as it is
 */
export function parseLazyAttr(value: string | null): 'auto' | 'manual' | 'none' {
  if (typeof value !== 'string') return 'none';
  const v = value.trim().toLowerCase();
  if (v === 'none' || v === 'manual') return v;
  return 'auto';
}

/**
 * Parses time string ([CSS style](https://developer.mozilla.org/en-US/docs/Web/CSS/time))
 * Less strict than CSS spec, allows empty string, numbers without units, ending dot.
 * Note: literal `none` is treated as `0`.
 * @example
 * `.3s`, `4.5s`, `1000ms`
 * @returns number - time in milliseconds
 */
export function parseTime(timeStr: number | string): number {
  const str = String(timeStr).trim().toLowerCase();
  if (str === 'none') return 0;
  if (str.endsWith('ms')) return parseFloat(str.slice(0, -2));
  if (str.endsWith('s')) return parseFloat(str.slice(0, -1)) * 1000;
  return +str; // Empty string treated as 0, numbers without units treated as milliseconds
}

/**
 * Restrictive time parser according to [CSS style](https://developer.mozilla.org/en-US/docs/Web/CSS/time) spec.
 * @see {@link parseTime}
 */
export const parseCSSTime = (timeStr: string): number => /(\d*\.?\d+)(ms|s)/i.test(timeStr) ? parseTime(timeStr) : NaN;

/**
 * Parses string of times ([CSS style](https://developer.mozilla.org/en-US/docs/Web/CSS/time))
 * @example
 * `.3s`, `4.5s,1000ms`, `1s, 5s`
 * @returns number[] - array of times in milliseconds
 */
export function parseCSSTimeSet(timeStr: string): number[] {
  return timeStr.split(',').map((timeSubstr) => parseCSSTime(timeSubstr));
}

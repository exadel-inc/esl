const MS_IN_S = 1000;
const MS_IN_M = 60 * MS_IN_S;
const MS_IN_H = 60 * MS_IN_M;
const TIME_PATTERN = /^([+-]?(?:\d+(?:\.\d*)?|\.\d+)h)?([+-]?(?:\d+(?:\.\d*)?|\.\d+)m)?([+-]?(?:\d+(?:\.\d*)?|\.\d+)s)?([+-]?\d+ms)?$/; // ##h##m##s##ms
const TIME_UNITS = [MS_IN_H, MS_IN_M, MS_IN_S, 1] as const;

/**
 * Parses time string
 * Less strict than CSS spec, allows empty string, numbers without units, ending dot, hours, minutes etc.
 * Note: literal `none` is treated as `0`.
 * @example
 * `.3s`, `4.5s`, `1000ms`, `700`, `1h20m30s`, `2h`, `5m`, `25m1s`, `2h10s`, `none`
 * @returns number - time in milliseconds
 */
export function parseTime(timeStr: number | string): number {
  const str = String(timeStr).trim().toLowerCase();
  if (str === 'none') return 0;
  const ms = +str;
  if (!isNaN(ms)) return ms; // Empty string treated as 0, numbers without units treated as milliseconds

  const parsed = TIME_PATTERN.exec(str);
  if (!parsed) return NaN; // Invalid format
  return TIME_UNITS.reduce(
    (time, size, index) => time + (parseFloat(parsed[index + 1] || '0') * size), 0);
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

/**
 * Converts time value to seconds
 * @example
 * ```
 * null => 0
 * '3' => 3
 * `.3s` => 0
 * `4.5s` => 4
 * `1000ms` => 1
 * `2m3s` => 123
 * ```
 */
export const parseTimeSeconds = (value: number | string | null): number => {
  if (!value) return 0;
  const num = +value;
  if (!isNaN(num)) return Math.floor(num);
  return Math.floor(parseTime(value) / MS_IN_S) || 0;
};

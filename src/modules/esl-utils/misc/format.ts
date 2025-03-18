import {get} from './object';

/** Converts string to kebab-case notation */
export const toKebabCase = (str: string): string => {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[\s_]+/g, '-').toLowerCase();
};

/** Converts string to camelCase notation */
export const toCamelCase = (str: string): string => {
  return str.trim().replace(/[\s-,_]+([a-zA-Z0-9]?)/g, (match: string, word: string) => word.toUpperCase());
};

/** Makes the first non-indent (space, tab, newline) letter in the string capitalized */
export const capitalize = (str: string): string => {
  let i = 0;
  while (i < str.length && (str[i] === ' ' || str[i] === '\t' || str[i] === '\n')) i++;
  return str.slice(0, i) + str.charAt(i).toUpperCase() + str.slice(i + 1);
};

/** Unwraps string from parenthesis */
export const unwrapParenthesis = (str: string): string => {
  return str.trim().replace(/^\((.*)\)$/, '$1').trim();
};

/**
 * Serialize to boolean string (`'true'|'false'`)
 * Preserve null, undefined and empty string
 */
export const toBooleanAttribute = (val: any): string | null => {
  if (val === null || val === undefined) return val;
  return String(!!val && val !== 'false' && val !== '0');
};

/** Parses `null` and `undefined` as an empty string */
export const parseString = (val: string | null): string => String(val ?? '');

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

/** Evaluates passed string or returns `defaultValue` */
export function evaluate(str: string, defaultValue?: any): any {
  try {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    return str ? (new Function(`return ${str}`))() : defaultValue;
  } catch (e) {
    console.warn('[ESL]: Cannot parse value ', str, e);
    return defaultValue;
  }
}

/** Default RegExp to match replacements in the string for the {@link format} function */
export const DEF_FORMAT_MATCHER = /{[{%]?([\w.]+)[%}]?}/g;

/** Replaces `{key}` patterns in the string from the source object */
export function format(str: string, source: Record<string, any>, matcher: RegExp = DEF_FORMAT_MATCHER): string {
  return str.replace(matcher, (match, key) => {
    const val = get(source, key);
    return val === undefined ? match : val;
  });
}
/**
 * Parses time string ([CSS style](https://developer.mozilla.org/en-US/docs/Web/CSS/time))
 * Less strict than CSS spec, allows empty string, numbers without units, ending dot.
 * @example
 * `.3s`, `4.5s`, `1000ms`
 * @returns number - time in milliseconds
*/
export function parseTime(timeStr: string): number {
  const str = timeStr.trim().toLowerCase();
  const parseNoEmpty = (s: string): number => s ? +s : NaN;
  if (str.endsWith('ms')) return parseNoEmpty(str.slice(0, -2));
  if (str.endsWith('s')) return parseNoEmpty(str.slice(0, -1)) * 1000;
  return +str; // empty string without unit is treated as 0
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
 * Common parser for lazy attribute. Case insensetive. Note:
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

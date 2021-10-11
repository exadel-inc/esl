import {get} from './object';

/** Convert string to kebab-case notation */
export const toKebabCase = (str: string) => {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[\s_]+/g, '-').toLowerCase();
};

/** Convert string to camelCase notation */
export const toCamelCase = (str: string) => {
  return str.trim().replace(/[\s-,_]+([a-zA-Z0-9]?)/g, (match: string, word: string) => word.toUpperCase());
};

/** Make the first non-indent (space, tab, newline) letter in the string capitalized */
export const capitalize = (str: string) => {
  for (let i = 0; i < str.length; i++) {
    if(str.charAt(i) !== ' '){
      return str.slice(0,i) + str.charAt(i).toUpperCase() + str.slice(i+1);
    }
  } 
  return str;
};
  
/** Unwrap string from parenthesis */
export const unwrapParenthesis = (str: string) => {
  return str.trim().replace(/^\((.*)\)$/, '$1').trim();
};

/**
 * Parse number with the ability to pass an alternative fallback for NaN.
 * Note: falsy values except 0 are treated as NaN
 */
export const parseNumber = (str: string | number, nanValue?: number | undefined) => {
  if (str === 0) return 0;
  const value = +(str || NaN);
  return isNaN(value) ? nanValue : value;
};

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

/** Evaluate passed string or returns `defaultValue` */
export function evaluate(str: string, defaultValue?: any): any {
  try {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    return str ? (new Function(`return ${str}`))() : defaultValue;
  } catch (e) {
    console.warn('Cannot parse value ', str, e);
    return defaultValue;
  }
}


/** Default RegExp to match replacements in the string for the {@link format} function */
export const DEF_FORMAT_MATCHER = /{[{%]?([\w.]+)[%}]?}/g;

/** Replace `{key}` patterns in the string from the source object */
export function format(str: string, source: Record<string, any>, matcher: RegExp = DEF_FORMAT_MATCHER) {
  return str.replace(matcher, (match, key) => {
    const val = get(source, key);
    return val === undefined ? match : val;
  });
}

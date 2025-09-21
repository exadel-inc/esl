import {get} from '../object/path';

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

/** Default RegExp to match replacements in the string for the {@link format} function */
export const DEF_FORMAT_MATCHER = /{[{%]?([\w.]+)[%}]?}/g;

/** Replaces `{key}` patterns in the string from the source object */
export function format(str: string, source: Record<string, any>, matcher: RegExp = DEF_FORMAT_MATCHER): string {
  return str.replace(matcher, (match, key) => {
    const val = get(source, key);
    return val === undefined ? match : val;
  });
}

import {isObjectLike} from './types';

/**
 * Gets object property using "path" key
 * Creates empty object if sub-key value is not presented.
 *
 * @param data - object
 * @param path - key path, use '.' as delimiter
 * @param defaultValue - default
 * @returns specified object property
 */
export const get = (data: any, path: string, defaultValue?: any): any => {
  const parts = (path || '').split('.');
  const result = parts.reduce((curr: any, key: string) => {
    if (isObjectLike(curr)) return curr[key];
    return undefined;
  }, data);
  return typeof result === 'undefined' ? defaultValue : result;
};

/** Key definition for {@link set} */
export type PathKeyDef = {
  /** Key name */
  key: string | number;
  /** Key represents collection index */
  isIndex?: boolean;
  // /** Key should produce array is not exists */
  isIndexed?: boolean;
};
export type PathKey = PathKeyDef | string | number;

/** @returns PathKeyDef from the PathDef */
const toKeyDef = (key: PathKey): PathKeyDef => typeof key === 'object' ? key : {key};

/** Parse path to full {@link PathKeyDef} array */
const parseKeys = (path: string | (number | string | PathKey)[], strict: boolean): PathKeyDef[] => {
  if (typeof path === 'string' && path && !strict) return parseKeysExt(path);
  const parts = Array.isArray(path) ? path : (path || '').split('.');
  return parts.map(toKeyDef);
};

/** Parse path to the PathKeysDefinition */
export const parseKeysExt = (path: string): any => {
  let match;
  const parts: PathKeyDef[] = [];
  const matcher = /^([^[.]+)|\.([^[.]*)|\[([^\]]*)]/g;
  // eslint-disable-next-line no-cond-assign
  while (match = matcher.exec(path)) {
    const [, key1, key2, index] = match;
    if (index !== undefined && (!index || !isNaN(+index))) {
      parts.push({key: index, isIndex: true});
    } else {
      parts.push({key: key1 || key2 || index || ''});
    }
  }
  return parts;
};

/**
 * Set object property using "path" key
 * There is four types of key definition
 * - full: array of {@link PathKeyDef}
 * - array: array of keys (string or number), can be mixed with a full definitions {@link PathKeyDef}
 * - simple path mode: uses '.' as a key separator, indexes and arrays creation is not supported
 * (should be enabled with a fourth param set to true)
 * - full path mode: index syntax supported with a collection creation:
 *   - `a.b` - simple key access (`{a : {b: val}}`)
 *   - `a[0]` - index access, creates collection if it's not exists  (`{a : [val]}`)
 *   - `a[]` - pushes to the end of collection (`{a : [..., val]}`)
 *   - `a[a.b.c]` - escaping: non-numeric indexes uses as a simple keys, delimiters inside square brackets are ignored (`{a : {'a.b.c': val}}`)
 *
 * @param target - object
 * @param path - key path. string or {@link PathKey} array
 * @param value - value of property
 * @param simple - enable simple parsing mode (only '.' syntax separator, without collection support)
 * @returns original object
 */
export const set = (target: any, path: string | PathKey[], value: any, simple = false): any => {
  const keys = parseKeys(path, simple);
  const depth = keys.length - 1;
  keys.reduce((cur: any, {key, isIndex, isIndexed}: PathKeyDef, pos: number) => {
    if (isIndex && !key) key = cur.length || 0; // a[] only
    if (pos !== depth && isObjectLike(cur[key])) return cur[key]; // key already presented
    if (isIndexed === undefined && pos !== depth) isIndexed = keys[pos + 1].isIndex;
    return cur[key] = (pos === depth) ? value : (isIndexed ? [] : {});
  }, target);
  return target;
};

import {isObjectLike} from './types';

/** Full key definition for {@link getByPath} or {@link setByPath} */
export type PathKeyDef = {
  /** Key name */
  key: string | number;
  /** Key represents collection index */
  isIndex?: boolean;
  /** Key should produce array if not exists */
  isIndexed?: boolean;
};
/** Key definition for {@link getByPath} or {@link setByPath} */
export type PathKey = PathKeyDef | string | number;

/** @returns PathKeyDef from the PathDef */
const toKeyDef = (key: PathKey): PathKeyDef => typeof key === 'object' ? key : {key};

/** Parses path to full {@link PathKeyDef} array */
export const parseKeys = (path: string | PathKey[]): PathKeyDef[] => {
  if (Array.isArray(path)) return path.map(toKeyDef);
  return parseKeysPath(path || '.');
};

/** Parses string path to full {@link PathKeyDef} array */
const parseKeysPath = (path: string): PathKeyDef[] => {
  let start = 0;
  const parts: PathKeyDef[] = [];

  while (start < path.length) {
    let end = start = start + +(path[start] === '.'); // skip initial '.'
    if (path[start] === '[') { // handle index syntax
      end = ++start; // start bracket ignored
      while (end < path.length && path[end] !== ']') ++end;
      const key = path.substring(start, end);
      const isIndex = !key || Math.floor(+key) === +key;
      parts.push({key, isIndex});
      start = ++end; // skip end bracket
    } else { // handle simple key
      while (end < path.length && path[end] !== '[' && path[end] !== '.') ++end;
      const key = path.substring(start, end);
      parts.push({key});
      start = end;
    }
  }
  return parts;
};

// Keys that are blocked to prevent CWE-1321 (prototype pollution)
const DEPRECATED_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

/**
 * Gets object property using "path" key
 *
 * Supports three types of key definition
 * - full array of {@link PathKeyDef}
 * - array of keys (string or number), can be mixed with a full definitions {@link PathKeyDef}
 * - string path mode (supports index syntax):
 *   - `a.b` - simple key access (`{a : {b: val}}`)
 *   - `a[0]` - index access, creates collection if it's not exists  (`{a : [val]}`)
 *   - `a[]` - pushes to the end of collection (`{a : [..., val]}`)
 *   - `a[a.b.c]` - escaping: non-numeric indexes uses as a simple keys, delimiters inside square brackets are ignored (`{a : {'a.b.c': val}}`)
 *
 * @param data - object
 * @param path - key path. string or {@link PathKey} array
 * @param defaultValue - default
 * @returns specified object property
 */
export const getByPath = (data: any, path: string | PathKey[], defaultValue?: any): any => {
  const keys = parseKeys(path);
  const result = keys.reduce((curr: any, {key}: PathKeyDef) => {
    if (isObjectLike(curr)) return curr[key];
    return undefined;
  }, data);
  return typeof result === 'undefined' ? defaultValue : result;
};

/**
 * Gets object property using "path" with a keys separated by `.`
 * @see getByPath
 */
export const get = (data: any, path: string, defaultValue?: any): any => getByPath(data, (path || '').split('.'), defaultValue);

/**
 * Sets object property using "path" key
 * Creates empty object if sub-key value is not presented.
 *
 * Supports three types of key definition
 * - full array of {@link PathKeyDef}
 * - array of keys (string or number), can be mixed with a full definitions {@link PathKeyDef}
 * - string path mode (supports index syntax and collection creation):
 *   - `a.b` - simple key access (`{a : {b: val}}`)
 *   - `a[0]` - index access, creates collection if it's not exists  (`{a : [val]}`)
 *   - `a[]` - pushes to the end of collection (`{a : [..., val]}`)
 *   - `a[a.b.c]` - escaping: non-numeric indexes uses as a simple keys, delimiters inside square brackets are ignored (`{a : {'a.b.c': val}}`)
 *
 * @param target - object
 * @param path - key path. string or {@link PathKey} array
 * @param value - value of property
 * @returns original object
 */
export const setByPath = (target: any, path: string | PathKey[], value: any): any => {
  const keys = parseKeys(path);
  const depth = keys.length - 1;
  // prevent prototype pollution
  if (keys.some(({key}) => DEPRECATED_KEYS.has(key as string))) return target;
  keys.reduce((cur: any, {key, isIndex, isIndexed}: PathKeyDef, pos: number) => {
    if (isIndex && !key) key = cur.length || 0; // a[] only
    if (pos !== depth && isObjectLike(cur[key])) return cur[key]; // key already presented
    if (isIndexed === undefined && pos !== depth) isIndexed = keys[pos + 1].isIndex;
    return cur[key] = (pos === depth) ? value : (isIndexed ? [] : {});
  }, target);
  return target;
};

/**
 * Sets object property using "path" with a keys separated by `.`
 * @see setByPath
 */
export const set = (target: any, path: string, value: any): any => setByPath(target, (path || '').split('.'), value);

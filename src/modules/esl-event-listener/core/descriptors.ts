import {isObject} from '../../esl-utils/misc/object/types';

import type {ESLListenerDescriptorExt, ESLListenerDescriptorFn} from './types';

/** Key to store listeners on the host */
const DESCRIPTORS = (window.Symbol || String)('__esl_descriptors');

/**
 * @param host - host object
 * @param createIfNotExists - create keys store on the host if not exists
 * @returns object own descriptors keys or an empty array
 */
function getOwnDescriptors(host: object, createIfNotExists = false): string[] {
  if (Object.hasOwnProperty.call(host, DESCRIPTORS)) return (host as any)[DESCRIPTORS];
  const value: string[]  = [];
  if (createIfNotExists) Object.defineProperty(host, DESCRIPTORS, {value, configurable: true});
  return value;
}

/** Collects descriptors key from the whole prototype chain */
function getDescriptorsKeysFor<T extends object>(host: T): (keyof T)[] {
  const store: Record<string, boolean> = {};
  for (let proto = host; proto && proto !== Object.prototype ; proto = Object.getPrototypeOf(proto)) {
    getOwnDescriptors(proto).forEach((key) => store[key] = true);
  }
  return Object.keys(store) as (keyof T)[];
}

/** Type guard to check if the passed function is typeof {@link ESLListenerDescriptorFn} */
export function isEventDescriptor(obj: any): obj is ESLListenerDescriptorFn {
  if (typeof obj !== 'function' || !Object.hasOwnProperty.call(obj, 'event')) return false;
  return typeof obj.event === 'string' || typeof obj.event === 'function';
}

/** Gets {@link ESLListenerDescriptorFn}s of the passed object */
export function getAutoDescriptors(host: unknown): ESLListenerDescriptorFn[] {
  if (!isObject(host)) return [];
  const keys = getDescriptorsKeysFor(host);
  const values = keys.map((key) => host[key]);
  return values.filter((desc: ESLListenerDescriptorFn) => isEventDescriptor(desc) && desc.auto === true);
}

/**
 * Decorates passed `key` of the `host` as an {@link ESLListenerDescriptorFn} using `desc` meta information
 * @param host - object holder of the function to decorate
 * @param key - string key of the function in holder object
 * @param desc - descriptor meta information to assign
 * @returns ESLListenerDescriptorFn created on the host
 */
export function initDescriptor<T extends object>(
  host: T,
  key: keyof T & string,
  desc: ESLListenerDescriptorExt
): ESLListenerDescriptorFn {
  const fn = host[key];
  if (typeof fn !== 'function') throw new TypeError(`[ESL] Init Descriptor: ${key} is not a function`);

  // Inherit event meta information from the prototype key
  if (desc.inherit) {
    const superDesc = Object.getPrototypeOf(host)[key];
    if (!isEventDescriptor(superDesc)) throw new ReferenceError(`[ESL] Init Descriptor: no parent event descriptor found for ${key}`);
    desc = Object.assign({auto: false}, superDesc, desc);
  } else {
    desc = Object.assign({auto: false}, desc);
  }

  // Marks key to be auto-collectable
  if (desc.auto) {
    const value = getOwnDescriptors(host, true);
    if (!value.includes(key)) value.push(key);
  }

  return Object.assign(fn, desc) as ESLListenerDescriptorFn;
}

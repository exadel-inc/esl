import {isObject} from '../../esl-utils/misc/object/types';

import type {ESLListenerDescriptorExt, ESLListenerDescriptorFn} from './types';

/** Key to store listeners on the host */
const DESCRIPTORS = (Symbol || String)('__esl_descriptors');

function getOwnDescriptors(host: object): string[] {
  return Object.hasOwnProperty.call(host, DESCRIPTORS) ? (host as any)[DESCRIPTORS] : [];
}

function getDescriptorsKeysFor<T extends object>(host: T): (keyof T)[] {
  const keys: Set<keyof T> = new Set();
  for (let proto = host; proto && proto !== Object.prototype ; proto = Object.getPrototypeOf(proto)) {
    getOwnDescriptors(proto).forEach((key) => keys.add(key as keyof T));
  }
  return [...keys];
}

/** Type guard to check if the passed function is typeof {@link ESLListenerDescriptorFn} */
export function isEventDescriptor(obj: unknown): obj is ESLListenerDescriptorFn {
  return typeof obj === 'function' && Object.hasOwnProperty.call(obj, 'event');
}

/** Gets {@link ESLListenerDescriptorFn}s of the passed object */
export function getAutoDescriptors(host: unknown): ESLListenerDescriptorFn[] {
  if (!isObject(host)) return [];
  const keys = getDescriptorsKeysFor(host);
  const values = keys.map((key) => host[key]);
  return values.filter(isEventDescriptor).filter((desc: ESLListenerDescriptorFn) => desc.auto === true);
}

/** Mark field, instanceof {@link ESLListenerDescriptorFn}, as collectable event descriptor */
export function setAutoDescriptor(host: object, key: string): void {
  const value = getOwnDescriptors(host);
  if (!value.includes(key)) value.push(key);
  Object.defineProperty(host, DESCRIPTORS, {value, configurable: true});
}

/** Decorates passed `key` of the `host` as an {@link ESLListenerDescriptorFn} using `desc` meta information */
export function initDescriptor<T extends object>(host: T, key: keyof T & string, desc: string | ESLListenerDescriptorExt): void {
  const fn = host[key];
  if (typeof fn !== 'function') throw new TypeError('ESL: only functions can be decorated as ESLListenerDescriptor');

  const superDesc = Object.getPrototypeOf(host)[key];
  desc = typeof desc === 'string' || typeof desc === 'function' ? {event: desc} : desc;
  desc = Object.assign({auto: true}, desc.inherit && isEventDescriptor(superDesc) ? superDesc : {}, desc);
  if (isEventDescriptor(fn) && fn.event !== desc.event) throw new TypeError(`Method ${key} already decorated as ESLListenerDescriptor`);

  Object.assign(fn, desc);
  if (desc.auto) setAutoDescriptor(host, key);
}

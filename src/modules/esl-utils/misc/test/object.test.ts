import {
  isEqual,
  copy,
  defined,
  copyDefinedKeys,
  isObject,
  isObjectLike,
  isArrayLike,
  isPrototype,
  isPrimitive,
  get,
  getByPath,
  set,
  setByPath,
  deepMerge,
  omit,
  getPropertyDescriptor
} from '../object';

// checking the availability of misc/object utilities
describe('misc/object: availability', () => {
  test.each([
    isEqual,
    copy,
    defined,
    copyDefinedKeys,
    isObject,
    isObjectLike,
    isArrayLike,
    isPrototype,
    isPrimitive,
    get,
    getByPath,
    set,
    setByPath,
    deepMerge,
    omit,
    getPropertyDescriptor
  ])('%p is available', (fn) => expect(typeof fn).toBe('function'));
});

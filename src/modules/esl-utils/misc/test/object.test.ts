import {
  deepCompare,
  copy,
  defined,
  copyDefinedKeys,
  isObject,
  isObjectLike,
  isArrayLike,
  isPrototype,
  isPrimitive,
  get,
  getBy,
  set,
  setBy,
  parseKeys,
  deepMerge,
  omit,
  getPropertyDescriptor
} from '../object';

// checking the availability of misc/object utilities
describe('misc/object: availability', () => {
  test.each([
    deepCompare,
    copy,
    defined,
    copyDefinedKeys,
    isObject,
    isObjectLike,
    isArrayLike,
    isPrototype,
    isPrimitive,
    get,
    getBy,
    set,
    setBy,
    parseKeys,
    deepMerge,
    omit,
    getPropertyDescriptor
  ])('%p is available', (fn) => expect(typeof fn).toBe('function'));
});

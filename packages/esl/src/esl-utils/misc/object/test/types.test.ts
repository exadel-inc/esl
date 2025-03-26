import {
  isArrayLike,
  isObject,
  isObjectLike,
  isPlainObject,
  isPrimitive,
  isPrototype
} from '../types';

// TODO: possibly split by files
describe('misc/object: type guards', () => {
  // TODO: split to separate tests with clear descriptions
  test('isObject', () => {
    expect(isObject(undefined)).toBe(false);
    expect(isObject(null)).toBe(false);
    expect(isObject('1')).toBe(false);
    expect(isObject({})).toBe(true);
    expect(isObject([])).toBe(true);
    expect(isObject(() => true)).toBe(false);
  });

  // TODO: split to separate tests with clear descriptions
  test('isObjectLike', () => {
    expect(isObjectLike(null)).toBe(false);
    expect(isObjectLike({})).toBe(true);
    expect(isObjectLike([])).toBe(true);
    expect(isObjectLike(() => true)).toBe(true);
  });

  // TODO: split to separate tests with clear descriptions
  test('isPrimitive', () => {
    expect(isPrimitive(undefined)).toBe(true);
    expect(isPrimitive(null)).toBe(true);
    expect(isPrimitive(0)).toBe(true);
    expect(isPrimitive('')).toBe(true);
    expect(isPrimitive(Symbol())).toBe(true);
    expect(isPrimitive({})).toBe(false);
    expect(isPrimitive(() => true)).toBe(false);
  });

  // TODO: split to separate tests with clear descriptions
  test('isPrototype', () => {
    expect(isPrototype({})).toBe(false);
    class Test {}
    expect(isPrototype(Test)).toBe(false);
    expect(isPrototype(Test.prototype)).toBe(true);
    expect(isPrototype(Array)).toBe(false);
    expect(isPrototype(Array.prototype)).toBe(true);
  });

  // TODO: split to separate tests with clear descriptions
  test('isArrayLike', () => {
    expect(isArrayLike({})).toBe(false);
    expect(isArrayLike([])).toBe(true);
    expect(isArrayLike([1])).toBe(true);
    expect(isArrayLike({length: 0})).toBe(true);
    expect(isArrayLike({length: 1, 0: null})).toBe(true);
    expect(isArrayLike(document.querySelectorAll('*'))).toBe(true);
  });

  describe('isPlainObject (misc/object) type guard', () => {
    test.each([
      undefined,
      null,
      false,
      0,
      '',
      Symbol()
    ])('isPlainObject returns false for non-object value: %o', (value) => expect(isPlainObject(value)).toBe(false));

    test.each([
      new Date(),
      new RegExp(''),
      new Error(),
      new Map(),
      new WeakMap(),
      new Set(),
      new WeakSet(),
      new Promise(() => {})
    ])('isPlainObject returns false for non-plain object: %o', (value) => expect(isPlainObject(value)).toBe(false));

    test.each([
      Object.create(null),
      {},
      {a: 1}
    ])('isPlainObject returns true for plain object: %o', (value) => expect(isPlainObject(value)).toBe(true));
  });
});

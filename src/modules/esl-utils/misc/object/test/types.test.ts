import {isArrayLike, isObject, isObjectLike, isPrimitive, isPrototype} from '../types';

describe('misc/object: type guards', () => {
  test('isObject', () => {
    expect(isObject(undefined)).toBe(false);
    expect(isObject(null)).toBe(false);
    expect(isObject('1')).toBe(false);
    expect(isObject({})).toBe(true);
    expect(isObject([])).toBe(true);
    expect(isObject(() => true)).toBe(false);
  });
  test('isObjectLike', () => {
    expect(isObjectLike(null)).toBe(false);
    expect(isObjectLike({})).toBe(true);
    expect(isObjectLike([])).toBe(true);
    expect(isObjectLike(() => true)).toBe(true);
  });
  test('isPrimitive', () => {
    expect(isPrimitive(undefined)).toBe(true);
    expect(isPrimitive(null)).toBe(true);
    expect(isPrimitive(0)).toBe(true);
    expect(isPrimitive('')).toBe(true);
    expect(isPrimitive(Symbol())).toBe(true);
    expect(isPrimitive({})).toBe(false);
    expect(isPrimitive(() => true)).toBe(false);
  });
  test('isPrototype', () => {
    expect(isPrototype({})).toBe(false);
    class Test {}
    expect(isPrototype(Test)).toBe(false);
    expect(isPrototype(Test.prototype)).toBe(true);
    expect(isPrototype(Array)).toBe(false);
    expect(isPrototype(Array.prototype)).toBe(true);
  });
  test('isArrayLike', () => {
    expect(isArrayLike({})).toBe(false);
    expect(isArrayLike([])).toBe(true);
    expect(isArrayLike([1])).toBe(true);
    expect(isArrayLike({length: 0})).toBe(true);
    expect(isArrayLike({length: 1, 0: null})).toBe(true);
    expect(isArrayLike(document.querySelectorAll('*'))).toBe(true);
  });
});

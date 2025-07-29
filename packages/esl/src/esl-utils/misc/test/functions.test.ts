import {identity, noop, resolveProperty} from '../functions';

describe('misc/functions', () => {
  test('noop', () => {
    expect(noop()).toBeUndefined();
    expect(noop(1, 2, 3)).toBeUndefined();
  });

  test('identity', () => {
    expect(identity(1)).toBe(1);
    const test = Symbol('test');
    expect(identity(test)).toBe(test);
  });

  describe('resolveProperty',  () => {
    test('value', () => {
      const obj = {};
      expect(resolveProperty(1, null)).toBe(1);
      expect(resolveProperty(1, obj)).toBe(1);
    });
    test('provider', () => {
      const obj = {};
      const test = jest.fn(function () { return this; });
      expect(resolveProperty(test, obj)).toBe(obj);
      expect(test).toHaveBeenLastCalledWith(obj);
    });
    test('null context', () => {
      const test = jest.fn(function () { return this; });
      expect(resolveProperty(test, null)).toBe(null);
      expect(test).toHaveBeenLastCalledWith(null);
    });
  });
});

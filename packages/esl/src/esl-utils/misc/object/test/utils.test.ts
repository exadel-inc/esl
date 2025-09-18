import {defined, extractValues, getPropertyDescriptor} from '../utils';

describe('misc/object: utils', () => {
  describe('getPropertyDescriptor', () => {
    test('simple', () => {
      const object = {
        a: 1,
        get b() { return 2; }
      };
      expect(getPropertyDescriptor(object, 'a')).toBeTruthy();
      expect(getPropertyDescriptor(object, 'b')).toBeTruthy();
      expect(getPropertyDescriptor(object, 'c')).toBeFalsy();

      const descC = {get: () => 3};
      const descD = {value: 4};
      Object.defineProperty(object, 'c', descC);
      Object.defineProperty(object, 'd', descD);

      expect(getPropertyDescriptor(object, 'c')).toHaveProperty('get');
      expect(getPropertyDescriptor(object, 'd')).toHaveProperty('value', 4);
      expect(getPropertyDescriptor(object, 'f')).toBeFalsy();
    });

    test('1 lvl', () => {
      class A {
        a = 1;
        b() { return 2; }
        get c() { return 3; }
      }
      const obj = new A();
      expect(getPropertyDescriptor(obj, 'a')).toBeTruthy();
      expect(getPropertyDescriptor(obj, 'b')).toBeTruthy();
      expect(getPropertyDescriptor(obj, 'c')).toBeTruthy();
      expect(getPropertyDescriptor(obj, 'b')).toHaveProperty('value');
      expect(getPropertyDescriptor(obj, 'c')).toHaveProperty('get');
    });

    test('2 lvl', () => {
      class A {
        a() { return 3; }
        get b() { return 3; }
      }
      class B extends A {}
      const obj = new B();
      expect(getPropertyDescriptor(obj, 'a')).toBeTruthy();
      expect(getPropertyDescriptor(obj, 'b')).toBeTruthy();
    });
  });

  describe('access utils', () => {
    test('defined', () => {
      expect(defined('a')).toBe('a');
      expect(defined('', 'a')).toBe('');
      expect(defined('a', '')).toBe('a');
      expect(defined(undefined, 'a')).toBe('a');
      expect(defined(null, 'a')).toBe(null);
      const obj = {};
      expect(defined(obj, null)).toBe(obj);
    });
  });

  describe('extractValues', () => {
    test('extractValues collect all values from simple object', () => {
      const obj = {a: 1, b: 2};
      expect(extractValues(obj, () => true)).toEqual(Object.values(obj));
    });

    test('extractValues collect all values from object prototype', () => {
      const obj = {a: 1, b: 2};
      const proto = {c: 3, d: 4};
      Object.setPrototypeOf(obj, proto);
      expect(extractValues(obj, () => true)).toEqual(Object.values(obj).concat(Object.values(proto)));
    });

    test('extractValues does not duplicate keys from prototype', () => {
      const obj = {a: 1, b: 2};
      const proto = {b: 4};
      Object.setPrototypeOf(obj, proto);
      expect(extractValues(obj, () => true)).toEqual(Object.values(obj));
    });

    test('extractValues calls filter function for each key', () => {
      const obj = {a: 1, b: 2};
      const proto = {d: 4};
      Object.setPrototypeOf(obj, proto);
      const filter = jest.fn(() => true);
      extractValues(obj, filter);

      expect(filter).toHaveBeenCalledTimes(3);
      for (const pair of Object.entries(obj).concat(Object.entries(proto))) {
        expect(filter).toHaveBeenCalledWith(...pair.reverse());
      }
    });

    test('extractValues returns empty array with falsy filter', () => {
      const obj = {a: 1, b: 2};
      const proto = {b: 4};
      Object.setPrototypeOf(obj, proto);
      expect(extractValues(obj, () => false)).toEqual([]);
    });

    test('extractValues filter keys properly', () => {
      const obj = {a: 1, b: 2};
      const proto = {b: 4};
      Object.setPrototypeOf(obj, proto);
      const filter = jest.fn(() => false);
      filter.mockImplementationOnce(() => true);
      expect(extractValues(obj, filter)).toEqual([1]);
    });
  });
});

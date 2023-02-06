import {defined, getPropertyDescriptor} from '../utils';

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
});

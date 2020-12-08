import {memoize, memoizeFn} from '../memoize';

describe('common @memoize decorator test', () => {
  describe('accessor', () => {
    const fn = jest.fn();
    class TestClass {
      @memoize
      get test() {
        return fn(this);
      }
    }
    const instance = new TestClass();

    test('cache / clear', () => {
      fn.mockReturnValue(NaN);
      expect(instance.test).toBe(NaN);
      expect(instance.test).toBe(NaN);
      expect(fn).toBeCalledTimes(1);

      memoize.clear(instance, 'test');
      expect(instance.test).toBe(NaN);
      expect(fn).toBeCalledTimes(2);
    });
  });

  describe('static accessor', () => {
    const fn = jest.fn();
    class TestClass {
      @memoize
      static get test() {
        return fn();
      }
    }

    test('cache / clear', () => {
      fn.mockReturnValue(NaN);
      expect(TestClass.test).toBe(NaN);
      expect(TestClass.test).toBe(NaN);
      expect(fn).toBeCalledTimes(1);

      memoize.clear(TestClass, 'test');
      expect(TestClass.test).toBe(NaN);
      expect(fn).toBeCalledTimes(2);
    });
  });

  describe('cache / clear', () => {
    const fn = jest.fn();
    class TestClass {
      @memoize
      test(...args: any[]) {
        return fn(args);
      }
    }
    const instance = new TestClass();

    test('cache / clear', () => {
      fn.mockReturnValue('a');
      expect(instance.test()).toBe('a');
      expect(instance.test()).toBe('a');
      expect(fn).toBeCalledTimes(1);

      memoize.clear(instance, 'test');
      expect(instance.test()).toBe('a');
      expect(instance.test()).toBe('a');
      expect(fn).toBeCalledTimes(2);
    });
  });

  describe('static method', () => {
    const fn = jest.fn();
    class TestClass {
      @memoize
      static test(...args: any[]) {
        return fn(args);
      }
    }

    test('cache / clear', () => {
      fn.mockReturnValue('a');
      expect(TestClass.test()).toBe('a');
      expect(TestClass.test()).toBe('a');
      expect(fn).toBeCalledTimes(1);

      memoize.clear(TestClass, 'test');
      expect(TestClass.test()).toBe('a');
      expect(TestClass.test()).toBe('a');
      expect(fn).toBeCalledTimes(2);
    });
  });

  describe('function', () => {
    test('cache / clear', () => {
      const fn = jest.fn();
      const memoFn = memoizeFn(fn);
      fn.mockReturnValue(null);
      expect(memoFn()).toBe(null);
      expect(memoFn()).toBe(null);
      expect(fn).toBeCalledTimes(1);

      memoFn.clear();
      fn.mockReturnValue(1);
      expect(memoFn()).toBe(1);
      expect(memoFn()).toBe(1);
      expect(fn).toBeCalledTimes(2);
    });

    test('multi-arg', () => {
      const fn = jest.fn((a) => a + 1);
      const memoFn = memoizeFn(fn);
      expect(memoFn(1)).toBe(2);
      expect(memoFn(1)).toBe(2);
      expect(fn).toBeCalledTimes(1);

      expect(memoFn(2)).toBe(3);
      expect(memoFn(2)).toBe(3);
      expect(fn).toBeCalledTimes(2);
    });
  });
});

import {memoize} from '../memoize';

describe('common @memoize decorator test', () => {
  describe('accessor', () => {
    const fn = vi.fn();
    class TestClass {
      @memoize()
      get test() {
        return fn(this);
      }
    }
    const instance = new TestClass();

    test('cache / clear', () => {
      fn.mockReturnValue(NaN);
      expect(instance.test).toBe(NaN);
      expect(instance.test).toBe(NaN);
      expect(fn).toHaveBeenCalledTimes(1);

      expect(memoize.has(instance, 'test')).toBe(true);
      memoize.clear(instance, 'test');
      expect(memoize.has(instance, 'test')).toBe(false);

      expect(instance.test).toBe(NaN);
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe('static accessor', () => {
    const fn = vi.fn();
    class TestClass {
      @memoize()
      static get test() {
        return fn();
      }
    }

    test('cache / clear', () => {
      fn.mockReturnValue(NaN);
      expect(TestClass.test).toBe(NaN);
      expect(TestClass.test).toBe(NaN);
      expect(fn).toHaveBeenCalledTimes(1);

      expect(memoize.has(TestClass, 'test')).toBe(true);
      memoize.clear(TestClass, 'test');
      expect(memoize.has(TestClass, 'test')).toBe(false);

      expect(TestClass.test).toBe(NaN);
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe('cache / clear', () => {
    const fn = vi.fn();
    class TestClass {
      @memoize()
      test() {
        return fn();
      }
    }
    const instance = new TestClass();

    test('cache / clear', () => {
      fn.mockReturnValue('a');
      expect(instance.test()).toBe('a');
      expect(instance.test()).toBe('a');
      expect(fn).toHaveBeenCalledTimes(1);

      expect(memoize.has(instance, 'test')).toBe(true);
      memoize.clear(instance, 'test');
      expect(memoize.has(instance, 'test')).toBe(false);

      expect(instance.test()).toBe('a');
      expect(instance.test()).toBe('a');
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe('array clear', () => {
    const fn = vi.fn();
    class TestClass {
      @memoize()
      test1() {
        return fn();
      }

      @memoize()
      test2() {
        return fn();
      }
    }
    const instance = new TestClass();

    test('cache / clear', () => {
      fn.mockReturnValue('a');
      expect(instance.test1()).toBe('a');
      expect(instance.test2()).toBe('a');
      expect(fn).toHaveBeenCalledTimes(2);

      expect(memoize.has(instance, 'test1')).toBe(true);
      expect(memoize.has(instance, 'test2')).toBe(true);
      memoize.clear(instance, ['test1', 'test2']);
      expect(memoize.has(instance, 'test1')).toBe(false);
      expect(memoize.has(instance, 'test2')).toBe(false);

      expect(instance.test1()).toBe('a');
      expect(instance.test2()).toBe('a');
      expect(fn).toHaveBeenCalledTimes(4);
    });
  });

  describe('static method', () => {
    const fn = vi.fn();
    class TestClass {
      @memoize()
      static test() {
        return fn();
      }
    }

    test('cache / clear', () => {
      fn.mockReturnValue('a');
      expect(TestClass.test()).toBe('a');
      expect(TestClass.test()).toBe('a');
      expect(fn).toHaveBeenCalledTimes(1);

      expect(memoize.has(TestClass, 'test')).toBe(true);
      memoize.clear(TestClass, 'test');
      expect(memoize.has(TestClass, 'test')).toBe(false);

      expect(TestClass.test()).toBe('a');
      expect(TestClass.test()).toBe('a');
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe('cashed result instance check', () => {
    class A {}

    class TestClass {
      @memoize() get test() { return new A(); }

      @memoize()
      static get test() { return new A(); }
    }

    const instance1 = new TestClass();
    const instance2 = new TestClass();

    test('accessor', () => {
      const res1 = instance1.test;
      const res2 = instance1.test;
      const res3 = instance2.test;

      expect(res1).toBe(res2);
      expect(res1).not.toBe(res3);
    });

    test('static accessor', () => {
      const res1 = TestClass.test;
      const res2 = TestClass.test;

      expect(res1).toBe(res2);
    });
  });

  test('deprecated target',  () => {
    expect(function () {
      class TestClass {
        // @ts-ignore
        @memoize()
        public test = 'a';
      }
      new TestClass();
    }).toThrow();
  });
});

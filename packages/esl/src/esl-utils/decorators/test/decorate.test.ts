import {decorate} from '../decorate';

describe('common @decorate decorator test', () => {
  describe('Decorated method access leads to decorated instance access', () => {
    const v1 = Symbol('v1');
    const fn1 = jest.fn(() => v1);

    const v2 = Symbol('v2');
    const fn2 =  jest.fn(() => v2);

    const fnPull = [fn2, fn1];
    const wrap = jest.fn((fn) => fnPull.pop() || ((...args: any[]) => fn(...args)));

    const original = Symbol('original');
    const originalFn =  jest.fn(() => original);
    class Test {
      @decorate(wrap)
      test(...args: any[]): symbol { return originalFn.call(this, ...args); }
    }

    const t1 = new Test();
    test('@decorator is lazy', () => expect(wrap).toBeCalledTimes(0));
    test('Decorated with @decorator method returns wrapped method', () => expect(t1.test()).toBe(v1));
    test('@decorator called ones it\'s accessed', () => expect(wrap).toBeCalledTimes(1));
    test('Decorated with @decorator method returns wrapped method every time', () => expect(t1.test).toBe(fn1));
    test('@decorator does not redecorate method second time', () => expect(wrap).toBeCalledTimes(1));

    const t2 = new Test();
    test('@decorator doesn\'t have effect on instance creation', () => expect(wrap).toBeCalledTimes(1));
    test('Second instance creates its own wrapped method', () => expect(t2.test()).toBe(v2));
    test('Decorated with @decorator method returns wrapped method every time', () => expect(t2.test).toBe(fn2));

    const t3 = new Test();
    test('Original function passed as a first argument for wrapper', () => expect(t3.test()).toBe(original));
    test('Arguments are passed to the wrapped function', () => {
      const arg1 = Symbol('arg1');
      const arg2 = Symbol('arg1');
      expect(t3.test(arg1, arg2)).toBe(original);
      expect(originalFn).lastCalledWith(arg1, arg2);
    });
  });

  describe('Decorated method inheritance works correct', () => {
    const original = Symbol('original');
    const originalFn =  jest.fn(() => original);
    const wrap = jest.fn((fn) => ((...args: any[]) => fn(...args)));

    class Parent {
      @decorate(wrap)
      test(...args: any[]): symbol { return originalFn.call(this, ...args); }
    }

    class Child extends Parent {
      override test(...args: any[]): symbol {
        return super.test(...args);
      }

      testSuper(): any {
        return super.test;
      }
    }

    const instance = new Child();
    const arg1 = Symbol('arg1');
    test(
      'Overwritten method define correctly and accessing original method',
      () => expect(instance.test(arg1)).toBe(original)
    );
    test(
      'Arguments passed correctly',
      () => expect(originalFn).lastCalledWith(arg1)
    );
    test(
      'Second call still works correct',
      () => expect(instance.test(arg1)).toBe(original)
    );
    test(
      'Prototype method call run function without decoration',
      () => expect(Parent.prototype.test()).toBe(original)
    );
    test(
      'Decoration does not happens on super access',
      () => expect(wrap).toBeCalledTimes(0)
    );

    const instance2 = new Child();
    test(
      'Call of super keyword returns original method',
      () => expect(instance2.testSuper()).toBe(Parent.prototype.test)
    );
  });
});

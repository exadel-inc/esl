import {safe} from '../safe';

describe('Decorator: @safe', () => {
  describe('Applied to getters', () => {
    test('Returns original getter result when no error occurs', () => {
      class TestClass {
        private _value = 'original';

        @safe('fallback')
        get value() {
          return this._value;
        }
      }
      const obj = new TestClass();
      expect(obj.value).toBe('original');
    });

    test('Returns fallback value when an error occurs in getter', () => {
      class TestClass {
        @safe('fallback')
        get value(): string {
          throw new Error('Test error');
        }
      }
      const obj = new TestClass();
      expect(obj.value).toBe('fallback');
    });

    test('Invokes $$error hook when an error occurs in getter', () => {
      const errorHook = vi.fn();
      class TestClass {
        $$error = errorHook;

        @safe('fallback')
        get value(): string {
          throw new Error('Test error');
        }
      }
      const obj = new TestClass();
      // Accessing the getter to trigger the error
      obj.value;
      expect(errorHook).toHaveBeenCalledTimes(1);
      expect(errorHook.mock.calls[0][0]).toBeInstanceOf(Error);
      expect(errorHook.mock.calls[0][1]).toBe('value');
    });
  });

  describe('Applied to methods', () => {
    test('Returns original method result when no error occurs', () => {
      class TestClass {
        @safe('fallback')
        method(): string {
          return 'original';
        }
      }
      const obj = new TestClass();
      expect(obj.method()).toBe('original');
    });

    test('Returns fallback value when an error occurs', () => {
      class TestClass {
        @safe('fallback')
        method(): string {
          throw new Error('Test error');
        }
      }
      const obj = new TestClass();
      expect(obj.method()).toBe('fallback');
    });

    test('Invokes $$error hook when an error occurs', () => {
      const errorHook = vi.fn();
      class TestClass {
        $$error = errorHook;

        @safe('fallback')
        method(): string {
          throw new Error('Test error');
        }
      }
      const obj = new TestClass();
      obj.method();
      expect(errorHook).toHaveBeenCalledTimes(1);
      expect(errorHook.mock.calls[0][0]).toBeInstanceOf(Error);
      expect(errorHook.mock.calls[0][1]).toBe('method');
    });

    test('Supports provider-based fallback values', () => {
      const provider = vi.fn().mockReturnValue('dynamic fallback');
      class TestClass {
        @safe(provider)
        method(): string {
          throw new Error('Test error');
        }
      }
      const obj = new TestClass();
      expect(obj.method()).toBe('dynamic fallback');
      expect(provider).toHaveBeenCalledWith(obj);
    });

    test('Supports void methods', () => {
      class TestClass {
        @safe()
        method(): void {
          throw new Error('Test error');
        }
      }
      const obj = new TestClass();
      expect(() => obj.method()).not.toThrow();
      // Should return undefined for void methods
      expect(obj.method()).toBeUndefined();
    });

    test('Can be applied to async methods (but only handles sync throws)', async () => {
      class TestClass {
        @safe(Promise.resolve('fallback'))
        async method(shouldThrow: boolean): Promise<string> {
          if (shouldThrow) throw new Error('Test error');
          return 'original';
        }
      }
      const obj = new TestClass();
      await expect(obj.method(false)).resolves.toBe('original');
      // Async errors are not caught by @safe, so the promise rejects
      await expect(obj.method(true)).rejects.toThrow('Test error');
    });
  });
});

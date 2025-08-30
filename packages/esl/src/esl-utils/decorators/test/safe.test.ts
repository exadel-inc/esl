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
      const errorHook = jest.fn();
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
      const errorHook = jest.fn();
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
      const provider = jest.fn().mockReturnValue('dynamic fallback');
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
  });
});

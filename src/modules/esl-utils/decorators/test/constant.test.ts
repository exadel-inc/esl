import '../../../../polyfills/es5-target-shim';
import { ESLBaseElement, attr } from '../../../esl-base-element/core';
import { constant } from '../constant';

describe('Decorator: constant', () => {
  class TestBaseElement extends ESLBaseElement {
    @attr()
    public field: string;
    @attr({readonly: true})
    public readonlyField: string;
  }

  test('Silent constant is not writeable and not throws error', () => {
    class TestElement {
      @constant('test', true)
      public field: string;
    }

    const el = new TestElement();
    expect(() => { el.field = 'hey'; }).not.toThrowError();
    expect(el.field).toBe('test');
  });

  test('Non silent constant is not writeable and throws error', () => {
    class TestElement {
      @constant('test')
      public field: string;
    }

    const el = new TestElement();
    expect(() => { el.field = 'hey'; }).toThrowError();
    expect(el.field).toBe('test');
  });

  test('Non silent constant is not throwing error when setting original value', () => {
    class TestElement {
      @constant('test')
      public field: string;
    }

    const el = new TestElement();
    expect(() => { el.field = 'test'; }).not.toThrowError();
    expect(el.field).toBe('test');
  });

  test('Overriding own property produce error', () => {
    expect(() => {
      class TestElement extends ESLBaseElement {
        @constant('')
        @attr()
        public field: string;
      }
      new TestElement();
    }).toThrowError(/own property/);
  });

  describe('Overriding @attr', () => {
    class TestElement extends TestBaseElement {
      @constant('test', true)
      public field: string;

      @constant('test')
      public readonlyField: string;
    }
    customElements.define('attr-constant-1', TestElement);

    test('should override simple @attr decorator', () => {
      const el = new TestElement();
      expect(el.field).toBe('test');
      expect(el.getAttribute('field')).toBe(null);
    });
    test('should override readonly @attr decorator', () => {
      const el = new TestElement();
      expect(el.readonlyField).toBe('test');
      expect(el.getAttribute('readonly-field')).toBe(null);
    });
    test('overwritten property is not writtable', () => {
      const el = new TestElement();
      el.field = '123';
      expect(el.field).toBe('test');
      expect(el.getAttribute('field')).toBe(null);
    });
  });
});

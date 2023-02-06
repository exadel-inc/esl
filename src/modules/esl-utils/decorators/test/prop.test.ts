import '../../../../polyfills/es5-target-shim';
import {attr, boolAttr, jsonAttr} from '../../../esl-base-element/core';
import {prop} from '../prop';

describe('Decorator: @prop', () => {
  class TestBaseElement extends HTMLElement {
    @attr()
    public field: string;
    @boolAttr()
    public field2: boolean;
    @jsonAttr()
    public field3: {a: number};
    @attr()
    public field4?: string;
    @attr({readonly: true})
    public readonlyField: string;
  }

  describe('Overriding @attr', () => {
    class TestElement extends TestBaseElement {
      @prop({value: 'test'})
      public field: string;
      @prop()
      public field4?: string;
      @prop({value: 'test'})
      public readonlyField: string;
    }
    customElements.define('attr-override-1', TestElement);

    test('should override simple @attr decorator', () => {
      const el = new TestElement();
      expect(el.field).toBe('test');
    });
    test('should override readonly @attr decorator', () => {
      const el = new TestElement();
      expect(el.readonlyField).toBe('test');
    });
    test('override should be writeable', () => {
      const el = new TestElement();
      el.field = el.readonlyField = 'hi';
      expect(el.field).toBe('hi');
      expect(el.readonlyField).toBe('hi');
    });
    test('original decorator should not be executed', () => {
      const el = new TestElement();
      el.field = 'hi';
      expect(el.getAttribute('field')).toBe(null);
    });

    test('should have undefined as a default', () => {
      const el = new TestElement();
      expect('field4' in el).toBe(true);
      expect(el.field4).toBe(undefined);
    });
  });

  describe('Overriding with a non writable', () => {
    class TestElement extends TestBaseElement {
      @prop({value: 'test', readonly: true}) public field: string;
      @prop({value: true, readonly: true}) public field2: boolean;
    }
    class TestElement2 extends TestElement {
      @prop() public field: string = 'test2';
      @prop({value: false}) public field2: boolean;
    }
    customElements.define('attr-writable-override-1', TestElement);
    customElements.define('attr-writable-override-2', TestElement2);

    test('should override @attr and @boolAttr decorator', () => {
      const el = new TestElement();
      expect(el.field).toBe('test');
      expect(el.field2).toBe(true);
    });
    test('override should not be writeable', () => {
      const el = new TestElement();
      expect(() => el.field = 'hi').toThrowError();
      expect(() => el.field2 = false).toThrowError();
    });
    test('should have undefined as a default', () => {
      const el = new TestElement2();
      expect(el.field).toBe('test2');
      expect(el.field2).toBe(false);
    });
  });

  describe('Overriding @boolAttr', () => {
    class TestElement extends TestBaseElement {
      @prop({value: true})
      public field2: boolean;
    }
    customElements.define('bool-attr-override-1', TestElement);

    test('should override simple @boolAttr decorator', () => {
      const el = new TestElement();
      expect(el.field2).toBe(true);
    });
    test('override should be writeable', () => {
      const el = new TestElement();
      el.field2 = false;
      expect(el.field2).toBe(false);
    });
    test('original decorator should not be executed', () => {
      const el = new TestElement();
      expect(el.getAttribute('field2')).toBe(null);
    });
  });

  describe('Overriding @jsonAttr', () => {
    class TestElement extends TestBaseElement {
      @prop({value: {a: 2}})
      public field3: {a: number};
    }
    customElements.define('json-attr-override-1', TestElement);

    test('should override simple @jsonAttr decorator', () => {
      const el = new TestElement();
      expect(el.field3).toEqual({a: 2});
    });
    test('override should be writeable', () => {
      const el = new TestElement();
      el.field3 = {a: 4};
      expect(el.field3).toEqual({a: 4});
    });
    test('original decorator should not be executed', () => {
      const el = new TestElement();
      expect(el.getAttribute('field3')).toBe(null);
    });
  });

  describe('Overridden property can be defined through ES initial value ', () => {
    class TestElement extends TestBaseElement {
      @prop()
      public field: string = '123';
    }
    customElements.define('es-initial-attr-override-1', TestElement);

    test('should override simple @attr decorator', () => {
      const el = new TestElement();
      expect(el.field).toBe('123');
    });
  });

  test('Overriding own property produce error', () => {
    expect(() => {
      class TestElement extends HTMLElement {
        @prop({value: ''})
        @attr()
        public field: string;
      }
      new TestElement();
    }).toThrowError(/own property/);
  });
});

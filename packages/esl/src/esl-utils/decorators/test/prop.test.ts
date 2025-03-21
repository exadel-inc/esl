import '../../../../polyfills/es5-target-shim';

import {attr, boolAttr, jsonAttr} from '../../../esl-utils/decorators';
import {prop} from '../prop';

describe('Decorator: @prop', () => {
  test('Declared property can be defined instance based through ES initial value', () => {
    class TestClass {
      @prop()
      public field: string = '123';
    }

    const el = new TestClass();
    expect(el.field).toBe('123');
    expect(Object.getOwnPropertyDescriptor(el, 'field')).not.toBeNull();
  });

  describe('Provider based property resolves value trough it', () => {
    const provider = jest.fn();
    class TestClass {
      @prop(provider)
      public field: any;

      @prop(provider, {readonly: true})
      public readonlyField: any;

      @prop(provider, {enumerable: true})
      public enumerableField: any;
    }

    test('If provider function passed - value resolves trough it', () => {
      const obj = new TestClass();
      provider.mockReturnValue('initial');
      expect(obj.field).toBe('initial');
      provider.mockReturnValue('new');
      expect(obj.field).toBe('new');
    });

    test('If provider function passed - provider receives instance as a context and argument', () => {
      provider.mockImplementation(function () { return this; });
      const obj = new TestClass();
      expect(obj.field).toBe(obj);
      expect(provider).toHaveBeenCalledWith(obj);
    });

    test('If provider function passed - resolver declared on prototype level', () => {
      const obj = new TestClass();
      expect(Object.hasOwnProperty.call(obj, 'field')).toBe(false);
      expect(Object.getOwnPropertyDescriptor(TestClass.prototype, 'field')).not.toBeNull();
    });

    test('If provider function passed - value can be overwritten on instance', () => {
      const obj = new TestClass();
      const obj2 = new TestClass();
      provider.mockReturnValue('initial');
      obj.field = 'new';
      expect(obj.field).toBe('new');
      expect(obj2.field).toBe('initial');
    });

    test('If provider function passed - overwritten value could be cleared with delete', () => {
      const obj = new TestClass();
      provider.mockReturnValue('initial');
      obj.field = 'new';
      expect(obj.field).toBe('new');
      delete obj.field;
      expect(obj.field).toBe('initial');
    });

    test('If provider function passed - readonly property should ignores overwritten value', () => {
      const obj = new TestClass();
      provider.mockReturnValue('initial');
      obj.readonlyField = 'new';
      expect(obj.readonlyField).toBe('initial');
    });

    test('If provider function passed - property is not enumerable by default', () => {
      expect(Object.keys(TestClass.prototype)).not.toContain('field');
    });

    test('If provider function passed - enumerable property should be enumerable', () => {
      expect(Object.keys(TestClass.prototype)).toContain('enumerableField');
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

  describe('Overriding @attr works fine', () => {
    class TestBaseElement extends HTMLElement {
      @attr()
      public field: string;
      @attr()
      public field4?: string;
      @attr({readonly: true})
      public readonlyField: string;
    }
    class TestElement extends TestBaseElement {
      @prop('test')
      public override field: string;
      @prop()
      public override field4?: string;
      @prop('test')
      public override readonlyField: string;
    }
    customElements.define('attr-override-1', TestElement);

    test('@prop should override simple @attr decorator', () => {
      const el = new TestElement();
      expect(el.field).toBe('test');
    });
    test('@prop should override readonly @attr decorator', () => {
      const el = new TestElement();
      expect(el.readonlyField).toBe('test');
    });
    test('@prop override should be writeable', () => {
      const el = new TestElement();
      el.field = el.readonlyField = 'hi';
      expect(el.field).toBe('hi');
      expect(el.readonlyField).toBe('hi');
    });
    test('Original decorator should not be executed', () => {
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

  describe('Overriding @boolAttr works fine', () => {
    class TestBaseElement extends HTMLElement {
      @boolAttr()
      public field: boolean;
    }
    class TestElement extends TestBaseElement {
      @prop(true)
      public override field: boolean;
    }
    customElements.define('bool-attr-override-1', TestElement);

    test('@prop should override simple @boolAttr decorator', () => {
      const el = new TestElement();
      expect(el.field).toBe(true);
    });
    test('@prop override should be writeable', () => {
      const el = new TestElement();
      el.field = false;
      expect(el.field).toBe(false);
    });
    test('Original decorator should not be executed', () => {
      const el = new TestElement();
      el.field = true;
      expect(el.getAttribute('field2')).toBe(null);
    });
  });

  describe('Overriding @jsonAttr with @prop works fine', () => {
    class TestBaseElement extends HTMLElement {
      @jsonAttr()
      public field: {a: number};
    }
    class TestElement extends TestBaseElement {
      @prop({a: 2})
      public override field: {a: number};
    }
    customElements.define('json-attr-override-1', TestElement);

    test('@prop should override simple @jsonAttr decorator', () => {
      const el = new TestElement();
      expect(el.field).toEqual({a: 2});
    });
    test('@prop override should be writeable by default', () => {
      const el = new TestElement();
      el.field = {a: 4};
      expect(el.field).toEqual({a: 4});
    });
    test('Original decorator should not be executed', () => {
      const el = new TestElement();
      el.field = {a: 4};
      expect(el.getAttribute('field')).toBe(null);
    });
  });

  describe('Overriding chain, with a non writable @prop', () => {
    class TestBaseElement extends HTMLElement {
      @attr()
      public field: string;
      @boolAttr()
      public field2: boolean;
    }
    class TestElement extends TestBaseElement {
      @prop('test', {readonly: true}) public override field: string;
      @prop(true, {readonly: true}) public override field2: boolean;
    }
    class TestElement2 extends TestElement {
      @prop() public override field: string = 'test2';
      @prop(false) public override field2: boolean;
    }
    customElements.define('attr-writable-override-1', TestElement);
    customElements.define('attr-writable-override-2', TestElement2);

    test('Double overriding works fine', () => {
      const el = new TestElement2();
      expect(el.field).toBe('test2');
      expect(el.field2).toBe(false);
    });
  });
});

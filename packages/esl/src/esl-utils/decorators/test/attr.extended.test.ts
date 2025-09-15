import {attr} from '../attr';
import {setAttr} from '../../dom/attr';
import {parseBoolean, toBooleanAttribute} from '../../misc/format';

describe('Decorator: attr', () => {
  describe('Decorator: attr - number parser', () => {
    class TestElement extends HTMLElement {
      @attr({parser: parseFloat})
      public attrNumber: number;
    }
    customElements.define('test-el-attr-ext-1', TestElement);
    const $el = new TestElement();
    customElements.upgrade($el);

    test('Initial value is set', () => expect($el.attrNumber).toBe(NaN));

    test('Setting a null leads to remove of the attribute with a correct parsing state', () => {
      $el.attrNumber = 1;
      $el.attrNumber = null as any;
      expect($el.attrNumber).toBe(NaN);
      expect($el.hasAttribute('attr-number')).toBe(false);
    });

    test.each([
      ['0', 0],
      ['1', 1],
      ['2', 2],
      [' 1 ', 1]
    ])('Setting a "%s" value leeds to attribute creation', (attrVal: string, value: number) => {
      setAttr($el, 'attr-number', attrVal);
      expect($el.attrNumber).toBe(value);
    });
  });

  describe('Decorator: attr - boolean parser', () => {
    class TestElement extends HTMLElement {
      @attr({parser: parseBoolean, serializer: Boolean})
      public attrBoolean: boolean;
    }
    customElements.define('test-el-attr-ext-2', TestElement);
    const $el = new TestElement();
    customElements.upgrade($el);

    test('Initial value is set', () => expect($el.attrBoolean).toBe(false));

    test('Setting a null leads to remove of the attribute with a correct parsing state', () => {
      $el.attrBoolean = true;
      $el.attrBoolean = null as any;
      expect($el.attrBoolean).toBe(false);
      expect($el.hasAttribute('attr-boolean')).toBe(false);
    });

    test.each(
      ['true', '1', '']
    )('Setting a "%s" value leeds to attribute creation', (value) => {
      setAttr($el, 'attr-boolean', value);
      expect($el.attrBoolean).toBe(true);
    });
    test.each(
      ['false', '0', null]
    )('Setting a "%s" value leeds to attribute removal', (value) => {
      setAttr($el, 'attr-boolean', value);
      expect($el.attrBoolean).toBe(false);
    });
  });

  describe('Decorator: attr - boolean serializer', () => {
    class TestElement extends HTMLElement {
      @attr({parser: parseBoolean, serializer: toBooleanAttribute})
      public attrBoolean: boolean;
    }
    customElements.define('test-el-attr-ext-3', TestElement);
    const $el = new TestElement();
    customElements.upgrade($el);

    test.each(
      [undefined, null]
    )('Setting a %o value leeds to attribute removal', () => {
      $el.attrBoolean = undefined as any;
      expect($el.hasAttribute('attr-boolean')).toBe(false);
    });

    test.each(
      [false, 'false', 0, '0', '']
    )('Setting a %o value consider as FALSY', (val: any) => {
      $el.attrBoolean = val;
      expect($el.attrBoolean).toBe(false);
      expect($el.getAttribute('attr-boolean')).toBe('false');
    });

    test.each(
      [true, 'true', 1, '1', ' ']
    )('Setting a %o value consider as TRUTHY', (val: any) => {
      $el.attrBoolean = val;
      expect($el.attrBoolean).toBe(true);
      expect($el.getAttribute('attr-boolean')).toBe('true');
    });
  });
});

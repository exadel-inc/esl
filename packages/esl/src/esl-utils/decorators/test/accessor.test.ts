import {attr} from '../attr';
import {boolAttr} from '../bool-attr';
import {jsonAttr} from '../json-attr';
import {prop} from '../prop';

describe('Decorators: accessor class members support', () => {

  class TestElement extends HTMLElement {
    @attr()
    public accessor strField: string | boolean;
    @attr({defaultValue: 'strDef'})
    public accessor strFieldDef: string | boolean;
    @attr({readonly: true})
    public accessor strReadonly: string | null;

    @boolAttr()
    public accessor boolField: boolean;

    @jsonAttr({defaultValue: {a: 1}})
    public accessor jsonField: Record<string, unknown>;

    @prop('prop-value')
    public accessor propField: string;
    @prop(() => 'propProvided')
    public accessor propProvided: string;
    @prop(() => 'propRo', {readonly: true})
    public accessor propReadonly: string;
  }

  customElements.define('test-el-accessor', TestElement);
  const el = new TestElement();

  beforeAll(() => {
    document.body.append(el);
  });

  test('@attr on accessor member maps to the attribute', () => {
    expect(el.strField).toBe('');
    el.strField = 'value';
    expect(el.strField).toBe('value');
    expect(el.getAttribute('str-field')).toBe('value');
    el.strField = false;
    expect(el.strField).toBe('');
    expect(el.hasAttribute('str-field')).toBe(false);
  });

  test('@attr with defaultValue on accessor member', () => {
    expect(el.strFieldDef).toBe('strDef');
    el.strFieldDef = 'other';
    expect(el.strFieldDef).toBe('other');
    expect(el.getAttribute('str-field-def')).toBe('other');
  });

  test('@attr readonly on accessor member ignores writes', () => {
    el.setAttribute('str-readonly', 'strRo');
    expect(el.strReadonly).toBe('strRo');
    el.strReadonly = 'ignored';
    expect(el.strReadonly).toBe('strRo');
  });

  test('@boolAttr on accessor member maps to the marker attribute', () => {
    expect(el.boolField).toBe(false);
    el.boolField = true;
    expect(el.boolField).toBe(true);
    expect(el.hasAttribute('bool-field')).toBe(true);
    el.boolField = false;
    expect(el.boolField).toBe(false);
    expect(el.hasAttribute('bool-field')).toBe(false);
  });

  test('@jsonAttr on accessor member maps to the JSON attribute', () => {
    expect(el.jsonField).toEqual({a: 1});
    el.jsonField = {b: 2};
    expect(el.jsonField).toEqual({b: 2});
    expect(el.getAttribute('json-field')).toBe('{"b":2}');
  });

  test('@prop on accessor member defines a static value overriding the auto-accessor', () => {
    expect(el.propField).toBe('prop-value');
    el.propField = 'changed';
    expect(el.propField).toBe('changed');
  });

  test('@prop provider on accessor member resolves value through the provider', () => {
    expect(el.propProvided).toBe('propProvided');
  });

  test('@prop readonly provider on accessor member ignores writes', () => {
    expect(el.propReadonly).toBe('propRo');
    el.propReadonly = 'changed';
    expect(el.propReadonly).toBe('propRo');
  });

  test('@prop on a non-accessor own property throws', () => {
    class Base {
      public field(): void {}
    }
    expect(() => prop('value')(Base.prototype, 'field')).toThrow(TypeError);
    expect(() => prop('value')(Base.prototype, 'field')).toThrow('Can\'t override own property');
  });
});

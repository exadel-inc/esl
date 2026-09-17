import {attr} from '../attr';

describe('Decorator: attr (accessor class members)', () => {

  class TestElement extends HTMLElement {
    @attr()
    public accessor strField: string | boolean;
    @attr({defaultValue: 'strDef'})
    public accessor strFieldDef: string | boolean;
    @attr({readonly: true})
    public accessor strReadonly: string | null;
  }

  customElements.define('test-el-attr-accessor', TestElement);
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
});

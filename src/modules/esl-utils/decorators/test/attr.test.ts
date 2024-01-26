import '../../../../polyfills/es5-target-shim';
import {attr} from '../attr';

describe('Decorator: attr', () => {

  class TestElement extends HTMLElement {
    @attr()
    public fieldDefault: string | boolean;
    @attr({defaultValue: null})
    public noDefault: string | boolean | null;
    @attr({dataAttr: true})
    public dataField: string | null;
    @attr({name: 'test-attr'})
    public renamedField: string | null;
    @attr({name: 'testAttr', dataAttr: true})
    public renamedField2: string | null;
    @attr({readonly: true})
    public readonlyField: string | null;
    @attr({defaultValue: 'def'})
    public defField: string | boolean;
    @attr({defaultValue: () => 'test-provider'})
    public defProvider: string;
  }
  customElements.define('test-el-attr', TestElement);
  const el = new TestElement();

  beforeAll(() => {
    document.body.append(el);
  });

  test('Decorator: attr - simple', () => {
    expect(el.fieldDefault).toBe('');
    el.fieldDefault = '';
    expect(el.fieldDefault).toBe('');
    expect(el.getAttribute('field-default')).toBe('');
    el.fieldDefault = '1';
    expect(el.fieldDefault).toBe('1');
    expect(el.getAttribute('field-default')).toBe('1');
    el.fieldDefault = false;
    expect(el.fieldDefault).toBe('');
    expect(el.hasAttribute('field-default')).toBe(false);
  });

  test('Decorator: attr - bool', () => {
    expect(el.noDefault).toBe(null);
    el.noDefault = true;
    expect(el.noDefault).toBe('');
    expect(el.hasAttribute('no-default')).toBe(true);
    el.noDefault = false;
    expect(el.noDefault).toBe(null);
    expect(el.hasAttribute('no-default')).toBe(false);
  });

  test('Decorator: attr - data attr', () => {
    expect(el.dataField).toBe('');
    el.dataField = '';
    expect(el.dataField).toBe('');
    expect(el.dataset.dataField).toBe('');
    el.dataField = '1';
    expect(el.dataField).toBe('1');
    expect(el.dataset.dataField).toBe('1');
  });

  test('Decorator: attr - renamed attr 1', () => {
    expect(el.renamedField).toBe('');
    el.renamedField = '';
    expect(el.renamedField).toBe('');
    expect(el.getAttribute('test-attr')).toBe('');
    el.renamedField = '1';
    expect(el.renamedField).toBe('1');
    expect(el.getAttribute('test-attr')).toBe('1');
  });

  test('Decorator: attr - renamed attr 2', () => {
    expect(el.renamedField2).toBe('');
    el.renamedField2 = '';
    expect(el.renamedField2).toBe('');
    expect(el.getAttribute('data-test-attr')).toBe('');
    el.renamedField2 = '1';
    expect(el.renamedField2).toBe('1');
    expect(el.getAttribute('data-test-attr')).toBe('1');
  });

  test('Decorator: attr - readonly attr', () => {
    expect(el.readonlyField).toBe('');
    expect(() => {el.readonlyField = '';}).toThrowError();
    expect(el.readonlyField).toBe('');
    expect(el.hasAttribute('readonly-field')).toBeFalsy();
    el.setAttribute('readonly-field', '1');
    expect(el.readonlyField).toBe('1');
  });

  test('Decorator: attr - default value', () => {
    expect(el.defField).toBe('def');
    el.defField = '';
    expect(el.defField).toBe('');
    expect(el.getAttribute('def-field')).toBe('');
    el.defField = '1';
    expect(el.defField).toBe('1');
    expect(el.getAttribute('def-field')).toBe('1');
    el.defField = false;
    expect(el.defField).toBe('def');
    expect(el.hasAttribute('def-field')).toBe(false);
    expect(el.defProvider).toBe('test-provider');
    el.defProvider = '';
    expect(el.defProvider).toBe('');
  });

  afterAll(() => {
    document.body.removeChild(el);
  });
});

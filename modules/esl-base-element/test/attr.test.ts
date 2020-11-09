import '../../../polyfills/es5-target-shim';
import {ESLBaseElement, attr} from '../core';

describe('Decorator: attr', () => {

  class TestElement extends ESLBaseElement {
    @attr()
    public fieldDefault: string | boolean;
    @attr({dataAttr: true})
    public dataField: string;
    @attr({name: 'test-attr'})
    public renamedField: string;
    @attr({readonly: true})
    public readonlyField: string;
    @attr({defaultValue: 'def'})
    public defField: string | boolean;
  }

  TestElement.register('test-el-attr');
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

  test('Decorator: attr - data attr', () => {
    expect(el.dataField).toBe('');
    el.dataField = '';
    expect(el.dataField).toBe('');
    expect(el.dataset.dataField).toBe('');
    el.dataField = '1';
    expect(el.dataField).toBe('1');
    expect(el.dataset.dataField).toBe('1');
  });

  test('Decorator: attr - renamed attr', () => {
    expect(el.renamedField).toBe('');
    el.renamedField = '';
    expect(el.renamedField).toBe('');
    expect(el.getAttribute('test-attr')).toBe('');
    el.renamedField = '1';
    expect(el.renamedField).toBe('1');
    expect(el.getAttribute('test-attr')).toBe('1');
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
  });

  afterAll(() => {
    document.body.removeChild(el);
  });
});

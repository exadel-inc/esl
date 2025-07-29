import '../../../../polyfills/es5-target-shim';
import {jsonAttr} from '../json-attr';

describe('Decorator: jsonAttr', () => {

  class TestElement extends HTMLElement {
    @jsonAttr()
    public simple: any;
    @jsonAttr({dataAttr: true})
    public dataField: any;
    @jsonAttr({name: 'test-attr'})
    public renamedField: any;
    @jsonAttr({name: 'testAttr', dataAttr: true})
    public renamedField2: any;
    @jsonAttr({readonly: true})
    public readonlyField: any;
    @jsonAttr({defaultValue: {a: 1}})
    public defSimple: any;
  }

  customElements.define('test-el-bool', TestElement);
  const el = new TestElement();

  beforeAll(() => {
    document.body.append(el);
  });

  test('Decorator: jsonAttr - simple', () => {
    expect(el.simple).toEqual({});
    el.simple = {};
    expect(el.simple).toEqual({});
    expect(el.getAttribute('simple')).toBe('{}');
    el.simple = {a: 1};
    expect(el.simple).toEqual({a: 1});
    expect(el.getAttribute('simple')).toBe('{"a":1}');
    el.setAttribute('simple', '{b: 2}');
    expect(el.simple).toEqual({b: 2});
  });

  test('Decorator: jsonAttr - data attr', () => {
    expect(el.dataField).toEqual({});
    el.dataField = {};
    expect(el.dataField).toEqual({});
    expect(el.getAttribute('data-data-field')).toBe('{}');
    el.dataField = {a: 1};
    expect(el.dataField).toEqual({a: 1});
    expect(el.getAttribute('data-data-field')).toBe('{"a":1}');
    el.setAttribute('data-data-field', '{b: 2}');
    expect(el.dataField).toEqual({b: 2});
  });

  test('Decorator: jsonAttr - renamed attr 1', () => {
    expect(el.renamedField).toEqual({});
    el.renamedField = {};
    expect(el.renamedField).toEqual({});
    expect(el.getAttribute('test-attr')).toBe('{}');
    el.renamedField = {a: 1};
    expect(el.renamedField).toEqual({a: 1});
    expect(el.getAttribute('test-attr')).toBe('{"a":1}');
    el.setAttribute('test-attr', '{b: 2}');
    expect(el.renamedField).toEqual({b: 2});
  });

  test('Decorator: jsonAttr - renamed attr 2', () => {
    expect(el.renamedField2).toEqual({});
    el.renamedField2 = {};
    expect(el.renamedField2).toEqual({});
    expect(el.getAttribute('data-test-attr')).toBe('{}');
    el.renamedField2 = {a: 1};
    expect(el.renamedField2).toEqual({a: 1});
    expect(el.getAttribute('data-test-attr')).toBe('{"a":1}');
    el.setAttribute('data-test-attr', '{b: 2}');
    expect(el.renamedField2).toEqual({b: 2});
  });

  test('Decorator: jsonAttr - readonly attr', () => {
    expect(el.readonlyField).toEqual({});
    expect(() => { el.readonlyField = {}; }).toThrow();
    expect(el.readonlyField).toEqual({});
    el.setAttribute('readonly-field', '{b: 2}');
    expect(el.readonlyField).toEqual({b: 2});
  });

  test('Decorator: jsonAttr - default simple', () => {
    expect(el.defSimple).toEqual({a: 1});
    el.defSimple = {};
    expect(el.defSimple).toEqual({});
    expect(el.getAttribute('def-simple')).toBe('{}');
    el.defSimple = {a: 3};
    expect(el.defSimple).toEqual({a: 3});
    expect(el.getAttribute('def-simple')).toBe('{"a":3}');
    el.setAttribute('def-simple', '{b: 2}');
    expect(el.defSimple).toEqual({b: 2});
  });

  test('Decorator: jsonAttr - error test', () => {
    let throwError = false;
    jest.spyOn(console, 'error').mockImplementation(() => {throwError = true;});
    el.simple = {};
    expect(el.simple).toEqual({});
    const t: any = {};
    t.t = t;
    el.simple = t;
    expect(el.simple).toEqual({});
    expect(el.getAttribute('simple')).toBe('{}');
    expect(throwError).toBe(true);
  });

  test('Decorator: jsonAttr - error test 2', () => {
    let throwError = false;
    jest.spyOn(console, 'error').mockImplementation(() => {throwError = true;});
    el.simple = {};
    el.simple = NaN;
    expect(el.simple).toEqual({});
    expect(throwError).toBe(true);
  });

  test('Decorator: jsonAttr - remove', () => {
    el.simple = {a: 1};
    expect(el.hasAttribute('simple')).toBe(true);
    el.simple = null;
    expect(el.hasAttribute('simple')).toBe(false);
  });

  test('Decorator: jsonAttr - parse test', () => {
    let throwWarn = false;
    jest.spyOn(console, 'warn').mockImplementation(() => {throwWarn = true;});
    el.simple = {};
    expect(el.getAttribute('simple')).toBe('{}');
    el.setAttribute('simple', '{');
    expect(el.simple).toEqual({});
    expect(throwWarn).toBe(true);
  });
});

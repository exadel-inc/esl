import '../../../polyfills/es5-target-shim';
import {ESLBaseElement} from '../ts/esl-base-element';
import {jsonAttr} from '../ts/decorators/json-attr';

describe('Decorator: jsonAttr', () => {

  class TestElement extends ESLBaseElement {
    @jsonAttr()
    public simple: any;
    @jsonAttr({dataAttr: true})
    public dataField: any;
    @jsonAttr({name: 'test-attr'})
    public renamedField: any;
    @jsonAttr({readonly: true})
    public readonlyField: any;
    @jsonAttr({default: {a: 1}})
    public defSimple: any;
  }

  TestElement.register('test-el-bool');

  const el = new TestElement();
  document.body.append(el);

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

  test('Decorator: jsonAttr - renamed attr', () => {
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

  test('Decorator: jsonAttr - readonly attr', () => {
    expect(el.readonlyField).toEqual({});
    expect(() => { el.readonlyField = {}; }).toThrowError();
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
    jest.spyOn(console, 'error')
      .mockImplementation(() => expect(true).toBe(true));
    el.simple = {};
    expect(el.simple).toEqual({});
    const t: any = {};
    t.t = t;
    el.simple = t;
    expect(el.simple).toEqual({});
    expect(el.getAttribute('simple')).toBe('{}');
  });

  test('Decorator: jsonAttr - error test 2', () => {
    jest.spyOn(console, 'error')
      .mockImplementation(() => expect(true).toBe(true));
    el.simple = {};
    el.simple = NaN;
    expect(el.simple).toEqual({});
  });

  test('Decorator: jsonAttr - remove', () => {
    el.simple = {a: 1};
    expect(el.hasAttribute('simple')).toBe(true);
    el.simple = null;
    expect(el.hasAttribute('simple')).toBe(false);
  });
});


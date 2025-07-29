import '../../../../polyfills/es5-target-shim';
import {boolAttr} from '../bool-attr';

describe('Decorator: boolAttr', () => {

  class TestElement extends HTMLElement {
    @boolAttr()
    public fieldDefault: boolean;
    @boolAttr({dataAttr: true})
    public dataField: boolean;
    @boolAttr({name: 'test-attr'})
    public renamedField: boolean;
    @boolAttr({name: 'testAttr', dataAttr: true})
    public renamedField2: boolean;
    @boolAttr({readonly: true})
    public readonlyField: boolean;
  }

  customElements.define('test-el-bool', TestElement);
  const el = new TestElement();

  beforeAll(() => {
    document.body.append(el);
  });

  test('Decorator: boolAttr - simple', () => {
    expect(el.fieldDefault).toBe(false);
    el.fieldDefault = true;
    expect(el.fieldDefault).toBe(true);
    expect(el.hasAttribute('field-default')).toBe(true);
    el.fieldDefault = false;
    expect(el.fieldDefault).toBe(false);
    expect(el.hasAttribute('field-default')).toBe(false);
  });

  test('Decorator: boolAttr - data attr', () => {
    expect(el.dataField).toBe(false);
    el.dataField = true;
    expect(el.dataField).toBe(true);
    expect(el.hasAttribute('data-data-field')).toBe(true);
    el.dataField = false;
    expect(el.dataField).toBe(false);
    expect(el.hasAttribute('data-data-field')).toBe(false);
  });

  test('Decorator: boolAttr - renamed attr 1', () => {
    expect(el.renamedField).toBe(false);
    el.renamedField = true;
    expect(el.renamedField).toBe(true);
    expect(el.hasAttribute('test-attr')).toBe(true);
    el.renamedField = false;
    expect(el.renamedField).toBe(false);
    expect(el.hasAttribute('test-attr')).toBe(false);
  });

  test('Decorator: boolAttr - renamed attr 2', () => {
    expect(el.renamedField2).toBe(false);
    el.renamedField2 = true;
    expect(el.renamedField2).toBe(true);
    expect(el.hasAttribute('data-test-attr')).toBe(true);
    el.renamedField2 = false;
    expect(el.renamedField2).toBe(false);
    expect(el.hasAttribute('data-test-attr')).toBe(false);
  });

  test('Decorator: boolAttr - readonly attr', () => {
    expect(el.readonlyField).toBe(false);
    expect(() => {el.readonlyField = true;}).toThrow();
    expect(el.readonlyField).toBe(false);
    expect(el.hasAttribute('readonly-field')).toBeFalsy();
    el.setAttribute('readonly-field', '1');
    expect(el.readonlyField).toBe(true);
  });

  afterAll(() => {
    document.body.removeChild(el);
  });
});

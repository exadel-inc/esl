import '../../../polyfills/es5-target-shim';
import {ESLBaseElement} from '../ts/esl-base-element';
import {boolAttr} from '../ts/decorators/bool-attr';

describe('Decorator: boolAttr', () => {

  class TestElement extends ESLBaseElement {
    @boolAttr()
    public fieldDefault: boolean;
    @boolAttr({dataAttr: true})
    public dataField: boolean;
    @boolAttr({name: 'test-attr'})
    public renamedField: boolean;
    @boolAttr({readonly: true})
    public readonlyField: boolean;
  }

  TestElement.register('test-el-bool');

  const el = new TestElement();
  document.body.append(el);

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

  test('Decorator: boolAttr - renamed attr', () => {
    expect(el.renamedField).toBe(false);
    el.renamedField = true;
    expect(el.renamedField).toBe(true);
    expect(el.hasAttribute('test-attr')).toBe(true);
    el.renamedField = false;
    expect(el.renamedField).toBe(false);
    expect(el.hasAttribute('test-attr')).toBe(false);
  });

  test('Decorator: boolAttr - readonly attr', () => {
    expect(el.readonlyField).toBe(false);
    expect(() => {el.readonlyField = true;}).toThrowError();
    expect(el.readonlyField).toBe(false);
    expect(el.hasAttribute('readonly-field')).toBeFalsy();
    el.setAttribute('readonly-field', '1');
    expect(el.readonlyField).toBe(true);
  });
});

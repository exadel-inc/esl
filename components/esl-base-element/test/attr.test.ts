import '../../../polyfills/es5-target-shim';
import {attr} from '../ts/decorators/attr';
import {ESLBaseElement} from '../ts/esl-base-element';

describe('esl-trigger', () => {

  class TestElement extends ESLBaseElement {
    @attr()
    public fieldDefault: string;
    @attr({dataAttr: true})
    public dataField: string;
    @attr({name: 'test-attr'})
    public renamedField: string;
    @attr({readonly: true})
    public readonlyField: string;
    @attr({defaultValue: 'def'})
    public defField: string;
  }

  TestElement.register('test-el');

  const el = new TestElement();
  document.body.append(el);

  test('Decorator: attr - simple', () => {
    el.fieldDefault = '';
    expect(el.fieldDefault).toBe('');
    expect(el.getAttribute('field-default')).toBe('');
    el.fieldDefault = '1';
    expect(el.fieldDefault).toBe('1');
    expect(el.getAttribute('field-default')).toBe('1');
  });
  // TODO: more tests
});

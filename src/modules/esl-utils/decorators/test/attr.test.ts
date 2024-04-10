import '../../../../polyfills/es5-target-shim';
import {attr} from '../attr';
import {ESLTestTemplate} from '../../test/template';

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

  describe('Inherit parameter', () => {

    class ThirdElement extends HTMLElement {
      @attr({inherit: 'box'})
      public container: string;
      @attr({inherit: 'parent', dataAttr: true})
      public ignore: string;
      @attr({inherit: true})
      public disallow: string;
      @attr({inherit: true, dataAttr: true})
      public allow: string;
    }
    customElements.define('third-el', ThirdElement);

    class SecondElement extends HTMLElement {}
    customElements.define('second-el', SecondElement);

    const SCOPE: any = {
      firstEl: '#first-el',
      secondEl: '#second-el',
      thirdEl: '#third-el',
    };
    const TEMPLATE = ESLTestTemplate.create(`
      <div id="first-el">
        <second-el id="second-el">
          <third-el id="third-el"></third-el>
        </second-el>
      </div>
    `, SCOPE).bind('beforeeach');

    describe('Inherit searches for the closest element with explicitly declared name', () => {
      //  @attr({inherit: 'box'}) public container: string;
      test('The attribute inherit the value from own same-named attribute', () => {
        TEMPLATE.$thirdEl.setAttribute('container', 'value');
        expect(TEMPLATE.$thirdEl.container).toBe('value');
      });
      test('Own attribute setter changes the own value', () => {
        TEMPLATE.$thirdEl.container = 'container';
        expect(TEMPLATE.$thirdEl.container).toBe('container');
      });
      test('The value should be resolved from the closest DOM element (custom-element)', () => {
        TEMPLATE.$secondEl.setAttribute('box', 'carousel');
        expect(TEMPLATE.$thirdEl.container).toBe('carousel');
      });
      test('The value resolves from the closest element (non-custom-element) in DOM', () => {
        TEMPLATE.$firstEl.setAttribute('box', 'slide');
        expect(TEMPLATE.$thirdEl.container).toBe('slide');
      });
      test('Elements with declared inherit are absent in DOM and returns empty string', () => {
        expect(TEMPLATE.$thirdEl.container).toBe('');
      });
    });

    describe('Inherit searches for the closest element with explicitly declared data attribute name', () => {
      // @attr({inherit: 'parent', dataAttr: true}) public ignore: string;
      test('The attribute inherit the value from the same-named data-attribute', () => {
        TEMPLATE.$thirdEl.setAttribute('data-ignore', 'swipe');
        expect(TEMPLATE.$thirdEl.ignore).toBe('swipe');
      });
      test('Own attribute setter changes the own value', () => {
        TEMPLATE.$thirdEl.ignore = 'touch';
        expect(TEMPLATE.$thirdEl.ignore).toBe('touch');
      });
      test('The value resolves from the closest element (custom-element) in DOM', () => {
        TEMPLATE.$secondEl.setAttribute('parent', 'close');
        expect(TEMPLATE.$thirdEl.ignore).toBe('close');
      });
      test('The value resolves from the closest element (non-custom-element) in DOM', () => {
        TEMPLATE.$firstEl.setAttribute('parent', 'open');
        expect(TEMPLATE.$thirdEl.ignore).toBe('open');
      });
      test('Elements with declared inherit are absent in DOM and returns empty string', () => {
        expect(TEMPLATE.$thirdEl.ignore).toBe('');
      });
    });

    describe('Inherit searches for the closest element with the same attribute name in DOM', () => {
      // @attr({inherit: true}) public disallow: string;
      test('The attribute inherit the value from the same attribute name', () => {
        TEMPLATE.$thirdEl.disallow = 'scroll';
        expect(TEMPLATE.$thirdEl.disallow).toBe('scroll');
      });
      test('The value resolves from the closest element (custom-element) in DOM with the same attribute name', () => {
        TEMPLATE.$secondEl.setAttribute('disallow', 'activator');
        expect(TEMPLATE.$thirdEl.disallow).toBe('activator');
      });
      test('The value resolves from the closest element (non-custom-element) in DOM with the same attribute name', () => {
        TEMPLATE.$firstEl.setAttribute('disallow', 'deactivator');
        expect(TEMPLATE.$thirdEl.disallow).toBe('deactivator');
      });
      test('Elements with declared inherit are absent in DOM and returns empty string', () => {
        expect(TEMPLATE.$thirdEl.disallow).toBe('');
      });
    });

    describe('Inherit searches for the closest element with the same data-attribute name in DOM', () => {
      // @attr({inherit: true, dataAttr: true}) public allow: string;
      test('The attribute inherit the value from the same attribute name', () => {
        TEMPLATE.$thirdEl.allow = 'option';
        expect(TEMPLATE.$thirdEl.allow).toBe('option');
      });
      test('The value resolves from the closest element (custom-element) in DOM with the same data-attribute name', () => {
        TEMPLATE.$secondEl.setAttribute('data-allow', 'scroll');
        expect(TEMPLATE.$thirdEl.allow).toBe('scroll');
      });
      test('The value resolves from the closest element (non-custom-element) in DOM with the same data-attribute name', () => {
        TEMPLATE.$firstEl.setAttribute('data-allow', 'swipe');
        expect(TEMPLATE.$thirdEl.allow).toBe('swipe');
      });
      test('Elements with declared inherit are absent in DOM and returns empty string', () => {
        expect(TEMPLATE.$thirdEl.allow).toBe('');
      });
    });
  });

  afterAll(() => {
    document.body.removeChild(el);
  });
});

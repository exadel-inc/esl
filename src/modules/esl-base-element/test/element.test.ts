import '../../../polyfills/es5-target-shim';
import {ESLBaseElement} from '../core';

describe('ESLBaseElement', () => {

  class TestElement extends ESLBaseElement {
    public static eventNs = 'esl:test';
  }
  class TestElement2 extends ESLBaseElement {}

  TestElement.register('test-el-basic');
  const el = new TestElement();

  beforeEach(() => {
    document.body.append(el);
  });
  afterEach(() => {
    if (!el.parentElement) return;
    document.body.removeChild(el);
  });

  test('ESLBaseElement livecycle', () => {
    expect(el).toBeInstanceOf(HTMLElement);
    expect(el.connected).toBe(true);
    document.body.removeChild(el);
    setTimeout(() => {
      expect(el.connected).toBe(false);
    }, 0);
  }, 100);

  test('ESLBaseElement register validate', () => {
    // Tag is not empty
    expect(() => TestElement2.register('')).toThrowError();
    TestElement2.register('test-test');
    return customElements.whenDefined('test-test')
      .then(() => {
        expect(() => TestElement2.register('test-test')).not.toThrowError();
        TestElement2.is = 'test-test-2';
        // Tag inconsistency
        expect(() => TestElement2.register('test-test')).toThrowError();
      });
  });

  describe('ESLBaseElement prototype', () => {
    test('ESLBaseElement $attr', () => {
      const attrName = 'test-attr';
      const val = el.getAttribute(attrName);
      expect(el.$$attr(attrName)).toBe(val);
      expect(el.$$attr(attrName, 'test')).toBe(val);
      expect(el.$$attr(attrName)).toBe('test');
    });
    test('ESLBaseElement $attr boolean', () => {
      const attrName = 'test-attr-bool';
      const val = el.getAttribute(attrName);
      expect(el.$$attr(attrName)).toBe(val);
      expect(el.$$attr(attrName, true)).toBe(val);
      expect(el.$$attr(attrName)).toBe('');
      expect(el.$$attr(attrName, false)).toBe('');
      expect(el.$$attr(attrName)).toBe(null);
    });

    test('ESLBaseElement $cls - get', () => {
      el.className = '';
      expect(el.$$cls('a')).toBe(false);
      el.className = 'a b';
      expect(el.$$cls('a')).toBe(true);
      expect(el.$$cls('a b')).toBe(true);
    });
    test('ESLBaseElement $cls - set', () => {
      el.className = '';
      expect(el.$$cls('a', true)).toBe(true);
      expect(el.className).toBe('a');
      expect(el.$$cls('b', true)).toBe(true);
      expect(el.className).toBe('a b');
      expect(el.$$cls('a b', false)).toBe(false);
      expect(el.className).toBe('');
    });

    test('$$fire', (done) => {
      el.addEventListener('esl:testevent', (e) => {
        expect(e).toBeInstanceOf(CustomEvent);
        done();
      }, {once: true});
      el.$$fire('testevent');
    }, 10);
    test('$$fire - bubbling', (done) => {
      document.addEventListener('esl:testevent', (e) => {
        expect(e).toBeInstanceOf(CustomEvent);
        done();
      }, {once: true});
      el.$$fire('testevent');
    }, 10);
  });
});

import '../../../polyfills/es5-target-shim';
import {ESLBaseElement} from '../core';

describe('ESLBaseElement test', () => {

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

  test('FireEvent - simple', (done) => {
    el.addEventListener('testevent', (e) => {
      expect(e).toBeInstanceOf(CustomEvent);
      done();
    });
    el.$$fire('testevent');
  }, 10);

  test('FireEvent - bubbling', (done) => {
    document.addEventListener('testevent', (e) => {
      expect(e).toBeInstanceOf(CustomEvent);
      done();
    }, { once: true });

    el.$$fire('testevent');
  }, 10);
});

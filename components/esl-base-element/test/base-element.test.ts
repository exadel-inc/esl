import '../../../polyfills/es5-target-shim';
import {ESLBaseElement} from '../ts/esl-base-element';

describe('ESLBaseElement test', () => {

  class TestElement extends ESLBaseElement {
    public static eventNs = 'esl:test';
  }

  TestElement.register('test-el-basic');
  const el = new TestElement();

  beforeEach(() => {
    document.body.append(el);
  });
  afterEach(() => {
    if (!el.parentElement) return;
    document.body.removeChild(el);
  });

  test('Livecycle', () => {
    expect(el).toBeInstanceOf(HTMLElement);
    expect(el.isConnected).toBe(true);
    document.body.removeChild(el);
    setTimeout(() => {
      expect(el.isConnected).toBe(false);
    }, 0);
  }, 100);

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

  test('FireEvent - bubbling', (done) => {
    document.addEventListener('esl:test:testevent', (e) => {
      expect(e).toBeInstanceOf(CustomEvent);
      done();
    }, { once: true });
    el.$$fireNs('testevent');
  }, 10);
});

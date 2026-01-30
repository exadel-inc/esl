import {ESLBaseElement} from '../core';

describe('ESLBaseElement', () => {
  class TestElement extends ESLBaseElement {
    public static eventNs = 'esl:test';
  }

  class TestElement2 extends ESLBaseElement {
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

  test('ESLBaseElement livecycle', () => {
    expect(el).toBeInstanceOf(HTMLElement);
    expect(el.connected).toBe(true);
    document.body.removeChild(el);
    setTimeout(() => {
      expect(el.connected).toBe(false);
    }, 0);
  }, 100);

  test('ESLBaseElement register validate', async () => {
    // Tag is not empty
    expect(() => TestElement2.register('')).toThrow();
    TestElement2.register('test-test');
    await customElements.whenDefined('test-test');
    expect(() => TestElement2.register('test-test')).not.toThrow();
    expect(() => TestElement2.register('test-test-2')).toThrow();
    try {
      // eslint-disable-next-line require-atomic-updates
      TestElement2.is = 'test-test-2';
    } catch { /* empty */
    }
    expect(TestElement2.is).toBe('test-test');
  });

  test('ESLBaseElement register validate (inheritance case)', () => {
    expect(() => {
      class TestIBase extends TestElement {
        static override is = 'test-base-inh';
      }

      TestIBase.register();

      class TestInherited extends TestElement {
        static override is = 'test-child-inh';
      }

      TestInherited.register();
    }).not.toThrow();
  });

  describe('ESLBaseElement has correct tag name on connected callback', () => {
    const customName = 'test-base-inh-livecycle-1';

    class TestEl extends TestElement {
      static override is = 'test-base-inh-livecycle';
      protected override connectedCallback(): void {
        super.connectedCallback();
        expect(this.baseTagName).toBe(customName);
      }
    }

    beforeAll(() => document.body.append(document.createElement(customName)));
    afterAll(() => [...document.body.querySelectorAll(customName)].forEach((node) => node.parentElement?.removeChild(node)));
    test('Register an element with custom tag name', () => expect(() => TestEl.register(customName)).not.toThrow());
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

    test('$$fire', () => new Promise<void>((resolve) => {
      el.addEventListener('testevent', (e) => {
        expect(e).toBeInstanceOf(CustomEvent);
        resolve();
      }, {once: true});
      el.$$fire('testevent');
    }));
    test('$$fire - bubbling', () => new Promise<void>((resolve) => {
      document.addEventListener('testevent', (e) => {
        expect(e).toBeInstanceOf(CustomEvent);
        resolve();
      }, {once: true});
      el.$$fire('testevent');
    }));
  });
});

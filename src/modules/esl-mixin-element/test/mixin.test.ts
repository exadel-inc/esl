import {ESLMixinElement} from '../core';

// TODO: exited with more cases
describe('ESLMixinElement', () => {
  describe('register', () => {
    class TestMixin extends ESLMixinElement {
      static override is = 'test-mixin';
    }

    test('Existing ESLMixinElement attribute handled on registration', () => {
      const $el = document.createElement('div');
      $el.toggleAttribute(TestMixin.is, true);
      document.body.appendChild($el);
      TestMixin.register();
      expect(TestMixin.get($el)).toBeInstanceOf(ESLMixinElement);
    });

    test('ESLMixinElement appears on new element with attribute', async () => {
      TestMixin.register();
      const $el = document.createElement('div');
      $el.toggleAttribute(TestMixin.is, true);
      document.body.appendChild($el);
      await Promise.resolve(); // Wait for next microtask
      expect(TestMixin.get($el)).toBeInstanceOf(ESLMixinElement);
    });

    test('Multiple call of the same mixin registration ignored', () => {
      expect(() => {
        TestMixin.register();
        TestMixin.register();
      }).not.toThrow();
    });

    test('Incorrect mixin name throws an error', () => {
      expect(() => (class Some extends ESLMixinElement {
        static override is = 'a';
      }).register()).toThrow(DOMException);
    });

    test('Redeclaration of mixin with another definition throws error', () => {
      TestMixin.register();
      expect(() => (class Some extends ESLMixinElement {
        static override is = TestMixin.is;
      }).register()).toThrow(DOMException);
    });

    test('ESLMixinElement removed when attribute is removed on new element with attribute', async () => {
      TestMixin.register();
      const $el = document.createElement('div');
      $el.toggleAttribute(TestMixin.is, true);
      document.body.appendChild($el);
      await Promise.resolve(); // Wait for next microtask
      expect(TestMixin.get($el)).toBeInstanceOf(ESLMixinElement);
      $el.toggleAttribute(TestMixin.is, false);
      await Promise.resolve(); // Wait for next microtask
      expect(TestMixin.get($el)).toBe(null);
      $el.toggleAttribute(TestMixin.is, true);
      await Promise.resolve(); // Wait for next microtask
      expect(TestMixin.get($el)).toBeInstanceOf(ESLMixinElement);
    });

    test('ESLMixinElement can be resolved by mixin name', async () => {
      const $el = document.createElement('div');
      $el.toggleAttribute(TestMixin.is, true);
      document.body.appendChild($el);
      TestMixin.register();
      await Promise.resolve(); // Wait for next microtask
      expect(ESLMixinElement.get($el, TestMixin.is)).toBe(TestMixin.get($el));
    });

    test('init child', async () => {
      TestMixin.register();

      const $root = document.createElement('div');
      document.body.appendChild($root);
      const $el = document.createElement('div');
      $root.appendChild($el);
      $el.toggleAttribute(TestMixin.is, true);

      await Promise.resolve(); // Wait for next microtask
      expect(TestMixin.get($el)).toBeInstanceOf(ESLMixinElement);
    });

    test('registration does not prevent appearing mixin from handling', async () => {
      class ATestMixin extends ESLMixinElement {
        static override is = 'a-test';
      }
      class BTestMixin extends ESLMixinElement {
        static override is = 'b-test';
      }
      const root = document.createElement('div');
      document.body.appendChild(root);
      // Scenario:
      ATestMixin.register(); // First mixin registered and handled existing nodes
      root.setAttribute(ATestMixin.is, ''); // add mixin attribute to node (initialization planned)
      BTestMixin.register(); // Register for a second mixin (causing MutationObserver flush)
      expect(ATestMixin.get(root)).toBeInstanceOf(ATestMixin); // Check if the flush handled correctly
    });

    afterEach(() => {
      while (document.body.lastElementChild) document.body.removeChild(document.body.lastElementChild);
    });
  });

  describe('ESLMixinElement prototype', () => {
    class CTestMixin extends ESLMixinElement {
      static override is = 'c-test';
    }

    const $host = document.createElement('div');
    $host.toggleAttribute(CTestMixin.is, true);
    CTestMixin.register();

    beforeAll(() => document.body.appendChild($host));

    test('ESLMixinElement $attr', () => {
      const $el = CTestMixin.get($host) as CTestMixin;

      const attrName = 'test-attr';
      const val = $host.getAttribute(attrName);
      expect($el.$$attr(attrName)).toBe(val);
      expect($el.$$attr(attrName, 'test')).toBe(val);
      expect($el.$$attr(attrName)).toBe('test');
    });

    test('ESLMixinElement $attr - boolean', () => {
      const el = CTestMixin.get($host) as CTestMixin;

      const attrName = 'test-attr-bool';
      const val = $host.getAttribute(attrName);
      expect(el.$$attr(attrName)).toBe(val);
      expect(el.$$attr(attrName, true)).toBe(val);
      expect(el.$$attr(attrName)).toBe('');
      expect(el.$$attr(attrName, false)).toBe('');
      expect(el.$$attr(attrName)).toBe(null);
    });

    test('ESLMixinElement $cls - get', () => {
      const $el = CTestMixin.get($host) as CTestMixin;

      $host.className = '';
      expect($el.$$cls('a')).toBe(false);
      $host.className = 'a b';
      expect($el.$$cls('a')).toBe(true);
      expect($el.$$cls('a b')).toBe(true);
    });

    test('ESLMixinElement $cls - set', () => {
      const $el = CTestMixin.get($host) as CTestMixin;

      $host.className = '';
      expect($el.$$cls('a', true)).toBe(true);
      expect($host.className).toBe('a');
      expect($el.$$cls('b', true)).toBe(true);
      expect($host.className).toBe('a b');
      expect($el.$$cls('a b', false)).toBe(false);
      expect($host.className).toBe('');
    });

    test('ESLMixinElement $$fire', (done) => {
      const $el = CTestMixin.get($host) as CTestMixin;

      $host.addEventListener('testevent', (e) => {
        expect(e).toBeInstanceOf(CustomEvent);
        done();
      }, {once: true});
      $el.$$fire('testevent');
    }, 10);

    test('ESLMixinElement $$fire - bubbling', (done) => {
      const $el = CTestMixin.get($host) as CTestMixin;

      document.addEventListener('testevent', (e) => {
        expect(e).toBeInstanceOf(CustomEvent);
        done();
      }, {once: true});
      $el.$$fire('testevent');
    }, 10);
  });
});

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

    afterEach(() => {
      while (document.body.lastElementChild) document.body.removeChild(document.body.lastElementChild);
    });
  });
});

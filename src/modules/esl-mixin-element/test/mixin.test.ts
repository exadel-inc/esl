import {ESLMixinElement} from '../core';

// TODO: exited with more cases
describe('ESLMixinElement', () => {
  describe('register', () => {
    class TestMixin extends ESLMixinElement {
      static is = 'test-mixin';
    }

    test('init', async () => {
      const $el = document.createElement('div');
      $el.toggleAttribute(TestMixin.is, true);
      document.body.appendChild($el);
      TestMixin.register();
      expect(TestMixin.get($el)).toBeInstanceOf(ESLMixinElement);

      $el.toggleAttribute(TestMixin.is, false);
      await Promise.resolve(); // Wait for next microtask
      expect(TestMixin.get($el)).toBe(null);
      $el.toggleAttribute(TestMixin.is, true);
      await Promise.resolve(); // Wait for next microtask
      expect(TestMixin.get($el)).toBeInstanceOf(ESLMixinElement);
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

    afterAll(() => {
      while (document.body.lastElementChild) document.body.removeChild(document.body.lastElementChild);
    });
  });
});

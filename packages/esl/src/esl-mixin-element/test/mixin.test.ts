import {ESLMixinElement} from '../core';

// TODO: exited with more cases
describe('ESLMixinElement', () => {
  class TestMixin extends ESLMixinElement {
    static override is = 'test-mixin';
  }

  describe('ESLMixinElement.register behaves according specification', () => {
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

  describe('ESLMixinElement.get api present and behaves according specification', () => {
    test('ESLMixinElement can be resolved by mixin name', async () => {
      const $el = document.createElement('div');
      $el.toggleAttribute(TestMixin.is, true);
      document.body.appendChild($el);
      TestMixin.register();
      await Promise.resolve(); // Wait for next microtask
      expect(ESLMixinElement.get($el, TestMixin.is)).toBe(TestMixin.get($el));
    });

    // TODO: more cases for ESLMixinElement.get
  });

  describe('ESLMixinRegistry handles mixins deep in modified DOM hierarchy', () => {
    const $root = document.createElement('div');
    const $el = document.createElement('div');
    $el.toggleAttribute(TestMixin.is, true);
    $root.appendChild($el);

    beforeAll(async () => {
      TestMixin.register();
      document.body.appendChild($root);

      await Promise.resolve(); // Wait for next microtask
    });

    test('ESLMixinRegistry initialize mixins on child elements of added DOM part', () => {
      expect(TestMixin.get($el)).toBeInstanceOf(ESLMixinElement);
    });

    test('ESLMixinRegistry disconnect all mixins on removed DOM part', async () => {
      $root.remove();
      await Promise.resolve(); // Wait for next microtask
      expect(TestMixin.get($el)).toBe(null);
    });
  });

  describe('ESLMixinRegistry handles multiple mixins deep in modified DOM hierarchy', () => {
    class TestMixin2 extends ESLMixinElement {
      static instanceCounter = 0;
      static override is = 'test-mixin-2';

      protected override connectedCallback(): void {
        super.connectedCallback();
        TestMixin2.instanceCounter++;
      }

      protected override disconnectedCallback(): void {
        super.disconnectedCallback();
        TestMixin2.instanceCounter--;
      }
    }

    const $root = document.createElement('div');
    const $el1 = document.createElement('div');
    const $el2 = document.createElement('div');
    $el1.toggleAttribute(TestMixin.is, true);
    $el1.toggleAttribute(TestMixin2.is, true);
    $el2.toggleAttribute(TestMixin2.is, true);
    $el2.appendChild($el1);
    $root.appendChild($el2);

    beforeAll(async () => {
      TestMixin.register();
      TestMixin2.register();
      document.body.appendChild($root);

      await Promise.resolve(); // Wait for next microtask
    });

    test('ESLMixinRegistry initialize all mixins on child elements of added DOM part', () => {
      expect(TestMixin.get($el1)).toBeInstanceOf(ESLMixinElement);
      expect(TestMixin2.get($el1)).toBeInstanceOf(ESLMixinElement);
      expect(TestMixin2.get($el2)).toBeInstanceOf(ESLMixinElement);
    });

    test('Test mixin instance counter is correct after elements creation', () => {
      expect(TestMixin2.instanceCounter).toBe(2);
    });

    test('ESLMixinRegistry disconnect all mixins on removed DOM part', async () => {
      $root.remove();
      await Promise.resolve(); // Wait for next microtask
      expect(TestMixin.get($el1)).toBe(null);
      expect(TestMixin2.get($el1)).toBe(null);
      expect(TestMixin2.get($el2)).toBe(null);
    });

    test('Test mixin instance counter is correct after elements removal', () => {
      expect(TestMixin2.instanceCounter).toBe(0);
    });
  });

  describe('ESLMixinRegistry handles all mixins although they change the DOM structure', () => {
    const log: string[] = [];
    class TestMixin3 extends ESLMixinElement {
      static override is = 'test-mixin-3';

      protected override connectedCallback(): void {
        super.connectedCallback();
        this.$host.before(document.createElement('span'), document.createElement('span'));
        this.$host.after(document.createElement('span'), document.createElement('span'));
        log.push(this.$host.id);
      }
    }

    beforeAll(async () => {
      TestMixin3.register();
    });

    test('should register mixins in order although they create siblings before and after the host element', async () => {
      const buildEl = (id: string) => {
        const $a = document.createElement('a');
        $a.id = `a-${id}`;
        $a.toggleAttribute(TestMixin3.is, true);
        return $a;
      };
      const $p = document.createElement('p');
      $p.append(buildEl('1'), buildEl('2'), buildEl('3'));
      document.body.appendChild($p);

      await Promise.resolve();

      expect(log).toEqual(['a-1', 'a-2', 'a-3']);
    });

    afterEach(() => {
      document.body.replaceChildren();
    });
  });
});

import {ESLMixinElement} from '../ui/esl-mixin-element';
import MockedFn = jest.MockedFn;

describe('ESLMixinElement: attribute observation', () => {
  class TestMixin extends ESLMixinElement {
    static override is = 'test-mixin-oattr';

    override attributeChangedCallback: MockedFn<(name: string, oldV: string, newV: string) => void>;
    constructor(el: HTMLElement) {
      super(el);
      this.attributeChangedCallback = jest.fn();
    }
  }
  TestMixin.register();
  class TestMixin2 extends TestMixin {
    static override is = 'test-mixin-oattr-2';
    static override observedAttributes = [TestMixin2.is, 'a', 'b'];
  }
  TestMixin2.register();
  class TestMixin3 extends TestMixin {
    static override is = 'test-mixin-oattr-3';
    static override observedAttributes = [TestMixin3.is, 'a', 'c'];
  }
  TestMixin3.register();

  describe('mixin `is` observed correctly', () => {
    const $host = document.createElement('div');

    beforeAll(() => {
      $host.setAttribute(TestMixin.is, '');
      document.body.appendChild($host);
      return Promise.resolve();
    });
    afterAll(() => {
      document.body.removeChild($host);
    });

    test('mixin initialized', () => {
      expect(TestMixin.get($host)).toBeInstanceOf(TestMixin);
    });

    test('mixin new value handled correctly', async () => {
      const mixin = TestMixin.get($host)!;
      const oldValue = $host.getAttribute(TestMixin.is);
      mixin.attributeChangedCallback.mockReset();

      const newValue = 'test1';
      $host.setAttribute(TestMixin.is, newValue);
      await Promise.resolve();

      expect(mixin.attributeChangedCallback).toBeCalledTimes(1);
      expect(mixin.attributeChangedCallback).toBeCalledWith(TestMixin.is, oldValue, newValue);
    });
  });

  describe('observed attributes handled correctly', () => {
    const $host = document.createElement('div');

    beforeAll(() => {
      $host.setAttribute(TestMixin2.is, '');
      $host.setAttribute(TestMixin3.is, '');
      document.body.appendChild($host);
      return Promise.resolve();
    });
    afterAll(() => {
      document.body.removeChild($host);
    });

    test.each([
      ['a', TestMixin2],
      ['b', TestMixin2],
      ['a', TestMixin3],
      ['c', TestMixin3],
      [TestMixin2.is, TestMixin2],
      [TestMixin3.is, TestMixin3],
    ])('attr %s handled by mixin %o', async (attrName: string, Mixin: typeof TestMixin) => {
      const mixin = Mixin.get($host)!;
      const oldValue = $host.getAttribute(attrName);
      mixin.attributeChangedCallback.mockReset();

      const newValue = `test-${attrName}-${performance.now()}`;
      $host.setAttribute(attrName, newValue);
      await Promise.resolve();

      expect(mixin.attributeChangedCallback).toBeCalledTimes(1);
      expect(mixin.attributeChangedCallback).toBeCalledWith(attrName, oldValue, newValue);
    });
  });
});

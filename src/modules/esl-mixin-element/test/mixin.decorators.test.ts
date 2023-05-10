import {ESLMixinElement} from '../ui/esl-mixin-element';
import {attr, boolAttr, jsonAttr} from '../../esl-utils/decorators';

describe('ESLMixinElement: attribute mixins correctly reflect to the $host', () => {
  class TestMixin extends ESLMixinElement {
    static override is = 'test-mixin-attr-decorators';

    @attr() public val: string | null;

    @boolAttr() public bool: boolean;

    @jsonAttr() public json: object;
  }
  TestMixin.register();

  const $el = document.createElement('div');
  $el.toggleAttribute(TestMixin.is, true);

  beforeAll(() => {
    document.body.appendChild($el);
  });

  test('@attr', async () => {
    const mixin = TestMixin.get($el)!;
    expect(mixin.val).toBe('');
    mixin.val = 'a';
    expect($el.getAttribute('val')).toBe('a');
    mixin.val = null;
    expect($el.hasAttribute('val')).toBe(false);
  });

  test('@boolAttr', async () => {
    const mixin = TestMixin.get($el) as TestMixin;
    expect(mixin.bool).toBe(false);
    mixin.bool = true;
    expect($el.hasAttribute('bool')).toBe(true);
    mixin.bool = false;
    expect($el.hasAttribute('bool')).toBe(false);
  });

  test('@jsonAttr', async () => {
    const mixin = TestMixin.get($el) as TestMixin;
    expect(mixin.json).toEqual({});

    mixin.json = {a: 1};
    expect($el.getAttribute('json')).toBe(JSON.stringify({a: 1}));
  });

  afterAll(() => {
    while (document.body.lastElementChild) document.body.removeChild(document.body.lastElementChild);
  });
});

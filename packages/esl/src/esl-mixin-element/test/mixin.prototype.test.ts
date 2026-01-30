import {ESLMixinElement} from '../ui/esl-mixin-element';

describe('ESLMixinElement.prototype implements all required ESLComponent API methods', () => {
  class CTestMixin extends ESLMixinElement {
    static override is = 'c-test';
  }

  let $el: CTestMixin;

  const $host = document.createElement('div');
  $host.toggleAttribute(CTestMixin.is, true);

  beforeAll(async () => {
    document.body.appendChild($host);
    CTestMixin.register();

    await Promise.resolve();
    $el = CTestMixin.get($host) as CTestMixin;
  });

  describe('ESLMixinElement.prototype.$$attr persist and correct', () => {
    const attrName = 'test-attr';
    const attrNameBool = 'test-attr-bool';

    test('should return the initial attribute value', () => {
      const val = $host.getAttribute(attrName);
      expect($el.$$attr(attrName)).toBe(val);
    });

    test('should set the attribute value and return the previous value', () => {
      expect($el.$$attr(attrName, 'test')).toBe(null);
      expect($el.$$attr(attrName)).toBe('test');
    });

    test('should set and return an empty string for boolean true', () => {
      expect($el.$$attr(attrNameBool, true)).toBe(null);
      expect($el.$$attr(attrNameBool)).toBe('');
    });

    test('should set and return null for removed attribute', () => {
      expect($el.$$attr(attrNameBool, false)).toBe('');
      expect($el.$$attr(attrNameBool)).toBe(null);
    });
  });

  describe('ESLMixinElement.prototype.$$cls persist and correct', () => {
    test('should return false when class does not exist', () => expect($el.$$cls('a')).toBe(false));

    test('should return true when class exists', () => {
      $host.className = 'a b';
      expect($el.$$cls('a')).toBe(true);
      expect($el.$$cls('a b')).toBe(true);
    });

    test('should add the class when setting to true', () => {
      $host.className = '';
      $el.$$cls('a', true);
      $el.$$cls('b', true);
      expect($host.className).toBe('a b');
    });

    test('should remove the class when setting to false', () => {
      $host.className = 'a b';
      expect($el.$$cls('a b', false)).toBe(false);
      expect($host.className).toBe('');
    });
  });

  test('ESLMixinElement.prototype.$$fire persist and correct', () => {
    const eventName = 'testevent';
    $host.dispatchEvent = vi.fn();
    $el.$$fire(eventName);

    expect($host.dispatchEvent).toHaveBeenLastCalledWith(expect.objectContaining({type: eventName, cancelable: true, bubbles: true}));
  });
});

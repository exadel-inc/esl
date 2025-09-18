import {hasAttr, getAttr, setAttr, getClosestAttr} from '../attr';

describe('Attribute', () => {
  const attrName = 'test-attr';
  const attrValue = 'test-value';
  const attrFallback = 'test-fallback';

  describe('hasAttr', () => {
    test('false when attribute is not present', () => expect(hasAttr(document.createElement('div'), attrName)).toBe(false));

    test('false for non-valid element', () => expect(hasAttr(null as any, attrName)).toBe(false));

    test('false for non-valid host element', () => expect(hasAttr({$host: null} as any, attrName)).toBe(false));

    test('true when attribute is present', () => {
      const $el = document.createElement('div');
      $el.setAttribute(attrName, attrValue);

      expect(hasAttr($el, attrName)).toBe(true);
    });

    test('true for an array of elements with set attribute', () => {
      const $el1 = document.createElement('div');
      const $el2 = document.createElement('div');
      $el1.setAttribute(attrName, attrValue);
      $el2.setAttribute(attrName, attrValue);

      expect(hasAttr([$el1, $el2], attrName)).toBe(true);
    });

    test('false for an array of elements without set attribute', () => {
      const $el1 = document.createElement('div');
      const $el2 = document.createElement('div');
      $el1.setAttribute(attrName, attrValue);

      expect(hasAttr([$el1, $el2], attrName)).toBe(false);
    });
  });

  describe('getAttr', () => {
    test('attribute value when attribute is present', () => {
      const $el = document.createElement('div');
      $el.setAttribute(attrName, attrValue);

      expect(getAttr($el, attrName)).toBe(attrValue);
    });

    test('null when attribute is not present', () => expect(getAttr(document.createElement('div'), attrName)).toBe(null));

    test('null for non-valid host', () => expect(getAttr({$host: null} as any, attrName)).toBe(null));

    test('null for non-valid element with fallback value', () => expect(getAttr(null as any, attrName, attrFallback)).toBe(null));

    test('fallback value when attribute is not present', () => expect(getAttr(document.createElement('div'), attrName, attrFallback)).toBe(attrFallback));

    test('null by looking up first element`s attribute', () => {
      const $el2 = document.createElement('div');
      const $el1 = document.createElement('div');
      $el2.setAttribute(attrName, attrValue);

      expect(getAttr([$el1, $el2], attrName)).toBe(null);
    });

    test('attribute value of first element', () => {
      const attrValue2 = 'test-value-2';
      const $el2 = document.createElement('div');
      const $el1 = document.createElement('div');
      $el1.setAttribute(attrName, attrValue);
      $el2.setAttribute(attrName, attrValue2);

      expect(getAttr([$el1, $el2], attrName)).toBe(attrValue);
    });
  });

  describe('setAttr', () => {
    test('sets attribute value', () => {
      const $el = document.createElement('div');

      setAttr($el, attrName, attrValue);
      expect($el.getAttribute(attrName)).toBe(attrValue);
    });

    test('removes attribute when param value is null', () => {
      const $el = document.createElement('div');
      $el.setAttribute(attrName, attrValue);

      setAttr($el, attrName, null);
      expect($el.hasAttribute(attrName)).toBe(false);
    });

    test('removes attribute when param value is undefined', () => {
      const $el = document.createElement('div');
      $el.setAttribute(attrName, attrValue);

      setAttr($el, attrName, undefined);
      expect($el.hasAttribute(attrName)).toBe(false);
    });

    test('sets a boolean attribute when param value is true', () => {
      const $el = document.createElement('div');

      setAttr($el, attrName, true);
      expect($el.getAttribute(attrName)).toBe('');
    });

    test('shouldn`t throw any type errors for non-valid host', () => expect(() => setAttr({$host: null} as any, attrName, true)).not.toThrow());

    test('shouldn`t throw any type errors for non-valid element', () => expect(() => setAttr(null as any, attrName, true)).not.toThrow());

    test('sets attribute for array of elements', () => {
      const $el1 = document.createElement('div');
      const $el2 = document.createElement('div');
      const $el3 = document.createElement('div');

      setAttr([$el1, $el2, $el3], attrName, attrValue);
      expect($el1.getAttribute(attrName)).toBe(attrValue);
      expect($el2.getAttribute(attrName)).toBe(attrValue);
      expect($el3.getAttribute(attrName)).toBe(attrValue);
    });
  });


  describe('getClosestAttr', () => {
    const $el = document.createElement('div');
    $el.setAttribute(attrName, attrValue);

    const $parent = document.createElement('div');
    const $parentName = 'parent-attr';
    const $parentValue = 'parent-value';
    $parent.setAttribute($parentName, $parentValue);

    $parent.append($el);
    document.body.append($parent);

    test('should return attribute from the current element', () => {
      expect(getClosestAttr($el, attrName)).toBe(attrValue);
    });
    test('should return an attribute from the parent DOM element', () => {
      expect(getClosestAttr($el, $parentName)).toBe($parentValue);
    });
    test('should return null in case the specified attribute is absent at the current element and its parents', () => {
      expect(getClosestAttr($el, 'name')).toBe(null);
    });
  });
});

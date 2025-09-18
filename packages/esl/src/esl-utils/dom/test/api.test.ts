import {isElement} from '../api';

describe('Module `dom/api` tests:', () => {
  describe('isElement (misc/object) type guard', () => {
    test.each([
      null,
      undefined,
      0
    ])('isElement returns false for non object value: %o)', (value) => expect(isElement(value)).toBe(false));

    test.each([
      {},
      [],
      {nodeType: 1},
      {nodeType: 1, nodeName: 'DIV'},
    ])('isElement returns false for non Element object: %o)', (value) => expect(isElement(value)).toBe(false));

    test.each([
      'div', 'span', 'a', 'button'
    ])('isElement returns true for %s Element object)', (tag) => {
      expect(isElement(document.createElement(tag))).toBe(true);
    });

    test.each([
      ['HTML Text Node', () => document.createTextNode('')],
      ['HTML Comment', () => document.createComment('')],
      ['HTML Fragment', () => document.createDocumentFragment()]
    ])('isElement returns false for non Element object: %s)', (comment, factory) => {
      expect(isElement(factory())).toBe(false);
    });

    describe('isElement returns true for Element objects from different realms', () => {
      const $iframe: HTMLIFrameElement = document.createElement('iframe');

      beforeAll(() => document.body.appendChild($iframe));
      afterAll(() => $iframe.remove());

      test.each([
        'div', 'span', 'a', 'button'
      ])('isElement returns true for %s Element object from iframe)', (tag) => {
        const $iframeDoc = $iframe.contentDocument as Document;
        const element = $iframeDoc.createElement(tag);
        $iframeDoc.body.appendChild(element);
        expect(isElement(element)).toBe(true);
      });
    });
  });
});

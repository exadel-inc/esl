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
      document.createElement('div'),
      document.createElement('span'),
      document.createElement('a'),
      document.createElement('button')
    ])('isElement returns true for Element object: %o)', (value) => expect(isElement(value)).toBe(true));

    test.each([
      document.createTextNode(''),
      document.createComment(''),
      document.createDocumentFragment()
    ])('isElement returns false for non Element object: %o)', (value) => expect(isElement(value)).toBe(false));

    describe('isElement returns true for Element objects from different realms', () => {
      const $iframe: HTMLIFrameElement = document.createElement('iframe');
      document.body.appendChild($iframe);
      const $iframeDoc = $iframe.contentDocument as Document;

      test.each([
        $iframeDoc.createElement('div'),
        $iframeDoc.createElement('span'),
        $iframeDoc.createElement('a'),
        $iframeDoc.createElement('button')
      ])('isElement returns true for Element object: %o)', (value) => {
        $iframeDoc.body.appendChild(value);
        expect(isElement(value)).toBe(true);
      });

      afterAll(() => $iframe.remove());
    });
  });
});

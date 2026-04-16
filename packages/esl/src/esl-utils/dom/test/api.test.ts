import {isElement, htmlToElement} from '../api';

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

  describe('htmlToElement utility function', () => {
    describe('String input (HTML parsing)', () => {
      test('parses simple HTML string to Element', () => {
        const result = htmlToElement('<div></div>');
        expect(result).toBeInstanceOf(Element);
        expect(result.tagName).toBe('DIV');
      });

      test('parses HTML with attributes', () => {
        const result = htmlToElement('<span class="test" id="my-id">Hello</span>');
        expect(result.tagName).toBe('SPAN');
        expect(result.className).toBe('test');
        expect(result.id).toBe('my-id');
        expect(result.textContent).toBe('Hello');
      });

      test('parses HTML with nested elements', () => {
        const result = htmlToElement('<div><span>Nested</span></div>');
        expect(result.tagName).toBe('DIV');
        expect(result.querySelector('span')).toBeTruthy();
        expect(result.querySelector('span')?.textContent).toBe('Nested');
      });

      test('returns first element when HTML contains multiple root elements', () => {
        const result = htmlToElement('<div>First</div><span>Second</span>');
        expect(result.tagName).toBe('DIV');
        expect(result.textContent).toBe('First');
      });

      test('parses complex HTML structure', () => {
        const html = '<ul class="list"><li>Item 1</li><li>Item 2</li></ul>';
        const result = htmlToElement(html);
        expect(result.tagName).toBe('UL');
        expect(result.className).toBe('list');
        expect(result.querySelectorAll('li').length).toBe(2);
      });
    });

    describe('Element input (pass-through)', () => {
      test('returns Element as-is when Element is passed', () => {
        const element = document.createElement('div');
        element.className = 'test';
        const result = htmlToElement(element);
        expect(result).toBe(element);
        expect(result.className).toBe('test');
      });

      test('returns same instance (not a copy)', () => {
        const element = document.createElement('span');
        const result = htmlToElement(element);
        expect(result).toBe(element);
        result.id = 'modified';
        expect(element.id).toBe('modified');
      });
    });

    describe('Array input (first element)', () => {
      test('returns first element from array', () => {
        const div = document.createElement('div');
        const span = document.createElement('span');
        const result = htmlToElement([div, span]);
        expect(result).toBe(div);
      });

      test('returns first element from array with single element', () => {
        const element = document.createElement('p');
        const result = htmlToElement([element]);
        expect(result).toBe(element);
      });

      test('handles empty array gracefully', () => {
        const result = htmlToElement([]);
        expect(result).toBeUndefined();
      });
    });

    describe('Type flexibility', () => {
      test('handles different element types', () => {
        const types = ['div', 'span', 'a', 'button', 'input', 'section'];
        types.forEach((tag) => {
          const result = htmlToElement(`<${tag}></${tag}>`);
          expect(result.tagName).toBe(tag.toUpperCase());
        });
      });

      test('preserves special attributes', () => {
        const result = htmlToElement('<button type="submit" disabled>Click</button>');
        expect(result.getAttribute('type')).toBe('submit');
        expect(result.hasAttribute('disabled')).toBe(true);
      });

      test('preserves data attributes', () => {
        const result = htmlToElement('<div data-level="2" data-parent="parent1"></div>');
        expect(result.getAttribute('data-level')).toBe('2');
        expect(result.getAttribute('data-parent')).toBe('parent1');
      });
    });
  });
});

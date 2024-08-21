import {ESLImage} from '../core';
import {mockXMLHttpRequest} from './xmlHttpRequest.mock';

describe('ESLImageElement', () => {
  describe('DOM XSS vulnerabilities in mode="inner-svg"', () => {

    ESLImage.register('esl-image');
    const el = new ESLImage();
    el.src = 'http:/localhost/test.svg';
    el.mode = 'inner-svg';
    let mock: any;

    beforeAll(() => {
      mock = mockXMLHttpRequest();
    });
    afterAll(() => {
      mock.cleanUp();
    });

    afterEach(() => {
      if (!el.parentElement) return;
      document.body.removeChild(el);
    });

    const SVG = '<svg><circle cx="5" cy="5" r="5"></circle></svg>';
    const DANGER_ATTRS = '<svg onload="alert(document.cookie)"><circle cx="5" cy="5" r="5"></circle></svg>';
    const DANGER_CONTENT_SCRIPT = '<svg><circle cx="5" cy="5" r="5"></circle><script>alert(\'xss\')</script></svg>';
    // TODO change after migration  eslint-disable-next-line max-len
    const DANGER_CONTENT_DATA_URI = '<svg><a xlink:href="data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4K"><circle cx="5" cy="5" r="5"></circle></a></svg>';
    const DANGER_CONTENT_LINK_HREF = '<svg><a href="javascript:alert(document.cookie)"><circle cx="5" cy="5" r="5"></circle></a></svg>';

    test('load content from src and put it into innerHTML', () => {
      mock.setData(SVG);
      document.body.append(el);
      expect(el.innerHTML).toBe(SVG);
    });

    test('SVG with dangerous on event attribute', () => {
      mock.setData(DANGER_ATTRS);
      document.body.append(el);
      expect(el.innerHTML).toBe(SVG);
    });

    test('SVG with dangerous script in content', () => {
      mock.setData(DANGER_CONTENT_SCRIPT);
      document.body.append(el);
      expect(el.innerHTML).toBe(SVG);
    });

    test('SVG with the link with malicious attr in content', () => {
      mock.setData(DANGER_CONTENT_DATA_URI);
      document.body.append(el);
      expect(el.innerHTML).toBe('<svg><a><circle cx="5" cy="5" r="5"></circle></a></svg>');
    });

    test('SVG with the link with malicious href attr in content', () => {
      mock.setData(DANGER_CONTENT_LINK_HREF);
      document.body.append(el);
      expect(el.innerHTML).toBe('<svg><a><circle cx="5" cy="5" r="5"></circle></a></svg>');
    });

    test('should load only SVG', () => {
      mock.setData(`<a href="javascript:alert('xss')">Click me!</a>${SVG}`);
      document.body.append(el);
      expect(el.innerHTML).toBe(SVG);
    });
  });
});

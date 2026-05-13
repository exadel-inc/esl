import {sanitize} from '../sanitize';

describe('sanitize', () => {
  test('should return the original markup', () => {
    const markup = '<div><p>Text</p></div>';
    const html = sanitize(markup);
    expect(html).toBe(markup);
  });

  test('should clean dangerous script', () => {
    const markup = '<div><p>Text</p></div>';
    const html = sanitize(`<script>alert(document.cookie)</script>${markup}`);
    expect(html).toBe(markup);
  });

  test('should clean dangerous script inside another elements', () => {
    const html = sanitize('<div><div><script>alert(document.cookie)</script></div></div>');
    expect(html).toBe('<div><div></div></div>');
  });

  test('should clean template element by default', () => {
    const html = sanitize('<div><template><img src="x"></template><p>Text</p></div>');
    expect(html).toBe('<div><p>Text</p></div>');
  });

  test('should clean dangerous on event attributes', () => {
    const markup = '<div><p>Text</p></div>';
    const attr = 'onerror';
    const html = sanitize(`${markup}<img src="x" alt="" ${attr}="alert(document.cookie)">`);
    expect(html).toBe(`${markup}<img src="x" alt="">`);
  });

  test('should clean dangerous href attribute with javascript content', () => {
    const markup = '<div><p>Text</p></div>';
    const html = sanitize(`<a href="javascript:alert(document.cookie)">${markup}</a>`);
    expect(html).toBe(`<a>${markup}</a>`);
  });

  test('should clean dangerous xlink:href attributes with data-uri text/html content', () => {
    const markup = '<rect width="100" height="100"></rect>';
    const attr = 'xlink:href';
    const html = sanitize(`<svg><a ${attr}="data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4K">${markup}</a></svg>`);
    expect(html).toBe(`<svg><a>${markup}</a></svg>`);
  });

  test('should filter first-level elements by allowed root tags', () => {
    const html = sanitize('<h1>Title</h1><h2>Header</h2><div><p>Text</p></div>', {allowedRoots: ['h1']});
    expect(html).toBe('<h1>Title</h1>');
  });

  test('should remove disallowed elements recursively', () => {
    const html = sanitize('<p>Text <span>safe</span><iframe src="https://example.com"></iframe></p>', {disallowedTags: ['iframe']});
    expect(html).toBe('<p>Text <span>safe</span></p>');
  });

  test('should filter allowed root tags case-insensitively', () => {
    const html = sanitize('<h1>Title</h1><h2>Header</h2>', {allowedRoots: ['H1']});
    expect(html).toBe('<h1>Title</h1>');
  });

  test('should remove disallowed tags case-insensitively', () => {
    const html = sanitize('<p>Text</p><iframe src="https://example.com"></iframe>', {disallowedTags: ['IFRAME']});
    expect(html).toBe('<p>Text</p>');
  });

  test('should allow filtering temporary root container for svg', () => {
    const html = sanitize('<span>Text</span><svg><rect width="100" height="100"></rect></svg>', {allowedRoots: ['svg']});
    expect(html).toBe('<svg><rect width="100" height="100"></rect></svg>');
  });

  test('should clean dangerous url attributes case-insensitively', () => {
    const html = sanitize('<a HREF="javascript:alert(document.cookie)">link</a>');
    expect(html).toBe('<a>link</a>');
  });

  test('should clean custom url attributes by default', () => {
    const html = sanitize('<button formaction="javascript:alert(document.cookie)">Send</button>');
    expect(html).toBe('<button>Send</button>');
  });

  test('should allow configured url protocols', () => {
    const html = sanitize('<a href="ftp://example.com/file.txt">file</a>', {allowedUrlProtocols: ['', 'http:', 'https:', 'ftp:']});
    expect(html).toBe('<a href="ftp://example.com/file.txt">file</a>');
  });

  test('should support configured url attributes', () => {
    const attr = 'poster';
    const html = sanitize(`<div ${attr}="javascript:alert(document.cookie)"></div>`, {urlAttributes: [attr]});
    expect(html).toBe('<div></div>');
  });
  test('should not touch custom attributes', () => {
    const html = sanitize('<div my-mixin="value"></div>');
    expect(sanitize(html)).toBe('<div my-mixin="value"></div>');
  });
});

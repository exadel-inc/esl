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

  test('should clean dangerous on event attributes', () => {
    const markup = '<div><p>Text</p></div>';
    const html = sanitize(`${markup}<img src="x" onerror="alert(document.cookie)">`);
    expect(html).toBe(`${markup}<img src="x">`);
  });

  test('should clean dangerous href attribute with javascript content', () => {
    const markup = '<div><p>Text</p></div>';
    const html = sanitize(`<a href="javascript:alert(document.cookie)">${markup}</a>`);
    expect(html).toBe(`<a>${markup}</a>`);
  });

  test('should clean dangerous src attribute with data-uri text/html content', () => {
    const html = sanitize('<iframe src="data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4K"></iframe>');
    expect(html).toBe('<iframe></iframe>');
  });

  test('should clean dangerous data attribute with data-uri text/html content', () => {
    const html = sanitize('<object data="data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4K"></object>');
    expect(html).toBe('<object></object>');
  });

  test('should clean dangerous xlink:href attributes with data-uri text/html content', () => {
    const markup = '<rect width="100" height="100"></rect>';
    const html = sanitize(`<a xlink:href="data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4K">${markup}</a>`);
    expect(html).toBe(`<a>${markup}</a>`);
  });

  test('should filter first level elements by tags', () => {
    const html = sanitize('<h1>Title</h1><h2>Header</h2><div><p>Text</p></div>', ['H1']);
    expect(html).toBe('<h1>Title</h1>');
  });

  test('should filter elements only at first level', () => {
    const html = sanitize('<div><p>Text</p></div><p>Another text</p>', ['P']);
    expect(html).toBe('<p>Another text</p>');
  });
});

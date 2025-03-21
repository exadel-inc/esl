import {toAbsoluteUrl} from '../url';

describe('misc/url helper tests', () => {
  test('1', () => {
    expect(toAbsoluteUrl('')).toBe('http://localhost/');
    expect(toAbsoluteUrl('/pathname/page.html')).toBe('http://localhost/pathname/page.html');
    expect(toAbsoluteUrl('?query=string')).toBe('http://localhost/?query=string');
    expect(toAbsoluteUrl('#anchor')).toBe('http://localhost/#anchor');
    expect(toAbsoluteUrl('/page.html?query=string#anchor')).toBe('http://localhost/page.html?query=string#anchor');
    expect(toAbsoluteUrl('https://esl-ui.com/page.html')).toBe('https://esl-ui.com/page.html');
    expect(toAbsoluteUrl('', 'https://esl-ui.com')).toBe('https://esl-ui.com/');
    expect(toAbsoluteUrl('/page.html', 'https://esl-ui.com/home.html?query=string#anchor')).toBe('https://esl-ui.com/page.html');
  });
});

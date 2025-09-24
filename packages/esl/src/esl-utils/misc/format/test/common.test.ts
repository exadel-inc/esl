import {parseAspectRatio, parseLazyAttr} from '../common';

describe('misc/format - common formatters test', () => {
  test('parseAspectRatio', () => {
    expect(parseAspectRatio('0')).toBe(0);
    expect(parseAspectRatio('1')).toBe(1);
    expect(parseAspectRatio('0.5')).toBe(0.5);
    expect(parseAspectRatio('1.5')).toBe(1.5);
    expect(parseAspectRatio('.5')).toBe(0.5);
    expect(parseAspectRatio('1:1')).toBe(1);
    expect(parseAspectRatio('1:2')).toBe(0.5);
    expect(parseAspectRatio('1/5')).toBe(0.2);
    expect(parseAspectRatio('0/5')).toBe(0);
    expect(parseAspectRatio('1/0')).toBe(Infinity);
    expect(parseAspectRatio(' 1 : 1 ')).toBe(1);
  });

  describe('parseLazyAttr', () => {
    test.each([
      [undefined, 'none'],
      [null, 'none'],
      ['', 'auto'],
      ['auto', 'auto'],
      ['none', 'none'],
      ['manual', 'manual'],
      ['NONE', 'none'],
      ['MANUAL', 'manual'],
      ['Auto', 'auto'],
      ['Manual', 'manual'],
      ['None', 'none'],
      [' manual ', 'manual'],
    ])('parseLazyAttr of %p to be %p', (value, expected) => {
      expect(parseLazyAttr(value as any)).toBe(expected);
    });
  });
});

import {evaluate, parseAspectRatio, parseLazyAttr} from '../common';

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

  test('evaluate', () => {
    let throwError = false;
    jest.spyOn(console, 'warn').mockImplementation(() => { throwError = true; });
    expect(evaluate('0')).toBe(0);
    expect(evaluate('true')).toBe(true);
    expect(evaluate('false')).toBe(false);
    expect(evaluate('null')).toBe(null);
    expect(evaluate('"0"')).toBe('0');
    expect(evaluate('[1, 2]')).toEqual([1, 2]);
    expect(evaluate('{}')).toEqual({});
    expect(evaluate('{a: 1}')).toEqual({a: 1});
    expect(evaluate('{"a": "1"}')).toEqual({a: '1'});
    expect(throwError).toBe(false);
    expect(evaluate('{')).toBe(undefined);
    expect(throwError).toBe(true);
    expect(evaluate('{', 'no')).toBe('no');
  });
});

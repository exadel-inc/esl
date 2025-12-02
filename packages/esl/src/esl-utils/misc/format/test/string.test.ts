import {capitalize, format, toCamelCase, toKebabCase, unwrapParenthesis} from '../string';

describe('misc/format - string formatters test', () => {
  test('toKebabCase', () => {
    expect(toKebabCase('hello')).toBe('hello');
    expect(toKebabCase('Hello')).toBe('hello');
    expect(toKebabCase('HelloWorld')).toBe('hello-world');
    expect(toKebabCase('Hello World')).toBe('hello-world');
    expect(toKebabCase('helloWorld')).toBe('hello-world');
    expect(toKebabCase('hiHiWorld')).toBe('hi-hi-world');
  });

  test('toCamelCase', () => {
    expect(toCamelCase('hello')).toBe('hello');
    expect(toCamelCase('Hello')).toBe('Hello');
    expect(toCamelCase('helloWorld')).toBe('helloWorld');
    expect(toCamelCase('hello world')).toBe('helloWorld');
    expect(toCamelCase('hello-world')).toBe('helloWorld');
    expect(toCamelCase('hi-hi-world')).toBe('hiHiWorld');
  });

  test('capitalize', () => {
    expect(capitalize('')).toBe('');
    expect(capitalize(' ')).toBe(' ');
    expect(capitalize('\n\t')).toBe('\n\t');
    expect(capitalize('Hi')).toBe('Hi');
    expect(capitalize('hi')).toBe('Hi');
    expect(capitalize('  hi')).toBe('  Hi');
    expect(capitalize('\thi')).toBe('\tHi');
    expect(capitalize('\nhi')).toBe('\nHi');
  });

  test('unwrapParenthesis', () => {
    expect(unwrapParenthesis('')).toBe('');
    expect(unwrapParenthesis(' ')).toBe('');
    expect(unwrapParenthesis('test')).toBe('test');
    expect(unwrapParenthesis('(test)')).toBe('test');
    expect(unwrapParenthesis('((test))')).toBe('(test)');
    expect(unwrapParenthesis('(test))')).toBe('test)');
    expect(unwrapParenthesis(' ( test ) ) ')).toBe('test )');
    expect(unwrapParenthesis('{(test)}')).toBe('{(test)}');
    expect(unwrapParenthesis(' {(test)}')).toBe('{(test)}');
    expect(unwrapParenthesis('(test()())')).toBe('test()()');
  });

  describe('format', () => {
    test.each([
      ['abc', {}, 'abc'],
      ['abc{val}', {val: 'd'}, 'abcd'],
      ['{a.b.c}', {a: {b: {c: 'hi'}}}, 'hi'],
      ['{a}', {}, '{a}'],
      ['{a} - {b} - {c}', {a: 1, b: 2, c: 3}, '1 - 2 - 3'],
      ['{a.b}{b.c}', {a: {b: 'h'}, b: {c: 'i'}}, 'hi'],
      ['abc{%foo%}-{{bar}}', {foo: 1, bar: 5}, 'abc1-5'],
    ])('\'%s\' using %p to \'%s\'', (tmp: string, source: any, res: string) => {
      expect(format(tmp, source)).toBe(res);
    });
  });
});

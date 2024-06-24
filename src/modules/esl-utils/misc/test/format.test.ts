import {
  toCamelCase,
  toKebabCase,
  capitalize,
  unwrapParenthesis,
  parseAspectRatio,
  evaluate,
  format,
  parseNumber,
  parseBoolean,
  parseString,
  parseCSSTime,
  parseCSSTimeSet
} from '../format';

describe('misc/format helper tests', () => {
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

  describe('parseBoolean', () => {
    test.each([
      [null, false],
      ['false', false],
      ['', true],
      ['true', true],
      ['0', false],
      ['1', true],
      ['brr', true]
    ])(
      'args = %p, result: %p',
      (args, exp) => expect(parseBoolean.call(null, args)).toBe(exp)
    );
  });

  describe('parseString', () => {
    test.each([
      [undefined, ''],
      [null, ''],
      ['false', 'false'],
      ['', ''],
      ['true', 'true']
    ])(
      'args = %p, result: %p',
      (args, exp) => expect(parseString.call(null, args)).toBe(exp)
    );
  });

  describe('parseNumber', () => {
    test.each([
      [['123'], 123],
      [['123', 1], 123],
      [[0], 0],
      [[0, 1], 0],
      [['a'], undefined],
      [['b', undefined], undefined],
      [['abc', NaN], NaN],
      [['def', 0], 0],
      [[''], undefined],
      [[false], undefined]
    ])(
      'args = %p, result: %p',
      (args, exp) => expect(parseNumber.apply(null, args)).toBe(exp)
    );
  });

  describe('parseCSSTime', () => {
    test.each([
      // Positive integer
      ['12s', 12000],
      ['350ms', 350],
      [' 12s ', 12000],
      [' 350ms ', 350],
      ['1024ms', 1024],
      // Non-integer
      ['.3s', 300],
      ['.124s', 124],
      ['.3ms', 0.3],
      // Negative integer
      ['-456ms', -456],
      // Case insensitive
      ['14mS', 14],
      ['14S', 14000],
      // Zero with leading +/-
      ['+0s', 0],
      ['-0ms', -0]
    ])(
      'valid time = %s parsed as %s',
      (time: string, result: number) => expect(parseCSSTime(time)).toBe(result)
    );
    test.each([
      // Although unitless zero is allowed for <length>s, it's invalid for <time>s.
      '0',
      // This is a <number>, not a <time>, because it's missing a unit.
      '12.0',
      // Invalid text
      'five seconds',
      's', 'ms',
      '350.s',
      ' s', ' ms',
      '.s', '.ms',
      // CSS time supports only seconds and milliseconds
      '4min'
    ])(
      'invalid time = %p parsed as NaN',
      (time: string) => expect(parseCSSTime(time)).toBe(NaN)
    );
  });

  describe('parseCSSTimeSet', () => {
    test.each([
      [['.3s'], [300]],
      [['.124s, .50s'], [124, 500]],
      [['350ms, 1400ms'], [350, 1400]],
      [['3s,1400ms'], [3000, 1400]],
      [['1024ms, second'], [1024, NaN]],
      [['350ms, 350.s'], [350, NaN]],
      [['ms, s'], [NaN, NaN]]
    ])(
      'time = %p',
      (time, num) => expect(parseCSSTimeSet.apply(null, time)).toStrictEqual(num)
    );
  });
});

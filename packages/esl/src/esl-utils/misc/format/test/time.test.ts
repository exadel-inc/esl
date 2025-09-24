import {parseCSSTime, parseCSSTimeSet, parseTime} from '../time';

describe('misc/format - time formatters test', () => {
  describe('parseTime', () => {
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
      // Exclusion
      ['none', 0],
      // Case insensitive
      ['14mS', 14],
      ['14S', 14000],
      // Zero with leading +/-
      ['+0s', 0],
      ['-0ms', -0],
      // Digits without unit should be parsed as milliseconds
      ['0', 0],
      ['100', 100],
      // Leading zeros
      ['012s', 12000],
      ['0350ms', 350],
      // Empty string
      ['', 0],
      // Extra dot
      ['350.s', 350000]
    ])(
      'valid time = %s parsed as %s',
      (time: string, result: number) => expect(parseTime(time)).toBe(result)
    );
    test.each([
      // Invalid text
      'five seconds',
      's',
      'ms',
      ' s ',
      ' ms ',
      '350.n',
      'abc',
      '-',
      'a',
      // CSS time supports only seconds and milliseconds
      '4min'
    ])(
      'invalid time = %p parsed as NaN',
      (time: string) => expect(parseTime(time)).toBe(NaN)
    );
  });

  describe('parseCSSTime', () => {
    test.each([
      // Positive integer
      ['12s', 12000],
      ['350ms', 350],
      ['1024ms', 1024],
      [' 12s ', 12000],
      [' 350ms   ', 350],
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

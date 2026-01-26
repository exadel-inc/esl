import {parseCSSTime, parseCSSTimeSet, parseTime, parseTimeSeconds} from '../time';

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
      // Negative integer
      ['-456ms', -456],
      // Exclusion
      ['none', 0],
      // Case insensitive
      ['14mS', 14],
      ['14S', 14000],
      // Zero with leading +/-
      ['+0s', 0],
      // Digits without unit should be parsed as milliseconds
      ['0', 0],
      ['100', 100],
      [123, 123],
      // Leading zeros
      ['012s', 12000],
      ['0350ms', 350],
      // Empty string
      ['', 0],
      // Extra dot
      ['350.s', 350000],

      // Full formats
      ['2h3m5s300ms', 7385300],
      ['0h0m0s0ms', 0],
      ['2h3m5s', 7385000],
      ['2h3m300ms', 7380300],
      ['2h5s300ms', 7205300],
      ['3m5s300ms', 185300],

      ['3s', 3000],
      ['3.5s', 3500],
      ['3m', 180000],
      ['3.5m', 210000],
      ['3h', 10800000],
      ['3.5h', 12600000],

      ['5s300ms', 5300],
      ['3m300ms', 180300],
      ['2h300ms', 7200300],
      ['3m5s', 185000],
      ['2h5s', 7205000],
      ['2h3m', 7380000],

      ['+2h-1m-3s+500ms', 7137500],
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
      '3.5ms',
      '++5s',
      '+-5s',
      '-+5s',
      '--5s',
      '-.-5s',
      '3.5.2s',
      '1s2.1.0ms',
      '2-3s',
      '2-s',
      '1h2m3s4ms5',
      '4min',
      '1h2h',
      '1m60m',
      '1h30'
    ])(
      'invalid time = %o parsed as NaN',
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
      // Negative integer
      ['-456ms', -456],
      // Case insensitive
      ['14mS', 14],
      ['14S', 14000],
      // Zero with leading +/-
      ['+0s', 0]
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
      'invalid time = %o parsed as NaN',
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
      'time = %o',
      (time, num) => expect(parseCSSTimeSet.apply(null, time)).toStrictEqual(num)
    );
  });

  describe('parseTimeSeconds', () => {
    test.each([
      [0, 0],
      [3, 3],
      [3.5, 3],
      ['30s', 30],
      ['3.5s', 3],
      ['2.51m', 150],
      ['3s700ms', 3],
      ['2h3s700ms', 7203],
      ['0s', 0],
    ])(
      'time = %o',
      (time, num) => expect(parseTimeSeconds(time)).toStrictEqual(num)
    );

    test.each([
      [null],
      ['m3s'],
      ['3s5m'],
      [''],
    ])(
      'invalid time = %o is 0',
      (time) => expect(parseTimeSeconds(time)).toStrictEqual(0)
    );
  });
});

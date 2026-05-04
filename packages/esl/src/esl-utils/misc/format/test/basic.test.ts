import {parseBoolean, parseFloatNumber, parseInteger, parseNumber, parseString} from '../basic';

describe('misc/format - basic formatters test', () => {
  describe('parseString', () => {
    test.each([
      [undefined, ''],
      [null, ''],
      ['false', 'false'],
      ['', ''],
      ['true', 'true']
    ])(
      'args = %o, result: %o',
      (args, exp) => expect(parseString.call(null, args)).toBe(exp)
    );
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
      'args = %o, result: %o',
      (args, exp) => expect(parseBoolean.call(null, args)).toBe(exp)
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
      'args = %o, result: %o',
      (args, exp) => expect(parseNumber.apply(null, args)).toBe(exp)
    );
  });

  describe('parseFloatNumber', () => {
    test.each([
      [null, NaN],
      ['', NaN],
      ['1.5', 1.5],
      [' 2.25 ', 2.25],
      ['10px', 10]
    ])(
      'args = %o, result: %o',
      (arg, exp) => expect(parseFloatNumber.call(null, arg)).toBe(exp)
    );
  });

  describe('parseInteger', () => {
    test.each([
      [null, NaN],
      ['', NaN],
      ['10', 10],
      [' 15 ', 15],
      ['10px', 10]
    ])(
      'args = %o, result: %o',
      (arg, exp) => expect(parseInteger.call(null, arg)).toBe(exp)
    );
  });
});

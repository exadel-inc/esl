import {parseBoolean, parseNumber, parseString} from '../basic';

describe('misc/format - basic formatters test', () => {
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
});

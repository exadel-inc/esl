import {DDMock} from '../../esl-utils/test/deviceDetector.mock';
import {ESLMediaQuery, ESLScreenBreakpoints, ESLScreenDPR} from '../core';

/**
 * ESL Media Query tests
 * Require mocked DeviceDetector and matchMedia
 *
 * Realization of ESL Media Query implies next query parsing cases
 * (examples for desktop device):
 * - `@mobile and @+sm` --\> 'not all (min-width: 768px)'
 * - `@1x and @mobile and @sm` --\> '(min-resolution: 96.0dpi) not all (min-width: 768px) and (max-width: 991px)'
 * - `@+sm, @desktop` --\> '(min-width: 768px),'
 * - `@mobile, @desktop` --\> 'not all,'
 * - `@desktop, @1x` --\> ', (min-resolution: 96.0dpi)'
 * - `@1x, @desktop, @sm` --\> '(min-resolution: 96.0dpi), , (min-width: 768px) and (max-width: 991px)'
 */
describe('ESLMediaQuery', () => {
  beforeAll(() => {
    ESLScreenBreakpoints.add('small', 100, 200);
  });

  describe('Trivial cases', () => {
    test.each([
      ['', 'all'],
      ['all', 'all'],
      ['not all', 'not all']
    ])('Apply tests for %p breakpoint', (query, expected) => {
      expect(ESLMediaQuery.from(query).toString()).toBe(expected);
    });

    test('Empty query', () => {
      expect(ESLMediaQuery.from('')).toBe(ESLMediaQuery.ALL);
    });

    test('Const query instances', () => {
      expect(ESLMediaQuery.from('all')).toBe(ESLMediaQuery.ALL);
      expect(ESLMediaQuery.from('not all')).toBe(ESLMediaQuery.NOT_ALL);
    });
  });

  describe('Breakpoint shortcuts', () => {
    test.each([
      ['@xs', '(min-width: 1px) and (max-width: 767px)'],
      ['@sm', '(min-width: 768px) and (max-width: 991px)'],
      ['@md', '(min-width: 992px) and (max-width: 1199px)'],
      ['@lg', '(min-width: 1200px) and (max-width: 1599px)'],
      ['@xl', '(min-width: 1600px) and (max-width: 999999px)'],
      ['@XL', '(min-width: 1600px) and (max-width: 999999px)'],
      ['@small', '(min-width: 100px) and (max-width: 200px)'],
      ['@+sm', '(min-width: 768px)'],
      ['@-md', '(max-width: 1199px)']
    ])('%s -> %s', (query, expected) => {
      expect(ESLMediaQuery.from(query).toString()).toBe(expected);
    });

    test.each([
      ['not @small', 'not ((min-width: 100px) and (max-width: 200px))'],
      ['not @+sm', 'not (min-width: 768px)'],
      ['not @-md', 'not (max-width: 1199px)'],
    ])('Inverted replacement %p', (query, expected) => {
      expect(ESLMediaQuery.from(query).toString()).toBe(expected);
    });

    test.each([
      ['@+sm, @-md', '(min-width: 768px), (max-width: 1199px)'],
      ['@+sm or @-md', '(min-width: 768px), (max-width: 1199px)'],
      ['@+sm and @-md', '(min-width: 768px) and (max-width: 1199px)'],
    ])('Inverted replacement %p', (query, expected) => {
      expect(ESLMediaQuery.from(query).toString()).toBe(expected);
    });
  });

  describe('DPR shortcuts', () => {
    test.each([
      ['@0x', '(min-resolution: 0.0dpi)'],
      ['@1x', '(min-resolution: 96.0dpi)'],
      ['@01x', '(min-resolution: 96.0dpi)'],
      ['@.3x', '(min-resolution: 28.8dpi)'],
      ['@0.3x', '(min-resolution: 28.8dpi)'],
      ['@1.6x', '(min-resolution: 153.6dpi)'],
    ])('Dpr %s replacement', (query, expected) => {
      expect(ESLMediaQuery.from(query).toString()).toBe(expected);
    });

    test.each([
      ['@1x', '(-webkit-min-device-pixel-ratio: 1)'],
      ['@2.3x', '(-webkit-min-device-pixel-ratio: 2.3)'],
    ])('Dpr %s replacement', (query, expected) => {
      DDMock.isSafari = true;
      expect(ESLMediaQuery.from(query).toString()).toBe(expected);
      DDMock.isSafari = false;
    });

    test('Bot DPR override test', () => {
      DDMock.isBot = true;
      ESLScreenDPR.ignoreBotsDpr = true;

      expect(ESLMediaQuery.from('@1x').toString()).toBe('(min-resolution: 96.0dpi)');
      expect(ESLMediaQuery.from('@3x, @2.4x').toString()).toBe('not all');

      DDMock.isBot = false;
      ESLScreenDPR.ignoreBotsDpr = false;
    });
  });

  describe('Device type shortcut', () => {
    test.each([
      ['@mobile', 'not all'],
      ['@Mobile', 'not all'],
      ['@MOBILE', 'not all'],
      ['@desktop', 'all'],
      ['@Desktop', 'all'],
      ['@DESKTOP', 'all'],
    ])('Query check for %p', (query, expected) => {
      expect(ESLMediaQuery.from(query).toString()).toBe(expected);
    });

    test.each([
      ['not @mobile', 'all'],
      ['not @desktop', 'not all']
    ])('Inverted query check for %p', (query, expected) => {
      expect(ESLMediaQuery.from(query).toString()).toBe(expected);
    });
  });

  describe('Browser check shortcut', () => {
    test.each([
      ['@ie', 'not all'],
      ['@edge', 'not all'],
      ['@gecko', 'not all'],
      ['@blink', 'not all'],
      ['@safari', 'not all']
    ])('Query check for %p', (query, expected) => {
      expect(ESLMediaQuery.from(query).toString()).toBe(expected);
    });

    test.each([
      ['not @ie', 'all']
    ])('Inverted query check for %p', (query, expected) => {
      expect(ESLMediaQuery.from(query).toString()).toBe(expected);
    });
  });

  describe('Edge cases', () => {
    test.each([
      ['@smnot', '@smnot'],
      ['@+smnot', '@+smnot'],
      ['2x', '2x'],
      ['@-2x', '@-2x'],
      ['@1.5', '@1.5'],
      ['not valid', 'not valid']
    ])('Apply tests for %p breakpoint', (query, expected) => {
      expect(ESLMediaQuery.from(query).toString()).toBe(expected);
    });
  });

  describe('Logical operations', () => {
    describe('Conjunction', () => {
      test.each([
        ['@desktop and @2x', '(min-resolution: 192.0dpi)'],
        ['@1x and @+sm', '(min-resolution: 96.0dpi) and (min-width: 768px)'],
        ['@+sm and @desktop', '(min-width: 768px)'],
        ['@2.5x and @desktop and @+sm', '(min-resolution: 240.0dpi) and (min-width: 768px)'],
        ['@desktop and @+sm and @2.5x', '(min-width: 768px) and (min-resolution: 240.0dpi)'],
        ['@+sm and @2.6x and @desktop', '(min-width: 768px) and (min-resolution: 249.6dpi)'],
      ])('%s to %s', (query, expected) => {
        expect(ESLMediaQuery.from(query).toString()).toBe(expected);
      });
    });

    describe('Disjunction', (() => {
      test.each([
        ['@+xs, @+sm', '(min-width: 1px), (min-width: 768px)'],
        ['@1x, @2x', '(min-resolution: 96.0dpi), (min-resolution: 192.0dpi)'],
        ['@1x, @+sm', '(min-resolution: 96.0dpi), (min-width: 768px)'],
        ['@+sm, @1x', '(min-width: 768px), (min-resolution: 96.0dpi)'],
      ])('%s to %s', (query, expected) => {
        expect(ESLMediaQuery.from(query).toString()).toBe(expected);
      });
    }));
  });

  describe('Optimization', () => {
    describe('Conjunction', () => {
      test.each([
        ['@1x and @+sm and all', '(min-resolution: 96.0dpi) and (min-width: 768px)'],
        ['@1x and @+sm, not all', '(min-resolution: 96.0dpi) and (min-width: 768px)'],
      ])('Combination %s', (query, expected) => {
        expect(ESLMediaQuery.from(query).toString()).toBe(expected);
      });
    });
  });

  describe('Cache test', () => {
    test.each([
      ['all'],
      ['not all'],
      ['@xs'],
      ['@xs or @xl']
    ])('Apply tests for %p breakpoint', (query) => {
      expect(ESLMediaQuery.for(query)).toBe(ESLMediaQuery.for(query));
    });
  });
});

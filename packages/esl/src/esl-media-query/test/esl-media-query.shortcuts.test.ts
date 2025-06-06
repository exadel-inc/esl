import {DevicesMock} from '../../esl-utils/test/deviceDetector.mock';
import {ESLMediaQuery, ESLScreenBreakpoints, ESLMediaShortcuts} from '../core';
import {ESLMediaChangeEvent} from '../core/conditions/media-query-base';

/**
 * ESL Media Query tests
 * Require mocked matchMedia and environment device checks
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
describe('ESLMediaQuery: shortcuts', () => {
  describe('Breakpoint shortcuts', () => {
    beforeAll(() => {
      ESLScreenBreakpoints.add('small', 100, 200);
    });

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
      DevicesMock.isSafari = true;
      expect(ESLMediaQuery.from(query).toString()).toBe(expected);
      DevicesMock.isSafari = false;
    });
  });

  describe('Device type shortcut', () => {
    test.each([
      ['@mobile', '[mobile = not all]'],
      ['@Mobile', '[mobile = not all]'],
      ['@MOBILE', '[mobile = not all]'],
      ['@desktop', '[desktop = all]'],
      ['@Desktop', '[desktop = all]'],
      ['@DESKTOP', '[desktop = all]'],
    ])('Query check for %p', (query, expected) => {
      expect(ESLMediaQuery.from(query).toString()).toBe(expected);
    });

    test.each([
      ['not @mobile', 'not [mobile = not all]'],
      ['not @desktop', 'not [desktop = all]']
    ])('Inverted query check for %p', (query, expected) => {
      expect(ESLMediaQuery.from(query).toString()).toBe(expected);
    });
  });

  describe('Browser check shortcut', () => {
    test.each([
      ['@edge', '[edge = not all]'],
      ['@gecko', '[gecko = not all]'],
      ['@blink', '[blink = not all]'],
      ['@safari', '[safari = not all]']
    ])('Query check for %p', (query, expected) => {
      expect(ESLMediaQuery.from(query).toString()).toBe(expected);
    });

    test.each([
      ['@ie', '[ie = not all]'],
      ['not @ie', 'not [ie = not all]']
    ])('Legacy check for %p', (query, expected) => {
      expect(ESLMediaQuery.from(query).toString()).toBe(expected);
    });
  });

  describe('Static shortcut', () => {
    test('Static shortcut can be set with boolean value', () => {
      expect(ESLMediaQuery.from('@stest0').matches).toBe(false);
      ESLMediaShortcuts.set('stest0', true);
      expect(ESLMediaQuery.from('@stest0').matches).toBe(true);
    });

    test('Static shortcut can be reset', () => {
      ESLMediaShortcuts.set('stest2', true);
      expect(ESLMediaQuery.from('@stest2').matches).toBe(true);
      ESLMediaShortcuts.set('stest2', false);
      expect(ESLMediaQuery.from('@stest2').matches).toBe(false);
      ESLMediaShortcuts.set('stest2', true);
      expect(ESLMediaQuery.from('@stest2').matches).toBe(true);
    });

    test('Static shortcut can be observed', () => {
      const listener = jest.fn();
      ESLMediaQuery.from('@stest').addEventListener(listener);
      expect(listener).not.toBeCalled();

      ESLMediaShortcuts.set('stest', true);
      expect(listener).toBeCalledTimes(1);
      expect(listener).lastCalledWith(expect.any(ESLMediaChangeEvent));
      expect(listener).lastCalledWith(expect.objectContaining({
        matches: true,
        media: String(ESLMediaQuery.from('@stest')),
        target:  ESLMediaQuery.from('@stest'),
        currentTarget:  ESLMediaQuery.from('@stest')
      }));

      ESLMediaShortcuts.set('stest', false);
      expect(listener).toBeCalledTimes(2);
      expect(listener).lastCalledWith(expect.any(ESLMediaChangeEvent));
      expect(listener).lastCalledWith(expect.objectContaining({
        matches: false,
        media: String(ESLMediaQuery.from('@stest')),
        target:  ESLMediaQuery.from('@stest'),
        currentTarget:  ESLMediaQuery.from('@stest')
      }));
    });

    test('Static shortcut can be inverted', () => {
      ESLMediaShortcuts.set('stest3', false);
      expect(ESLMediaQuery.from('not @stest3').matches).toBe(true);
      ESLMediaShortcuts.set('stest3', true);
      expect(ESLMediaQuery.from('not @stest3').matches).toBe(false);
    });
  });
});

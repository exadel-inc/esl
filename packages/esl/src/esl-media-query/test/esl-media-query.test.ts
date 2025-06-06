import {ESLMediaQuery, ESLScreenBreakpoints} from '../core';
import {getMatchMediaMock} from '../../esl-utils/test/matchMedia.mock';
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

  describe('Edge cases', () => {
    test.each([
      ['@smnot', '[smnot = not all]'],
      ['@+smnot', 'not all'],
      ['2x', '2x'],
      ['@-2x', 'not all'],
      ['@1.5', 'not all'],
      ['not valid', 'not valid']
    ])('Apply tests for %p breakpoint', (query, expected) => {
      expect(ESLMediaQuery.from(query).toString()).toBe(expected);
    });
  });

  describe('Logical operations', () => {
    describe('Conjunction', () => {
      test.each([
        ['all and @2x', '(min-resolution: 192.0dpi)'],
        ['@1x and @+sm', '(min-resolution: 96.0dpi) and (min-width: 768px)'],
        ['@+sm and all', '(min-width: 768px)'],
        ['@2.5x and all and @+sm', '(min-resolution: 240.0dpi) and (min-width: 768px)'],
        ['all and @+sm and @2.5x', '(min-width: 768px) and (min-resolution: 240.0dpi)'],
        ['@+sm and @2.6x and all', '(min-width: 768px) and (min-resolution: 249.6dpi)'],
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

    describe('Disjunction', () => {
      test.each([
        ['@1x or @+sm or all', 'all'],
        ['@1x or @+sm, not all', '(min-resolution: 96.0dpi), (min-width: 768px)'],
      ])('Combination %s', (query, expected) => {
        expect(ESLMediaQuery.from(query).toString()).toBe(expected);
      });
    });

    describe('Double negation', () => {
      test.each([
        ['not not @1x', '(min-resolution: 96.0dpi)'],
        ['not not @+sm', '(min-width: 768px)'],
        ['not not all', 'all'],
        ['not not not all', 'not all'],
        ['not not not @1x', 'not (min-resolution: 96.0dpi)']
      ])('Double negation %s', (query, expected) => {
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

  describe('EventTarget interface implementation', () => {
    const mockLgMatchMedia = getMatchMediaMock(ESLScreenBreakpoints.get('lg')!.mediaQuery);
    const mockXlMatchMedia = getMatchMediaMock(ESLScreenBreakpoints.get('xl')!.mediaQuery);

    test('Methods availability', () => {
      const mq = ESLMediaQuery.for('(max-width: 500px)');
      expect(typeof mq.addEventListener).toBe('function');
      expect(typeof mq.removeEventListener).toBe('function');
      expect(typeof mq.dispatchEvent).toBe('function');
    });

    test('ESLMediaChangeEvent', () => {
      const listener = jest.fn();

      mockLgMatchMedia.matches = false;
      ESLMediaQuery.for('@lg').addEventListener(listener);
      expect(listener).not.toBeCalled();

      mockLgMatchMedia.matches = true;
      expect(listener).toBeCalledTimes(1);
      expect(listener).lastCalledWith(expect.any(ESLMediaChangeEvent));
      expect(listener).lastCalledWith(expect.objectContaining({
        matches: true,
        media: String(ESLMediaQuery.for('@lg')),
        target:  ESLMediaQuery.for('@lg'),
        currentTarget:  ESLMediaQuery.for('@lg')
      }));

      mockLgMatchMedia.matches = false;
      expect(listener).toBeCalledTimes(2);
      expect(listener).lastCalledWith(expect.any(ESLMediaChangeEvent));
      expect(listener).lastCalledWith(expect.objectContaining({
        matches: false,
        media: String(ESLMediaQuery.for('@lg')),
        target:  ESLMediaQuery.for('@lg'),
        currentTarget:  ESLMediaQuery.for('@lg')
      }));
    });

    test('Conjunction listener',  ()=> {
      const fn1 = jest.fn();
      const fn2 = jest.fn();

      mockLgMatchMedia.matches = false;
      mockXlMatchMedia.matches = false;

      ESLMediaQuery.for('@lg and @xl').addEventListener(fn1);
      ESLMediaQuery.for('@lg and @xl').addEventListener('change', fn2);

      expect(ESLMediaQuery.for('@lg and @xl').matches).toBe(false);
      expect(fn1).toBeCalledTimes(0);
      expect(fn2).toBeCalledTimes(0);

      mockLgMatchMedia.matches = true;
      expect(ESLMediaQuery.for('@lg and @xl').matches).toBe(false);
      expect(fn1).toBeCalledTimes(0);
      expect(fn2).toBeCalledTimes(0);

      mockXlMatchMedia.matches = true;
      expect(ESLMediaQuery.for('@lg and @xl').matches).toBe(true);
      expect(fn1).toBeCalledTimes(1);
      expect(fn2).toBeCalledTimes(1);

      ESLMediaQuery.for('@lg and @xl').removeEventListener(fn1);
      mockXlMatchMedia.matches = false;
      expect(fn1).toBeCalledTimes(1);
      expect(fn2).toBeCalledTimes(2);

      ESLMediaQuery.for('@lg and @xl').removeEventListener(fn2);
      mockXlMatchMedia.matches = true;
      expect(fn1).toBeCalledTimes(1);
      expect(fn2).toBeCalledTimes(2);
    });

    test('Disjunction listener',  ()=> {
      const fn1 = jest.fn();
      const fn2 = jest.fn();

      mockLgMatchMedia.matches = false;
      mockXlMatchMedia.matches = false;

      ESLMediaQuery.for('@lg or @xl').addEventListener(fn1);
      ESLMediaQuery.for('@lg or @xl').addEventListener('change', fn2);

      expect(ESLMediaQuery.for('@lg or @xl').matches).toBe(false);
      expect(fn1).toBeCalledTimes(0);
      expect(fn2).toBeCalledTimes(0);

      mockLgMatchMedia.matches = true;
      expect(ESLMediaQuery.for('@lg or @xl').matches).toBe(true);
      expect(fn1).toBeCalledTimes(1);
      expect(fn2).toBeCalledTimes(1);

      mockXlMatchMedia.matches = true;
      expect(ESLMediaQuery.for('@lg or @xl').matches).toBe(true);
      expect(fn1).toBeCalledTimes(1);
      expect(fn2).toBeCalledTimes(1);

      ESLMediaQuery.for('@lg or @xl').removeEventListener(fn1);
      mockLgMatchMedia.matches = false;
      mockXlMatchMedia.matches = false;
      expect(fn1).toBeCalledTimes(1);
      expect(fn2).toBeCalledTimes(2);

      ESLMediaQuery.for('@lg or @xl').removeEventListener(fn2);
      mockLgMatchMedia.matches = true;
      mockXlMatchMedia.matches = false;
      expect(fn1).toBeCalledTimes(1);
      expect(fn2).toBeCalledTimes(2);
    });
  });
});

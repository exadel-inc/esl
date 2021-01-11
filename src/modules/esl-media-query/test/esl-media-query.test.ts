/**
 * ESL Media Query tests
 *
 * Require mocked DeviceDetector and matchMedia
 * Constructor tests compare expected results with called args of mocked matchMedia func
 * ESL Media Query cashes queries, so make sure all queries come to matchMedia are different
 *
 * Realization of ESL Media Query implies next query parsing cases
 * (examples for desktop device):
 * - '@mobile and @+sm' --> 'not all (min-width: 768px)'
 * - '@1x and @mobile and @sm' --> '(min-resolution: 96.0dpi) not all (min-width: 768px) and (max-width: 991px)'
 * - '@+sm, @desktop' --> '(min-width: 768px),'
 * - '@mobile, @desktop' --> 'not all,'
 * - '@desktop, @1x' --> ', (min-resolution: 96.0dpi)'
 * - '@1x, @desktop, @sm' --> '(min-resolution: 96.0dpi), , (min-width: 768px) and (max-width: 991px)'
 */

import {mmMock} from "../../esl-utils/test/matchMedia.mock";
import {DDMock} from "../../esl-utils/test/deviceDetector.mock";

import ESLMediaBreakpoints from '../core/esl-media-breakpoints';
import ESLMediaQuery from '../core/esl-media-query';

describe('ESLMediaQuery tests', () => {
  beforeAll(() => {
    ESLMediaBreakpoints.addCustomBreakpoint('small', 100, 200);
  });

  describe('Constructor tests', () => {
    test.each([
      ['@0x', false, '(min-resolution: 0.0dpi)'],
      ['@1x', false, '(min-resolution: 96.0dpi)'],
      ['@0.3x', false, '(min-resolution: 28.8dpi)'],
      ['@1.6x', false, '(min-resolution: 153.6dpi)'],
      ['@1x', true, '(-webkit-min-device-pixel-ratio: 1)'],
      ['@2.3x', true, '(-webkit-min-device-pixel-ratio: 2.3)'],
    ])('Dpr %s replacement', (query, isSafari, expected) => {
      DDMock.isSafari = isSafari;
      const mq = new ESLMediaQuery(query);
      expect(mmMock).toHaveBeenLastCalledWith(expected);
      DDMock.isSafari = false;
    });

    test.each([
      ['@xs', '(min-width: 1px) and (max-width: 767px)'],
      ['@small', '(min-width: 100px) and (max-width: 200px)'],
    ])('Bp %s replacement', (query, expected) => {
      const mq = new ESLMediaQuery(query);
      expect(mmMock).toHaveBeenLastCalledWith(expected);
    });

    test('Device replacement', () => {
      const mqMobile = new ESLMediaQuery('@mobile');
      expect(mmMock).toHaveBeenLastCalledWith('not all');
      const mqDesktop = new ESLMediaQuery('@desktop');
      expect(mmMock).toHaveBeenLastCalledWith('all');
    });
  })

  describe('Complex tests', () => {
    describe('And combination', () => {
      test.each([
        ['@desktop and @2x', '(min-resolution: 192.0dpi)'],
        ['@1x and @+sm', '(min-resolution: 96.0dpi) and (min-width: 768px)'],
        ['@+sm and @desktop', '(min-width: 768px)'],
        ['@2.5x and @desktop and @+sm', '(min-resolution: 240.0dpi) and (min-width: 768px)'],
        ['@desktop and @+sm and @2.5x', '(min-width: 768px) and (min-resolution: 240.0dpi)'],
        ['@+sm and @2.6x and @desktop', '(min-width: 768px) and (min-resolution: 249.6dpi)'],
      ])('Combination %s', (query, expected) => {
        const mq = new ESLMediaQuery(query);
        expect(mmMock).toHaveBeenLastCalledWith(expected);
      });
    })

    describe('Or combination', () => {
      test.each([
        ['@1x, @+sm', '(min-resolution: 96.0dpi), (min-width: 768px)'],
        ['@+sm, @1x', '(min-width: 768px), (min-resolution: 96.0dpi)'],
      ])('Combination %s', (query, expected) => {
        const mq = new ESLMediaQuery(query);
        expect(mmMock).toHaveBeenLastCalledWith(expected);
      })
    })

    describe('Multiple basis terms', (() => {
      test.each([
        ['@+xs, @+sm', '(min-width: 1px), (min-width: 768px)'],
        ['@1x, @2x', '(min-resolution: 96.0dpi), (min-resolution: 192.0dpi)'],
      ])('%s', (query, expected) => {
        const mq = new ESLMediaQuery(query);
        expect(mmMock).toHaveBeenLastCalledWith(expected);
      })
    }))
  })

  describe('Breaking tests', () => {
    test.each([
      ['2x', '2x'],
      ['@.2x', '@.2x'],
      ['@-2x', '@-2x'],
      ['@02x', '@02x'],
      ['@1.5', '@1.5'],
      ['@1.23x', '@1.23x'],
      ['not valid', 'not valid']
    ])('%s', (query, expected) => {
      const mq = new ESLMediaQuery(query);
      expect(mmMock).toHaveBeenLastCalledWith(expected);
    })
  })

  describe('API tests', () => {
    test('DPR getters', () => {
      expect(new ESLMediaQuery('@sm').dpr).toBe(1);
      expect(new ESLMediaQuery('@2x').dpr).toBe(2);
      expect(new ESLMediaQuery('@2.3x').dpr).toBe(2.3);
    });

    test('Mobile/Desktop getters', () => {
      const mqMob = new ESLMediaQuery('@Mobile');
      const mqDesk = new ESLMediaQuery('@Desktop');

      expect(mqMob.isMobileOnly).toBeTruthy();
      expect(mqMob.isDesktopOnly).toBeFalsy();

      expect(mqDesk.isDesktopOnly).toBeTruthy();
      expect(mqDesk.isMobileOnly).toBeFalsy();

    });

    test('Listeners', () => {
      const mq = new ESLMediaQuery('@xs');
      const listener = jest.fn();

      mq.addListener(listener);
      mq.removeListener(listener);

      expect(mq.query.addEventListener).toHaveBeenCalled();
      expect(mq.query.removeEventListener).toHaveBeenCalled();

      expect(mq.query.addListener).not.toBeCalled();
      expect(mq.query.removeListener).not.toBeCalled();
    });

    test('toString', () => {
      expect(new ESLMediaQuery('@1x, @+sm').toString()).toContain('(min-resolution: 96.0dpi), (min-width: 768px)')
    });
  })

  test('Bot DPR override test', () => {
    ESLMediaQuery.ignoreBotsDpr = true;
    DDMock.isBot = true;

    const mq = new ESLMediaQuery('@3x, @2.4x');
    expect(mmMock).toHaveBeenLastCalledWith('not all, not all');

    DDMock.isBot = false;
    ESLMediaQuery.ignoreBotsDpr = false;
  })
})

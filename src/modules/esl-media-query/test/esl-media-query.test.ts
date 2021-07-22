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

import {ESLMediaQuery, ESLScreenBreakpoint} from '../core';
import {ESLMediaDPRShortcut} from '../core/esl-media-shortcuts';
import {ALL, NOT_ALL} from '../core/esl-mq-base';

describe('ESLMediaQuery tests', () => {
  beforeAll(() => {
    ESLScreenBreakpoint.add('small', 100, 200);
  });

  describe('Constructor tests', () => {
    test.each([
      ['@0x', false, '(min-resolution: 0.0dpi)'],
      ['@1x', false, '(min-resolution: 96.0dpi)'],
      ['@01x', false, '(min-resolution: 96.0dpi)'],
      ['@.3x', false, '(min-resolution: 28.8dpi)'],
      ['@0.3x', false, '(min-resolution: 28.8dpi)'],
      ['@1.6x', false, '(min-resolution: 153.6dpi)'],
      ['@1x', true, '(-webkit-min-device-pixel-ratio: 1)'],
      ['@2.3x', true, '(-webkit-min-device-pixel-ratio: 2.3)'],
    ])('Dpr %s replacement', (query, isSafari, expected) => {
      DDMock.isSafari = isSafari;
      const mq = ESLMediaQuery.parse(query);
      expect(mmMock).toHaveBeenLastCalledWith(expected);
      DDMock.isSafari = false;
    });

    test.each([
      ['@xs', '(min-width: 1px) and (max-width: 767px)'],
      ['@small', '(min-width: 100px) and (max-width: 200px)'],
    ])('Bp %s replacement', (query, expected) => {
      const mq = ESLMediaQuery.parse(query);
      expect(mmMock).toHaveBeenLastCalledWith(expected);
    });

    test('Device replacement', () => {
      const mqMobile = ESLMediaQuery.parse('@mobile');
      expect(mqMobile).toBe(NOT_ALL);
      const mqDesktop = ESLMediaQuery.parse('@desktop');
      expect(mqDesktop).toBe(ALL);
    });
  })

  /*
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
        const mq = ESLMediaQuery.parse(query);
        expect(mmMock).toHaveBeenLastCalledWith(expected);
      });
    })

    describe('Or combination', () => {
      test.each([
        ['@1x, @+sm', '(min-resolution: 96.0dpi), (min-width: 768px)'],
        ['@+sm, @1x', '(min-width: 768px), (min-resolution: 96.0dpi)'],
      ])('Combination %s', (query, expected) => {
        const mq = ESLMediaQuery.parse(query);
        expect(mmMock).toHaveBeenLastCalledWith(expected);
      })
    })

    describe('Multiple basis terms', (() => {
      test.each([
        ['@+xs, @+sm', '(min-width: 1px), (min-width: 768px)'],
        ['@1x, @2x', '(min-resolution: 96.0dpi), (min-resolution: 192.0dpi)'],
      ])('%s', (query, expected) => {
        const mq = ESLMediaQuery.parse(query);
        expect(mmMock).toHaveBeenLastCalledWith(expected);
      })
    }))
  })
  */

  describe('Breaking tests', () => {
    test.each([
      ['2x', '2x'],
      ['@-2x', '@-2x'],
      ['@1.5', '@1.5'],
      ['not valid', 'valid']
    ])('%s', (query, expected) => {
      const mq = ESLMediaQuery.parse(query);
      expect(mmMock).toHaveBeenLastCalledWith(expected);
    })
  })

  describe('API tests', () => {
    test('toString', () => {
      expect(ESLMediaQuery.parse('@1x, @+sm').toString()).toContain('(min-resolution: 96.0dpi), (min-width: 768px)')
    });
  })

  test('Bot DPR override test', () => {
    ESLMediaDPRShortcut.ignoreBotsDpr = true;
    DDMock.isBot = true;

    const mq = ESLMediaQuery.parse('@3x, @2.4x');
    expect(mq).toBe(NOT_ALL);

    DDMock.isBot = false;
    ESLMediaDPRShortcut.ignoreBotsDpr = false;
  })
})

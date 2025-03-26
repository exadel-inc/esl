import {calcPopupPosition} from '../core/esl-popup-position';
import {Rect} from '../../esl-utils/dom';

import type {PopupPositionConfig, PopupPositionValue} from '../core/esl-popup-position';

describe('ESLPopup position: calcPopupPosition(): behavior set to none', () => {
  const arrow = new Rect(0, 0, 30, 30);
  const popup = new Rect(0, 0, 300, 200);
  const trigger = new Rect(500, 500, 20, 20);
  const container = new Rect(0, 0, 1000, 1000);
  const cfgRef = {
    behavior: 'none',
    position: 'top',
    marginArrow: 7,
    offsetArrowRatio: 0,
    intersectionRatio: {top: 0, left: 0, right: 0, bottom: 0},
    arrow,
    element: popup,
    inner: trigger.grow(10),
    outer: container,
    trigger
  } as PopupPositionConfig;

  const expectedRef = {
    arrow: {x: 7, y: 7},
    placedAt: 'top',
    popup
  };

  describe('should calc position without adjustments:', () => {
    test('when the popup placed at the top', () => {
      const cfg = {...cfgRef, position: 'top'} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.popup = popup.shift(488, 290);
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });

    test('when the popup placed at the left', () => {
      const cfg = {...cfgRef, position: 'left'} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.popup = popup.shift(190, 488);
      expected.placedAt = 'left';
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });

    test('when the popup placed at the bottom', () => {
      const cfg = {...cfgRef, position: 'bottom'} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.popup = popup.shift(488, 530);
      expected.placedAt = 'bottom';
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });

    test('when the popup placed at the right', () => {
      const cfg = {...cfgRef, position: 'right'} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.popup = popup.shift(530, 488);
      expected.placedAt = 'right';
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });
  });

  describe('should calc arrow position:', () => {

    test('when arrow at the start edge', () => {
      const cfg = {...cfgRef, offsetArrowRatio: 0} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.popup = popup.shift(488, 290);
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });

    test('when arrow at the end edge', () => {
      const cfg = {...cfgRef, offsetArrowRatio: 1} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.arrow = {x: 263, y: 163};
      expected.popup = popup.shift(232, 290);
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });

    test('when arrow at the middle', () => {
      const cfg = {...cfgRef, offsetArrowRatio: 0.5} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.arrow = {x: 135, y: 85};
      expected.popup = popup.shift(360, 290);
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });
  });
});

import {calcPopupPosition} from '../core/esl-popup-position';
import {Rect} from '../../esl-utils/dom';

import type {PopupPositionConfig, PopupPositionValue} from '../core/esl-popup-position';

describe('ESLPopup position: calcPopupPosition(): behavior set to none and origin set to inner', () => {
  const arrow = new Rect(0, 0, 30, 30);
  const popup = new Rect(0, 0, 200, 200);
  const trigger = new Rect(250, 250, 500, 500);
  const container = new Rect(0, 0, 1000, 1000);
  const cfgRef = {
    behavior: 'none',
    placement: 'top',
    hasInnerOrigin: true,
    offsetPlacement: 0,
    marginTether: 10,
    offsetTetherRatio: 0,
    intersectionRatio: {},
    arrow,
    element: popup,
    inner: trigger.shrink(25),
    outer: container,
    trigger
  } as PopupPositionConfig;

  const expectedRef = {
    arrow: {x: 10, y: 10},
    placedAt: 'top-inner',
    popup
  };

  describe('should calc position without adjustments:', () => {
    test('when the popup placed at the top', () => {
      const cfg = {...cfgRef, position: 'top'} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.popup = popup.shift(475, 275);
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });

    test('when the popup placed at the left', () => {
      const cfg = {...cfgRef, placement: 'left'} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.popup = popup.shift(275, 475);
      expected.placedAt = 'left-inner';
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });

    test('when the popup placed at the bottom', () => {
      const cfg = {...cfgRef, placement: 'bottom'} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.popup = popup.shift(475, 525);
      expected.placedAt = 'bottom-inner';
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });

    test('when the popup placed at the right', () => {
      const cfg = {...cfgRef, placement: 'right'} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.popup = popup.shift(525, 475);
      expected.placedAt = 'right-inner';
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });
  });

  describe('should calc arrow position:', () => {

    test('when arrow at the start edge', () => {
      const cfg = {...cfgRef, offsetTetherRatio: 0} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.popup = popup.shift(475, 275);
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });

    test('when arrow at the end edge', () => {
      const cfg = {...cfgRef, offsetTetherRatio: 1} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.arrow = {x: 160, y: 160};
      expected.popup = popup.shift(325, 275);
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });

    test('when arrow at the middle', () => {
      const cfg = {...cfgRef, offsetTetherRatio: 0.5} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.arrow = {x: 85, y: 85};
      expected.popup = popup.shift(400, 275);
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });
  });
});

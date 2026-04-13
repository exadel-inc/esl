import {calcPopupPosition} from '../core/esl-popup-position';
import {Rect} from '../../esl-utils/dom';

import type {PopupPositionConfig, PopupPositionValue} from '../core/esl-popup-position';

describe('ESLPopup position: calcPopupPosition(): behavior set to fit-major', () => {
  const arrow = new Rect(0, 0, 30, 30);
  const popup = new Rect(0, 0, 300, 200);
  const trigger = new Rect(500, 500, 20, 20);
  const container = new Rect(0, 0, 1000, 1000);
  const intersectionRatio = {top: 0, left: 0, right: 0, bottom: 0};
  const cfgRef = {
    behavior: 'fit-major',
    placement: 'top',
    offsetPlacement: 0,
    marginTether: 7,
    offsetTetherRatio: 0,
    intersectionRatio,
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

  describe('should flip to the opposite position:', () => {
    test('when there is a lack of space at the top', () => {
      const cfg = {...cfgRef, placement: 'top', outer: container.shift(0, 400)} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.popup = popup.shift(488, 530);
      expected.placedAt = 'bottom';
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });

    test('when there is a lack of space at the left', () => {
      const cfg = {...cfgRef, placement: 'left', outer: container.shift(400, 0)} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.popup = popup.shift(530, 488);
      expected.placedAt = 'right';
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });

    test('when there is a lack of space at the bottom', () => {
      const cfg = {...cfgRef, placement: 'bottom', outer: container.shift(0, -400)} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.popup = popup.shift(488, 290);
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });

    test('when there is a lack of space at the right', () => {
      const cfg = {...cfgRef, placement: 'right', outer: container.shift(-400, 0)} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.popup = popup.shift(190, 488);
      expected.placedAt = 'left';
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });

    test('when the activator is crossing the top edge of the container', () => {
      const cfg = {...cfgRef, placement: 'top', intersectionRatio: {top: 0.5, left: 0, right: 0, bottom: 0}} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.popup = popup.shift(488, 530);
      expected.placedAt = 'bottom';
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });

    test('when the activator is crossing the left edge of the container', () => {
      const cfg = {...cfgRef, placement: 'left', intersectionRatio: {top: 0, left: 0.5, right: 0, bottom: 0}} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.popup = popup.shift(530, 488);
      expected.placedAt = 'right';
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });

    test('when the activator is crossing the bottom edge of the container', () => {
      const cfg = {...cfgRef, placement: 'bottom', intersectionRatio: {top: 0, left: 0, right: 0, bottom: 0.5}} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.popup = popup.shift(488, 290);
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });

    test('when the activator is crossing the right edge of the container', () => {
      const cfg = {...cfgRef, placement: 'right', intersectionRatio: {top: 0, left: 0, right: 0.5, bottom: 0}} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.popup = popup.shift(190, 488);
      expected.placedAt = 'left';
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });
  });
});

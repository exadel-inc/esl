import {calcPopupPosition} from '../core/esl-popup-position';
import {Rect} from '../../esl-utils/dom';

import type {PopupPositionConfig, PopupPositionValue} from '../core/esl-popup-position';

describe('ESLPopup position: calcPopupPosition(): behavior set to fit-major and origin set to inner', () => {
  const arrow = new Rect(0, 0, 30, 30);
  const popup = new Rect(0, 0, 200, 200);
  const trigger = new Rect(250, 250, 500, 500);
  const container = new Rect(0, 0, 1000, 1000);
  const cfgRef = {
    behavior: 'fit-major',
    position: 'top',
    hasInnerOrigin: true,
    marginArrow: 10,
    offsetArrowRatio: 0.5,
    intersectionRatio: {},
    arrow,
    element: popup,
    inner: trigger.shrink(25),
    outer: container,
    trigger
  } as PopupPositionConfig;

  const expectedRef = {
    arrow: {x: 85, y: 85},
    placedAt: 'top-inner',
    popup
  };

  describe('should flip to the opposite position:', () => {
    test('when there is a lack of space at the top', () => {
      const cfg = {...cfgRef, position: 'top', outer: container.shift(0, 400)} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.popup = popup.shift(400, 525);
      expected.placedAt = 'bottom-inner';
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });

    test('when there is a lack of space at the left', () => {
      const cfg = {...cfgRef, position: 'left', outer: container.shift(400, 0)} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.popup = popup.shift(525, 400);
      expected.placedAt = 'right-inner';
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });

    test('when there is a lack of space at the bottom', () => {
      const cfg = {...cfgRef, position: 'bottom', outer: container.shift(0, -400)} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.popup = popup.shift(400, 275);
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });

    test('when there is a lack of space at the right', () => {
      const cfg = {...cfgRef, position: 'right', outer: container.shift(-400, 0)} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.popup = popup.shift(275, 400);
      expected.placedAt = 'left-inner';
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });
  });

  describe('should not flip to the opposite position if the activator intersects the container by the opposite side:', () => {
    test('when there is a lack of space at the top', () => {
      const cfg = {
        ...cfgRef,
        position: 'top',
        outer: container.shift(0, 400),
        intersectionRatio: {bottom: 0.1}
      } as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.popup = popup.shift(400, 275);
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });

    test('when there is a lack of space at the left', () => {
      const cfg = {
        ...cfgRef,
        position: 'left',
        outer: container.shift(400, 0),
        intersectionRatio: {right: 0.1}
      } as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.popup = popup.shift(275, 400);
      expected.placedAt = 'left-inner';
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });

    test('when there is a lack of space at the bottom', () => {
      const cfg = {
        ...cfgRef,
        position: 'bottom',
        outer: container.shift(0, -400),
        intersectionRatio: {top: 0.1}
      } as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.popup = popup.shift(400, 525);
      expected.placedAt = 'bottom-inner';
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });

    test('when there is a lack of space at the right', () => {
      const cfg = {
        ...cfgRef,
        position: 'right',
        outer: container.shift(-400, 0),
        intersectionRatio: {left: 0.1}
      } as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.popup = popup.shift(525, 400);
      expected.placedAt = 'right-inner';
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });
  });
});

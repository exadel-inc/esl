import {calcPopupPosition} from '../core/esl-popup-position';
import {Rect} from '../../esl-utils/dom';

import type {PopupPositionConfig, PopupPositionValue} from '../core/esl-popup-position';

describe('ESLPopup position: calcPopupPosition(): behavior set to fit-minor', () => {
  const arrow = new Rect(0, 0, 30, 30);
  const popup = new Rect(0, 0, 300, 200);
  const trigger = new Rect(500, 500, 20, 20);
  const container = new Rect(0, 0, 1000, 1000);
  const intersectionRatio = {top: 0, left: 0, right: 0, bottom: 0};
  const cfgRef = {
    behavior: 'fit-minor',
    position: 'top',
    marginArrow: 20,
    offsetArrowRatio: 0.5,
    intersectionRatio,
    arrow,
    element: popup,
    inner: trigger.grow(10),
    outer: container,
    trigger
  } as PopupPositionConfig;

  const expectedRef = {
    arrow: {x: 135, y: 85},
    placedAt: 'top',
    popup
  };

  describe('should adjust the position by moving to:', () => {
    test('left when there is a lack of space on the right side in the top position', () => {
      const cfg = {...cfgRef, position: 'top', outer: container.shift(-440, 0)} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.arrow = {x: 235, y: 85};
      expected.popup = popup.shift(260, 290);
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });

    test('right when there is a lack of space on the left side in the top position', () => {
      const cfg = {...cfgRef, position: 'top', outer: container.shift(440, 0)} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.arrow = {x: 55, y: 85};
      expected.popup = popup.shift(440, 290);
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });

    test('left when there is a lack of space on the right side in the bottom position', () => {
      const cfg = {...cfgRef, position: 'bottom', outer: container.shift(-440, 0)} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.arrow = {x: 235, y: 85};
      expected.popup = popup.shift(260, 530);
      expected.placedAt = 'bottom';
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });

    test('right when there is a lack of space on the left side in the bottom position', () => {
      const cfg = {...cfgRef, position: 'bottom', outer: container.shift(440, 0)} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.arrow = {x: 55, y: 85};
      expected.popup = popup.shift(440, 530);
      expected.placedAt = 'bottom';
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });
  });

  describe('should not adjust the position in case:', () => {
    test('when the popup size is greater than the outer limiter size', () => {
      const container = trigger.grow(50);
      const cfg = {...cfgRef, position: 'top', outer: container} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.popup = popup.shift(360, 290);
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });

    describe('when the popup has a position on the vertical axe and', () => {
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.popup = popup.shift(360, 290);
      test('when the trigger is outside of the outer limiting element by the own left edge', () => {
        const cfg = {...cfgRef, position: 'top', outer: container.shift(-510, 0)} as PopupPositionConfig;
        expect(calcPopupPosition(cfg)).toEqual(expected);
      });

      test('when the trigger is outside of the outer limiting element by the own right edge', () => {
        const cfg = {...cfgRef, position: 'top', outer: container.shift(510, 0)} as PopupPositionConfig;
        expect(calcPopupPosition(cfg)).toEqual(expected);
      });
    });

    describe('when the popup has a position on the horizontal axe and', () => {
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.popup = popup.shift(530, 410);
      expected.placedAt = 'right';
      test('when the trigger is outside of the outer limiting element by the own top edge', () => {
        const cfg = {...cfgRef, position: 'right', outer: container.shift(0, -510)} as PopupPositionConfig;
        expect(calcPopupPosition(cfg)).toEqual(expected);
      });

      test('when the trigger is outside of the outer limiting element by the own right edge', () => {
        const cfg = {...cfgRef, position: 'right', outer: container.shift(0, 510)} as PopupPositionConfig;
        expect(calcPopupPosition(cfg)).toEqual(expected);
      });
    });

    describe('when there is a lack of space for position adjustment on the horizontal axe:', () => {
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.popup = popup.shift(360, 530);
      expected.placedAt = 'bottom';

      test('when it is required to move to the left', () => {
        const cfg = {...cfgRef, position: 'bottom', outer: container.shift(-460, 0)} as PopupPositionConfig;
        expect(calcPopupPosition(cfg)).toEqual(expected);
      });

      test('when it is required to move to the right', () => {
        const cfg = {...cfgRef, position: 'bottom', outer: container.shift(480, 0)} as PopupPositionConfig;
        expect(calcPopupPosition(cfg)).toEqual(expected);
      });
    });

    describe('when there is a lack of space for position adjustment on the vertical axe:', () => {
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.popup = popup.shift(530, 410);
      expected.placedAt = 'right';

      test('when it is required to move to the top', () => {
        const cfg = {...cfgRef, position: 'right', outer: container.shift(0, -460)} as PopupPositionConfig;
        expect(calcPopupPosition(cfg)).toEqual(expected);
      });

      test('when it is required to move to the bottom', () => {
        const cfg = {...cfgRef, position: 'right', outer: container.shift(0, 480)} as PopupPositionConfig;
        expect(calcPopupPosition(cfg)).toEqual(expected);
      });
    });
  });
});

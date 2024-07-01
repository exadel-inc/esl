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
    behavior: 'fit',
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

  describe('should flip to the opposite position:', () => {
    test('when there is a lack of space at the top', () => {
      const cfg = {...cfgRef, position: 'top', outer: container.shift(0, 400)} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.popup = popup.shift(360, 530);
      expected.placedAt = 'bottom';
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });

    test('when there is a lack of space at the left', () => {
      const cfg = {...cfgRef, position: 'left', outer: container.shift(400, 0)} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.popup = popup.shift(530, 410);
      expected.placedAt = 'right';
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });

    test('when there is a lack of space at the bottom', () => {
      const cfg = {...cfgRef, position: 'bottom', outer: container.shift(0, -400)} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.popup = popup.shift(360, 290);
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });

    test('when there is a lack of space at the right', () => {
      const cfg = {...cfgRef, position: 'right', outer: container.shift(-400, 0)} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.popup = popup.shift(190, 410);
      expected.placedAt = 'left';
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });

    test('when the activator is crossing the top edge of the container', () => {
      const cfg = {...cfgRef, position: 'top', intersectionRatio: {top: 0.5, left: 0, right: 0, bottom: 0}} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.popup = popup.shift(360, 530);
      expected.placedAt = 'bottom';
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });

    test('when the activator is crossing the left edge of the container', () => {
      const cfg = {...cfgRef, position: 'left', intersectionRatio: {top: 0, left: 0.5, right: 0, bottom: 0}} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.popup = popup.shift(530, 410);
      expected.placedAt = 'right';
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });

    test('when the activator is crossing the bottom edge of the container', () => {
      const cfg = {...cfgRef, position: 'bottom', intersectionRatio: {top: 0, left: 0, right: 0, bottom: 0.5}} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.popup = popup.shift(360, 290);
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });

    test('when the activator is crossing the right edge of the container', () => {
      const cfg = {...cfgRef, position: 'right', intersectionRatio: {top: 0, left: 0, right: 0.5, bottom: 0}} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.popup = popup.shift(190, 410);
      expected.placedAt = 'left';
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });
  });

  describe('should not adjust when there is enough space for the popup:', () => {
    test('on the top position', () => {
      const cfg = {...cfgRef, position: 'top'} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.arrow = {x: 135, y: 85};
      expected.popup = popup.shift(360, 290);
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });

    test('on the bottom position', () => {
      const cfg = {...cfgRef, position: 'bottom'} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.popup = popup.shift(360, 530);
      expected.placedAt = 'bottom';
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });

    test('on the left position', () => {
      const cfg = {...cfgRef, position: 'left'} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.popup = popup.shift(190, 410);
      expected.placedAt = 'left';
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });

    test('on the right position', () => {
      const cfg = {...cfgRef, position: 'right'} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.popup = popup.shift(530, 410);
      expected.placedAt = 'right';
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });
  });

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

  describe('should adjust when the popup is outing both sides of the container', () => {
    test('when the popup has a position on the vertical axis and LTR text direction', () => {
      const cfg = {...cfgRef, position: 'top', element: popup.resize(1000, 0)} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.arrow = {x: 495, y: 85};
      expected.popup = popup.shift(0, 290).resize(1000, 0);
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });
    test('when the popup has a position on the vertical axis and RTL text direction', () => {
      const cfg = {...cfgRef, position: 'top', element: popup.resize(1000, 0), isRTL: true} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.arrow = {x: 795, y: 85};
      expected.popup = popup.shift(-300, 290).resize(1000, 0);
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });
    test('when the popup has a position on the horizontal axis', () => {
      const cfg = {...cfgRef, position: 'right', element: popup.resize(0, 1000)} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.arrow = {x: 135, y: 495};
      expected.popup = popup.shift(530, 0).resize(0, 1000);
      expected.placedAt = 'right';
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });
    test('when the popup has a position on the horizontal axis RTL', () => {
      const cfg = {...cfgRef, position: 'right', element: popup.resize(0, 1000), isRTL: true} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.arrow = {x: 135, y: 695};
      expected.popup = popup.shift(530, -200).resize(0, 1000);
      expected.placedAt = 'right';
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });
  });

  describe('should adjust when popup is outing at one side of the container and has size greater than the container', () => {
    describe('should stick to the initial side of the container in case LTR text direction', () => {
      test('when the popup has a position on the vertical axis and crosses the initial side', () => {
        const cfg = {
          ...cfgRef,
          position: 'top',
          element: popup.resize(1000, 0),
          outer: container.shift(400, 0)
        } as PopupPositionConfig;
        const expected = Object.assign({}, expectedRef) as PopupPositionValue;
        expected.arrow = {x: 95, y: 85};
        expected.popup = popup.shift(400, 290).resize(1000, 0);
        expect(calcPopupPosition(cfg)).toEqual(expected);
      });
      test('when the popup has a position on the vertical axis and crosses the final side', () => {
        const cfg = {
          ...cfgRef,
          position: 'top',
          element: popup.resize(1000, 0),
          outer: container.shift(-400, 0)
        } as PopupPositionConfig;
        const expected = Object.assign({}, expectedRef) as PopupPositionValue;
        expected.arrow = {x: 895, y: 85};
        expected.popup = popup.shift(-400, 290).resize(1000, 0);
        expect(calcPopupPosition(cfg)).toEqual(expected);
      });
      test('when the popup has a position on the horizontal axis and crosses the initial side', () => {
        const cfg = {
          ...cfgRef,
          position: 'right',
          element: popup.resize(0, 1000),
          outer: container.shift(0, 400)
        } as PopupPositionConfig;
        const expected = Object.assign({}, expectedRef) as PopupPositionValue;
        expected.arrow = {x: 135, y: 95};
        expected.popup = popup.shift(530, 400).resize(0, 1000);
        expected.placedAt = 'right';
        expect(calcPopupPosition(cfg)).toEqual(expected);
      });
      test('when the popup has a position on the horizontal axis and crosses the final side', () => {
        const cfg = {
          ...cfgRef,
          position: 'right',
          element: popup.resize(0, 1000),
          outer: container.shift(0, -400)
        } as PopupPositionConfig;
        const expected = Object.assign({}, expectedRef) as PopupPositionValue;
        expected.arrow = {x: 135, y: 895};
        expected.popup = popup.shift(530, -400).resize(0, 1000);
        expected.placedAt = 'right';
        expect(calcPopupPosition(cfg)).toEqual(expected);
      });
    });

    describe('should stick to the final side of the container in case RTL text direction', () => {
      test('when the popup has a position on the vertical axis and crosses the initial side', () => {
        const cfg = {
          ...cfgRef,
          position: 'top',
          isRTL: true,
          element: popup.resize(1000, 0),
          outer: container.shift(400, 0)
        } as PopupPositionConfig;
        const expected = Object.assign({}, expectedRef) as PopupPositionValue;
        expected.arrow = {x: 395, y: 85};
        expected.popup = popup.shift(100, 290).resize(1000, 0);
        expect(calcPopupPosition(cfg)).toEqual(expected);
      });
      test('when the popup has a position on the vertical axis and crosses the final side', () => {
        const cfg = {
          ...cfgRef,
          position: 'top',
          isRTL: true,
          element: popup.resize(1000, 0),
          outer: container.shift(-400, 0)
        } as PopupPositionConfig;
        const expected = Object.assign({}, expectedRef) as PopupPositionValue;
        expected.arrow = {x: 1195, y: 85};
        expected.popup = popup.shift(-700, 290).resize(1000, 0);
        expect(calcPopupPosition(cfg)).toEqual(expected);
      });
      test('when the popup has a position on the horizontal axis and crosses the initial side', () => {
        const cfg = {
          ...cfgRef,
          position: 'right',
          isRTL: true,
          element: popup.resize(0, 1000),
          outer: container.shift(0, 400)
        } as PopupPositionConfig;
        const expected = Object.assign({}, expectedRef) as PopupPositionValue;
        expected.arrow = {x: 135, y: 295};
        expected.popup = popup.shift(530, 200).resize(0, 1000);
        expected.placedAt = 'right';
        expect(calcPopupPosition(cfg)).toEqual(expected);
      });
      test('when the popup has a position on the horizontal axis and crosses the final side', () => {
        const cfg = {
          ...cfgRef,
          position: 'right',
          isRTL: true,
          element: popup.resize(0, 1000),
          outer: container.shift(0, -400)
        } as PopupPositionConfig;
        const expected = Object.assign({}, expectedRef) as PopupPositionValue;
        expected.arrow = {x: 135, y: 1095};
        expected.popup = popup.shift(530, -600).resize(0, 1000);
        expected.placedAt = 'right';
        expect(calcPopupPosition(cfg)).toEqual(expected);
      });
    });
  });
});

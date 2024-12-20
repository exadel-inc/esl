import {calcPopupPosition} from '../core/esl-popup-position';
import {Rect} from '../../esl-utils/dom';

import type {PopupPositionConfig, PopupPositionValue} from '../core/esl-popup-position';

describe('ESLPopup position: calcPopupPosition(): behavior set to fit-major', () => {
  const arrow = new Rect(0, 0, 30, 30);
  const popup = new Rect(0, 0, 200, 200);
  const trigger = new Rect(250, 250, 500, 500);
  const container = new Rect(0, 0, 1000, 1000);
  const cfgRef = {
    behavior: 'fit',
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

  describe('should not adjust when there is enough space for the popup:', () => {
    test('on the top position', () => {
      const cfg = {...cfgRef, position: 'top'} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.popup = popup.shift(400, 275);
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });

    test('on the bottom position', () => {
      const cfg = {...cfgRef, position: 'bottom'} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.popup = popup.shift(400, 525);
      expected.placedAt = 'bottom-inner';
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });

    test('on the left position', () => {
      const cfg = {...cfgRef, position: 'left'} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.popup = popup.shift(275, 400);
      expected.placedAt = 'left-inner';
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });

    test('on the right position', () => {
      const cfg = {...cfgRef, position: 'right'} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.popup = popup.shift(525, 400);
      expected.placedAt = 'right-inner';
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });
  });

  describe('should adjust the position by moving to:', () => {
    test('left when there is a lack of space on the right side in the top position', () => {
      const cfg = {...cfgRef, position: 'top', outer: container.shift(-440, 0)} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.arrow = {x: 125, y: 85};
      expected.popup = popup.shift(360, 275);
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });

    test('right when there is a lack of space on the left side in the top position', () => {
      const cfg = {...cfgRef, position: 'top', outer: container.shift(440, 0)} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.arrow = {x: 45, y: 85};
      expected.popup = popup.shift(440, 275);
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });

    test('left when there is a lack of space on the right side in the bottom position', () => {
      const cfg = {...cfgRef, position: 'bottom', outer: container.shift(-440, 0)} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.arrow = {x: 125, y: 85};
      expected.popup = popup.shift(360, 525);
      expected.placedAt = 'bottom-inner';
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });

    test('right when there is a lack of space on the left side in the bottom position', () => {
      const cfg = {...cfgRef, position: 'bottom', outer: container.shift(440, 0)} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.arrow = {x: 45, y: 85};
      expected.popup = popup.shift(440, 525);
      expected.placedAt = 'bottom-inner';
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });
  });

  describe('should adjust when the popup is outing both sides of the container', () => {
    test('when the popup has a position on the vertical axis and has LTR text direction', () => {
      const cfg = {...cfgRef, position: 'top', element: popup.resize(1000, 0)} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.arrow = {x: 485, y: 85};
      expected.popup = popup.shift(0, 275).resize(1000, 0);
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });
    test('when the popup has a position on the vertical axis and has RTL text direction', () => {
      const cfg = {...cfgRef, position: 'top', element: popup.resize(1000, 0), isRTL: true} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.arrow = {x: 685, y: 85};
      expected.popup = popup.shift(-200, 275).resize(1000, 0);
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });
    test('when the popup has a position on the horizontal axis and has LTR text direction', () => {
      const cfg = {...cfgRef, position: 'right', element: popup.resize(0, 1000)} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.arrow = {x: 85, y: 485};
      expected.popup = popup.shift(525, 0).resize(0, 1000);
      expected.placedAt = 'right-inner';
      expect(calcPopupPosition(cfg)).toEqual(expected);
    });
    test('when the popup has a position on the horizontal axis and has RTL text direction', () => {
      const cfg = {...cfgRef, position: 'right', element: popup.resize(0, 1000), isRTL: true} as PopupPositionConfig;
      const expected = Object.assign({}, expectedRef) as PopupPositionValue;
      expected.arrow = {x: 85, y: 685};
      expected.popup = popup.shift(525, -200).resize(0, 1000);
      expected.placedAt = 'right-inner';
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
        expected.arrow = {x: 85, y: 85};
        expected.popup = popup.shift(400, 275).resize(1000, 0);
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
        expected.arrow = {x: 885, y: 85};
        expected.popup = popup.shift(-400, 275).resize(1000, 0);
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
        expected.arrow = {x: 85, y: 85};
        expected.popup = popup.shift(525, 400).resize(0, 1000);
        expected.placedAt = 'right-inner';
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
        expected.arrow = {x: 85, y: 885};
        expected.popup = popup.shift(525, -400).resize(0, 1000);
        expected.placedAt = 'right-inner';
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
        expected.arrow = {x: 285, y: 85};
        expected.popup = popup.shift(200, 275).resize(1000, 0);
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
        expected.arrow = {x: 1085, y: 85};
        expected.popup = popup.shift(-600, 275).resize(1000, 0);
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
        expected.arrow = {x: 85, y: 285};
        expected.popup = popup.shift(525, 200).resize(0, 1000);
        expected.placedAt = 'right-inner';
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
        expected.arrow = {x: 85, y: 1085};
        expected.popup = popup.shift(525, -600).resize(0, 1000);
        expected.placedAt = 'right-inner';
        expect(calcPopupPosition(cfg)).toEqual(expected);
      });
    });
  });
});

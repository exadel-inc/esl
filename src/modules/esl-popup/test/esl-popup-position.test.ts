import {isMajorAxisHorizontal} from '../core/esl-popup-position';

describe('ESLPopup position: tests', () => {
  describe('isMajorAxisHorizontal() function:', () => {
    test('should return true for left position', () => {
      expect(isMajorAxisHorizontal('left')).toBe(true);
    });

    test('should return true for right position', () => {
      expect(isMajorAxisHorizontal('right')).toBe(true);
    });

    test('should return false for top position', () => {
      expect(isMajorAxisHorizontal('top')).toBe(false);
    });

    test('should return false for bottom position', () => {
      expect(isMajorAxisHorizontal('bottom')).toBe(false);
    });
  });
});

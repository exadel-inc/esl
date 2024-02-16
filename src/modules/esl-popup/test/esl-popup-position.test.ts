import {isOnHorizontalAxis} from '../core/esl-popup-position';

describe('ESLPopup position: tests', () => {
  describe('isMajorAxisHorizontal() function:', () => {
    test('should return true for left position', () => {
      expect(isOnHorizontalAxis('left')).toBe(true);
    });

    test('should return true for right position', () => {
      expect(isOnHorizontalAxis('right')).toBe(true);
    });

    test('should return false for top position', () => {
      expect(isOnHorizontalAxis('top')).toBe(false);
    });

    test('should return false for bottom position', () => {
      expect(isOnHorizontalAxis('bottom')).toBe(false);
    });
  });
});

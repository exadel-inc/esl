import {Rect} from '../rect';

describe('Rect API', () => {
  describe('Rect instance constructor()', () => {
    test('constructor should set passed values to variables', () => {
      const rect = new Rect(1, 2, 3, 4);
      expect(rect).toEqual(expect.objectContaining({x: 1, y: 2, width: 3, height: 4}));
    });

    test('constructor called without parameters should set values to 0', () => {
      expect(new Rect()).toEqual(expect.objectContaining({x: 0, y: 0, width: 0, height: 0}));
    });
  });

  describe('Rect static methods', () => {
    test('Rect.from', () => {
      const rect = new Rect(1, 2, 3, 4);
      expect(Rect.from({})).toEqual(new Rect());
      expect(Rect.from({left: 1, top: 2, width: 3, height: 4})).toEqual(rect);
      expect(Rect.from({x: 1, y: 2, width: 3, height: 4})).toEqual(rect);
    });

    test.each([
      [[0, 0, 100, 100], [10, 10, 10, 10], [10, 10, 10, 10]],
      [[0, 0, 100, 100], [-10, -10, 5, 5], [0, 0, 0, 0]],
      [[0, 0, 100, 100], [-10, -10, 10, 10], [0, 0, 0, 0]],
      [[0, 0, 100, 100], [-5, -5, 10, 10], [0, 0, 5, 5]],
      [[1, 2, 3, 4], [0, 0, 10, 10], [1, 2, 3, 4]]
    ])('Rect.intersect of %s and %p.', (rect1, rect2, expected) => {
      expect(Rect.intersect(new Rect(...rect1), new Rect(...rect2))).toStrictEqual(new Rect(...expected));
    });
  });

  describe('Rect instance methods', () => {
    test('returns top coordinate value of Rect', () => {
      const rect = new Rect(1, 2, 3, 4);
      expect(rect.top).toEqual(rect.y);
    });

    test('returns left coordinate value of Rect', () => {
      const rect = new Rect(1, 2, 3, 4);
      expect(rect.left).toEqual(rect.x);
    });

    test('returns right coordinate value of Rect', () => {
      const rect = new Rect(1, 2, 3, 4);
      expect(rect.right).toEqual(rect.x + rect.width);
    });

    test('returns bottom coordinate value of Rect', () => {
      const rect = new Rect(1, 2, 3, 4);
      expect(rect.bottom).toEqual(rect.y + rect.height);
    });

    test('returns center X coordinate value of the Rect', () => {
      const rect = new Rect(1, 2, 3, 4);
      expect(rect.cx).toEqual(rect.x + 3 / 2);
    });

    test('returns center Y coordinate value of the Rect', () => {
      const rect = new Rect(1, 2, 3, 4);
      expect(rect.cy).toEqual(rect.y + 4 / 2);
    });

    test('returns Rect grown by passed increment', () => {
      const rect = new Rect(1, 2, 3, 4);
      const rect2 = new Rect(1 - 2, 2 - 2, 3 + 4, 4 + 4);
      expect(rect.grow(2)).toEqual(rect2);
    });

    test('returns Rect grown by passed increments by axis-es', () => {
      const rect = new Rect(1, 2, 3, 4);
      const rect2 = new Rect(1 - 2, 2 - 3, 3 + 4, 4 + 6);
      expect(rect.grow(2, 3)).toEqual(rect2);
    });

    test('returns Rect shrunk by passed decrement', () => {
      const rect = new Rect(1, 2, 3, 4);
      const rect2 = new Rect(1 + 1, 2 + 1, 1, 2);
      expect(rect.shrink(1)).toEqual(rect2);
    });

    test('returns Rect shrunk by passed decrement to point', () => {
      const rect = new Rect(1, 2, 3, 4);
      const rect2 = new Rect(1 + 2, 2 + 2, 0, 0);
      expect(rect.shrink(2)).toEqual(rect2);
    });

    test('returns Rect shrunk by passed decrement by axis-es', () => {
      const rect = new Rect(2, 4, 6, 8);
      const rect2 = new Rect(3, 6, 4, 4);
      expect(rect.shrink(1, 2)).toEqual(rect2);
    });

    test('returns Rect shifted by passed values', () => {
      const rect = new Rect(1, 2, 3, 4);
      const rect2 = new Rect(1 + 2, 2 + 3, 3, 4);
      expect(rect.shift(2, 3)).toEqual(rect2);
    });

    test('returns Rect resized by passed values', () => {
      const rect = new Rect(1, 2, 3, 4);
      const rect2 = new Rect(1, 2, 3 + 3, 4 + 2);
      expect(rect.resize(3, 2)).toEqual(rect2);
    });

    test.each([
      [{x: 0, y: 0, width: 0, height: 0}, {x: 0, y: 0, width: 0, height: 0}, true],
      [{x: 0, y: 0, width: 0, height: 0}, {left: 0, top: 0, width: 0, height: 0}, true],
      [{x: 0, y: 0, width: 10, height: 10}, {x: 0, y: 0, width: 10, height: 10}, true],
      [{x: 0, y: 0, width: 0, height: 0}, {x: 1, y: 0, width: 0, height: 0}, false],
      [{x: 0, y: 0, width: 0, height: 0}, {x: 0, y: 1, width: 0, height: 0}, false],
      [{x: 0, y: 0, width: 0, height: 0}, {x: 0, y: 0, width: 1, height: 0}, false],
      [{x: 0, y: 0, width: 0, height: 0}, {x: 0, y: 0, width: 0, height: 1}, false]
    ])('%p isEqual %p returns %s', (rect1, rect2, expected) => {
      expect(Rect.from(rect1).isEqual(Rect.from(rect2))).toBe(expected);
    });

    test.each([
      [[0, 0, 10, 10], 100],
      [[0, 0, 0, 0], 0]
    ])('Rect.instance.area: %s', (coords, expected) => {
      expect(new Rect(...coords).area).toBe(expected);
    });
  });
});

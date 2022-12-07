import {Rect} from '../rect';

describe('Rect instance constructor()', () => {
  test('constructor should set passed values to variables', () => {
    const rect1 = new Rect(1, 2, 3, 4);
    const rect2 = new Rect();
    rect2.x = 1;
    rect2.y = 2;
    rect2.width = 3;
    rect2.height = 4;
    expect(rect2).toEqual(rect1);
  });

  test('constructor called without parameters should set values to 0', () => {
    const rect1 = new Rect();
    const rect2 = new Rect();
    rect2.x = 0;
    rect2.y = 0;
    rect2.width = 0;
    rect2.height = 0;
    expect(rect2).toEqual(rect1);
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
    [[0, 0, 100, 100], [-10, -10, 5, 5], [0, 0, -5, -5]],
    [[0, 0, 100, 100], [-10, -10, 10, 10], [0, 0, 0, 0]],
    [[0, 0, 100, 100], [-5, -5, 10, 10], [0, 0, 5, 5]]
  ])('Rect.intersect of %s and %p.', (rect1, rect2, expected) => {
    expect(Rect.intersect(new Rect(...rect1), new Rect(...rect2))).toStrictEqual(new Rect(...expected));
  });
});

describe('Rect instance methods', () => {
  let rect: Rect;

  beforeEach(() => {
    rect = new Rect(1, 2, 3, 4);
  });

  test('returns top coordinate value of Rect', () => {
    expect(rect.top).toEqual(rect.y);
  });

  test('returns left coordinate value of Rect', () => {
    expect(rect.left).toEqual(rect.x);
  });

  test('returns right coordinate value of Rect', () => {
    expect(rect.right).toEqual(rect.x + rect.width);
  });

  test('returns bottom coordinate value of Rect', () => {
    expect(rect.bottom).toEqual(rect.y + rect.height);
  });

  test('returns center X coordinate value of the Rect', () => {
    expect(rect.cx).toEqual(rect.x + 3  / 2);
  });

  test('returns center Y coordinate value of the Rect', () => {
    expect(rect.cy).toEqual(rect.y + 4 / 2);
  });

  test('returns Rect grown by passed increment', () => {
    const value = 2;
    expect(rect.grow(value)).toEqual(new Rect(1 - value, 2 - value, 3 + 2 * value, 4 +  2 * value));
    expect(rect.grow(value, value + 2)).toEqual(new Rect(value - 5, value - 6, 7 + 2 * value, 12 +  2 * value));
  });

  test('returns Rect shrunk by passed decrement', () => {
    const value = 2;
    expect(rect.shrink(value)).toEqual(new Rect(1 + value, 2 + value, 3 + 2 * (-value), 4 +  2 * (-value)));
    expect(rect.shrink(value + 1, value + 3)).toEqual(new Rect(4 + value, 7 + value, 2 * (-value) - 3, 2 * (-value) - 6));
  });

  test.each([
    [[0, 0, 10, 10], false],
    [[0, 0, -10, 10], true],
    [[0, 0, 10, -10], true],
    [[0, 0, 0, 0], true],
    [[0, 0, -10, -10], true]
  ])('isEmpty: %s', (coords, expected) => {
    expect(new Rect(...coords).isEmpty()).toBe(expected);
  });
});

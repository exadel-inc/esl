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

describe('Rect instance methods', () => {
  let rect1: Rect;

  beforeEach(() => {
    rect1 = new Rect(1, 2, 3, 4);
  });

  test('returns top coordinate value of Rect', () => {
    expect(rect1.top).toEqual(rect1.y);
  });

  test('returns left coordinate value of Rect', () => {
    expect(rect1.left).toEqual(rect1.x);
  });

  test('returns right coordinate value of Rect', () => {
    expect(rect1.right).toEqual(rect1.x + rect1.width);
  });

  test('returns bottom coordinate value of Rect', () => {
    expect(rect1.bottom).toEqual(rect1.y + rect1.height);
  });

  test('returns center X coordinate value of the Rect', () => {
    expect(rect1.cx).toEqual(rect1.x + 3  / 2);
  });

  test('returns center Y coordinate value of the Rect', () => {
    expect(rect1.cy).toEqual(rect1.y + 4 / 2);
  });

  test('returns Rect grown by passed increment', () => {
    const value = 2;
    expect(rect1.grow(value)).toEqual(new Rect(1 - value, 2 - value, 3 + 2 * value, 4 +  2 * value));
  });

  test('returns Rect shrunk by passed decrement', () => {
    const value = 2;
    expect(rect1.shrink(2)).toEqual(new Rect(1 + value, 2 + value, 3 + 2 * (-value), 4 +  2 * (-value)));
  });
});

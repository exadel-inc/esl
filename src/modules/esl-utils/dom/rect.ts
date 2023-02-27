/**
 * A Rect describes the size and position of a rectangle.
 */
export class Rect {
  /** The X coordinate of the Rect's origin (top-left corner of the rectangle). */
  public x = 0;
  /** The Y coordinate of the Rect's origin (top-left corner of the rectangle). */
  public y = 0;
  /** The width of the Rect. */
  public width = 0;
  /** The height of the Rect. */
  public height = 0;

  /**
   * The static method creates a new Rect instance from a rect-like object.
   * @param rect - rect-like object
   */
  public static from(
    rect: {
      x?: number;
      left?: number;
      y?: number;
      top?: number;
      width?: number;
      height?: number;
    } = {}
  ): Rect {
    return new this(rect.x || rect.left, rect.y || rect.top, rect.width, rect.height);
  }

  /**
   * The static method checks the equality of the two Rect instances.
   * @param rect1 - first instance of Rect
   * @param rect2 - second instance of Rect
   */
  public static isEqual(rect1: Rect, rect2: Rect): boolean {
    return (
      rect1.x === rect2.x &&
      rect1.y === rect2.y &&
      rect1.width === rect2.width &&
      rect1.height === rect2.height
    );
  }

  /**
   * The static method returns intersection Rect of two Rect instances
   * @param rect1 - first instance of Rect
   * @param rect2 - second instance of Rect
   */
  public static intersect(rect1: Rect, rect2: Rect): Rect {
    const top = Math.max(rect1.top, rect2.top);
    const left = Math.max(rect1.left, rect2.left);
    const bottom = Math.min(rect1.bottom, rect2.bottom);
    const right = Math.min(rect1.right, rect2.right);
    const width = Math.max(right - left, 0);
    const height = Math.max(bottom - top, 0);
    return Rect.from({top, left, width, height});
  }

  public constructor(x?: number, y?: number, width?: number, height?: number) {
    this.x = x || 0;
    this.y = y || 0;
    this.width = width || 0;
    this.height = height || 0;
  }

  /**
   * Get the top coordinate value of the Rect (has the same value as y).
   */
  public get top(): number {
    return this.y;
  }

  /**
   * Get the left coordinate value of the Rect (has the same value as x).
   */
  public get left(): number {
    return this.x;
  }

  /**
   * Get the right coordinate value of the DOMRect.
   */
  public get right(): number {
    return this.x + this.width;
  }

  /**
   * Get the bottom coordinate value of the Rect.
   */
  public get bottom(): number {
    return this.y + this.height;
  }

  /**
   * Get the center X coordinate value of the Rect.
   */
  public get cx(): number {
    return this.x + this.width / 2;
  }

  /**
   * Get the center Y coordinate value of the Rect.
   */
  public get cy(): number {
    return this.y + this.height / 2;
  }

  /**
   * Method that accepts one argument and grows the Rect by the specified increment in pixels.
   * It increases the size of the Rect by moving each point on the edge of the Rect to a certain distance further away from the center of the Rect.
   * @param increment - distance to grow in pixels for both X and Y-axis
   */
  public grow(increment: number): Rect;
  /**
   * Method that accepts two arguments where each specified increment grows the rect in different axis in pixels.
   * @param incrementX -  distance to grow in pixels for X-axis
   * @param incrementY -  distance to grow in pixels for Y-axis
   */
  public grow(incrementX: number, incrementY: number): Rect;
  public grow(incrementX: number, incrementY: number = incrementX): Rect {
    this.y -= incrementY;
    this.x -= incrementX;
    this.height += 2 * incrementY;
    this.width += 2 * incrementX;
    return this;
  }

  /**
   * Method that accepts one argument and shrinks the Rect by the specified decrement in pixels.
   * It reduces the size of the Rect by moving each point on the edge of the Rect to a certain distance closer to the center of the Rect.
   * @param decrement - distance to shrink in pixels for both X and Y-axis
   */
  public shrink(decrement: number): Rect;
  /**
   * Method that accepts two arguments where each specified decrement shrinks the rect in different axis in pixels.
   * @param decrementX -  distance to shrink in pixels for X-axis
   * @param decrementY -  distance to shrink in pixels for Y-axis
   */
  public shrink(decrementX: number, decrementY: number): Rect;
  public shrink(decrementX: number, decrementY: number = decrementX): Rect {
    return this.grow(-decrementX, -decrementY);
  }

  /** @returns the numeric value of rectangle area */
  public get area(): number {
    return this.height * this.width;
  }
}

/**
 * A Rect describes the size and position of a rectangle.
 * */
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
   * */
  public static from(rect: {x?: number, left?: number, y?: number, top?: number, width?: number, height?: number} = {}): Rect {
    return new this(rect.x || rect.left, rect.y || rect.top, rect.width, rect.height);
  }

  public constructor(x?: number, y?: number, width?: number, height?: number) {
    this.x = x || 0;
    this.y = y || 0;
    this.width = width || 0;
    this.height = height || 0;
  }

  /**
   * Get the top coordinate value of the Rect (has the same value as y).
   * */
  public get top(): number {
    return this.y;
  }

  /**
   * Get the left coordinate value of the Rect (has the same value as x).
   * */
  public get left(): number {
    return this.x;
  }

  /**
   * Get the right coordinate value of the DOMRect.
   * */
  public get right(): number {
    return this.x + this.width;
  }

  /**
   * Get the bottom coordinate value of the Rect.
   * */
  public get bottom(): number {
    return this.y + this.height;
  }

  /**
   * Get the center X coordinate value of the Rect.
   * */
  public get cx(): number {
    return this.x + this.width / 2;
  }

  /**
   * Get the center Y coordinate value of the Rect.
   * */
  public get cy(): number {
    return this.y + this.height / 2;
  }

  /**
   * Grow the Rect by the specified increment in pixels.
   * It increases the size of the Rect by moving each point on the edge of the Rect to a certain distance further away from the center of the Rect.
   * @param increment - distance to grow in pixels
   * */
  public grow(increment: number): Rect {
    this.y -= increment;
    this.x -= increment;
    this.height += 2 * increment;
    this.width += 2 * increment;
    return this;
  }

  /**
   * Shrink the Rect by the specified decrement in pixels.
   * It reduces the size of the Rect by moving each point on the edge of the Rect to a certain distance closer to the center of the Rect.
   * @param decrement - distance to shrink in pixels
   * */
  public shrink(decrement: number): Rect {
    return this.grow(-decrement);
  }
}

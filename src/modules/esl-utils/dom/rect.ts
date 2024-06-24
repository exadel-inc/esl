import {isElement} from './api';

import type {Point} from './point';

/**
 * A Rect describes the size and position of a rectangle.
 */
export class Rect implements Point {
  /** The X coordinate of the Rect's origin (top-left corner of the rectangle). */
  public readonly x;
  /** The Y coordinate of the Rect's origin (top-left corner of the rectangle). */
  public readonly y;
  /** The width of the Rect. */
  public readonly width;
  /** The height of the Rect. */
  public readonly height;

  /**
   * The static method creates a new Rect instance from a DOMRect object of BoundingClientRect.
   * @param el - DOM Element
   */
  public static from(el: Element): Rect;
  /**
   * The static method creates a new Rect instance from a rect-like object.
   * @param rect - rect-like object
   */
  public static from(rect: {x?: number, left?: number, y?: number, top?: number, width?: number, height?: number}): Rect;
  public static from(rect: {x?: number, left?: number, y?: number, top?: number, width?: number, height?: number} | Element): Rect {
    if (isElement(rect)) return Rect.from(rect.getBoundingClientRect());
    return new this(rect.x ?? rect.left, rect.y ?? rect.top, rect.width, rect.height);
  }

  /**
   * The static method checks the equality of the two Rect instances.
   * @param rect1 - first instance of Rect
   * @param rect2 - second instance of Rect
   */
  public static isEqual(rect1: Rect, rect2: Rect): boolean {
    return rect1.isEqual(rect2);
  }

  /**
   * The static method returns intersection Rect of two Rect instances
   * @param rect1 - first instance of Rect
   * @param rect2 - second instance of Rect
   */
  public static intersect(rect1: Rect, rect2: Rect): Rect {
    return rect1.intersect(rect2);
  }

  public constructor(x?: number, y?: number, width?: number, height?: number) {
    this.x = x || 0;
    this.y = y || 0;
    this.width = Math.max(0, width || 0);
    this.height = Math.max(0, height || 0);
  }

  /** @returns the top coordinate value of the Rect (has the same value as y) */
  public get top(): number {
    return this.y;
  }

  /** @returns the left coordinate value of the Rect (has the same value as x) */
  public get left(): number {
    return this.x;
  }

  /** @returns the right coordinate value of the DOMRect */
  public get right(): number {
    return this.x + this.width;
  }

  /** @returns the bottom coordinate value of the Rect */
  public get bottom(): number {
    return this.y + this.height;
  }

  /** @returns the center X coordinate value of the Rect */
  public get cx(): number {
    return this.x + this.width / 2;
  }

  /** @returns the center Y coordinate value of the Rect */
  public get cy(): number {
    return this.y + this.height / 2;
  }

  /** @returns the numeric value of rectangle area */
  public get area(): number {
    return Math.abs(this.height * this.width);
  }

  /**
   * Method that accepts one argument and grows the Rect by the specified increment in pixels.
   * It increases the size of the Rect by moving each point on the edge of the Rect to a certain distance further away from the center of the Rect.
   * @returns new {@link Rect}
   * @param increment - distance to grow in pixels for both X and Y-axis
   */
  public grow(increment: number): Rect;
  /**
   * Method that accepts two arguments where each specified increment grows the rect in different axis in pixels.
   * @returns new {@link Rect}
   * @param incrementX -  distance to grow in pixels for X-axis
   * @param incrementY -  distance to grow in pixels for Y-axis
   */
  public grow(incrementX: number, incrementY: number): Rect;
  public grow(incrementX: number, incrementY: number = incrementX): Rect {
    return new Rect(
      this.x - incrementX,
      this.y - incrementY,
      this.width + 2 * incrementX,
      this.height + 2 * incrementY
    );
  }

  /**
   * Method that accepts one argument and shrinks the Rect by the specified decrement in pixels.
   * It reduces the size of the Rect by moving each point on the edge of the Rect to a certain distance closer to the center of the Rect.
   * @returns new {@link Rect}
   * @param decrement - distance to shrink in pixels for both X and Y-axis
   */
  public shrink(decrement: number): Rect;
  /**
   * Method that accepts two arguments where each specified decrement shrinks the rect in different axis in pixels.
   * @returns new {@link Rect}
   * @param decrementX -  distance to shrink in pixels for X-axis
   * @param decrementY -  distance to shrink in pixels for Y-axis
   */
  public shrink(decrementX: number, decrementY: number): Rect;
  public shrink(decrementX: number, decrementY: number = decrementX): Rect {
    return this.grow(-decrementX, -decrementY);
  }

  /** @returns new {@link Rect} that is shifted by x and y axis */
  public shift(x: number = 0, y: number = 0): Rect {
    return new Rect(this.x + x, this.y + y, this.width, this.height);
  }

  /** @returns new {@link Rect} that is resized by x and y axis */
  public resize(xDelta: number = 0, yDelta: number = 0): Rect {
    return new Rect(this.x, this.y, this.width + xDelta, this.height + yDelta);
  }

  /** @returns new {@link Rect} an intersection of current and passed Rectangle */
  public intersect(rect: Rect): Rect {
    const top = Math.max(this.top, rect.top);
    const left = Math.max(this.left, rect.left);
    const bottom = Math.min(this.bottom, rect.bottom);
    const right = Math.min(this.right, rect.right);
    const width = Math.max(right - left, 0);
    const height = Math.max(bottom - top, 0);
    return new Rect(left, top, width, height);
  }

  /** @returns if the passed rect is equal to current */
  public isEqual(rect: Rect): boolean {
    return this.x === rect.x && this.y === rect.y && this.width === rect.width && this.height === rect.height;
  }
}

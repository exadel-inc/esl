/** Direction enum, can be used in calculation directly */
export enum ESLCarouselDirection {
  NEXT = 1,
  NONE = 0,
  PREV = -1
}

export type ESLCarouselNavIndex = number | `${number}` | `+${number}` | `-${number}` | ESLCarouselDirection;

/**
 * Supported navigation syntax:
 *
 * | Example    | Description          |
 * |:---:|:---|
 * | `1`, `2`   | direct index (short) |
 * | `slide: 1`, `slide: 2` | direct index (short) |
 * | `group: 1`, `group: 2` | direct group |
 * | `+1`, `slide: +1`, `slide: +2` | per slide increment |
 * | `-1`, `slide: -1`, `slide: -2` | per slide decrement |
 * | `group: +1`, `group: +2` | per group increment |
 * | `group: -1`, `group: -2` | per group decrement |
 * | `next`, `slide: next`, `group: next` | semantic word `next` for increment |
 * | `prev`, `slide: prev`, `group: prev` | semantic word `prev` for decrement |
 */
export type ESLCarouselSlideTarget = string | ESLCarouselNavIndex | `slide:${ESLCarouselNavIndex}` | `group:${ESLCarouselNavIndex}`;

/** Object describing static carousel configuration */
export type ESLCarouselStaticState = {
  /** Total slide count */
  size: number;
  /** Visible slide count per view */
  count: number;
  /** Cyclic carousel rendering mode */
  loop: boolean;
  /** Vertical carousel rendering mode */
  vertical: boolean;
};

export type ESLCarouselConfig = ESLCarouselStaticState & {
  /** Renderer type name */
  type: string;
};

/** Object describing carousel current configuration (contains active slide data) */
export type ESLCarouselState = ESLCarouselStaticState & {
  /** First active slide index */
  activeIndex: number;
};

/** Object describing carousel navigation target details */
export type ESLCarouselNavInfo = {
  /** Target index */
  index: number;
  /** Direction to reach the index */
  direction?: ESLCarouselDirection;
};

/** {@link ESLCarousel} action params interface */
export interface ESLCarouselActionParams {
  /** Element requester of the change */
  activator?: any;
  /** Direction to move to. */
  direction?: ESLCarouselDirection;
  /** Duration of a single slide transition in milliseconds. (Set to 0 to disable animation) */
  stepDuration: number;
}

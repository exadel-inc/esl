export type ESLCarouselDirection = 'next' | 'prev';

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
  size: number;
  count: number;
  loop?: boolean;
};

/** Object describing carousel current configuration (contains active slide data) */
export type ESLCarouselState = ESLCarouselStaticState & {
  firstIndex: number;
};

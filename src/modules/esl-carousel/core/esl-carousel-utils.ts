export type CarouselDirection = 'next' | 'prev';
export type CarouselSlideTarget = number | 'next' | 'prev' | `g${number}`;

/** @returns normalized slide index in bounds of [0, count] range */
export function normalizeIndex(index: number, count: number): number {
  // TODO: not all cases covered: -2 * count - 1 will not be processed correctly;
  return (index + count) % count;
}

/** @returns closest direction to move from slide `from` to slide `to` */
export function calcDirection(from: number, to: number, count: number): CarouselDirection {
  const abs = Math.abs(from - to);
  if (to > from) {
    return abs > (count - abs) % count ? 'prev' : 'next';
  } else {
    return abs < (count - abs) % count ? 'prev' : 'next';
  }
}

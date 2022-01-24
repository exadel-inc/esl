import type {ESLCarousel} from './esl-carousel';

export type CarouselDirection = 'next' | 'prev';
export type CarouselSlideTarget = number | string | `+${number}` | `-${number}` | 'next' | 'prev' | `g${number}`;

/** @returns normalized slide index in bounds of [0, count] range */
export function normalizeIndex(index: number, count: number): number {
  // TODO: not all cases covered: -2 * count - 1 will not be processed correctly;
  return (index + 2 * count) % count;
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

/** @returns group index from absolute index */
export function toGroupIndex(index: number, activeCount: number): number {
  return Math.floor(index / activeCount);
}

/** @returns normalized index from target definition and current state */
export function toIndex(target: CarouselSlideTarget, {count, activeCount, firstIndex}: ESLCarousel): number {
  target = String(target);

  // Resolve absolute and relative indexes
  if (!isNaN(+target)) {
    const isRelative = (target[0] === '+' || target[0] === '-');
    return normalizeIndex(+target + (isRelative ? firstIndex : 0), count);
  }

  // Group index handler
  if ('g' === target[0]) {
    const group = +(target.substring(1)) - 1;
    const groupCount = toGroupIndex(count, activeCount);
    const index = group >= groupCount ? count - activeCount : activeCount * group;
    return normalizeIndex(index, count);
  }

  // Next group handler
  if ('next' === target) {
    const index = firstIndex + activeCount;
    // make the last slide active if the circle is over
    return index >= count ? 0 : normalizeIndex(index, count);
  }

  // Prev index handler
  if ('prev' === target) {
    const normalizedIndex = normalizeIndex(firstIndex - activeCount, count);
    // make the first slide active if the circle is over
    return firstIndex !== 0 && normalizedIndex >= firstIndex ? 0 : normalizedIndex;
  }

  return firstIndex;
}

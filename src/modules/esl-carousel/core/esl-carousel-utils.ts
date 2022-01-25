import type {ESLCarousel} from './esl-carousel';

export type CarouselDirection = 'next' | 'prev';
export type CarouselSlideTarget = number | string | `+${number}` | `-${number}` | 'next' | 'prev' | `g${number}`;

/** @returns normalized slide index in bounds of [0, count] range */
export function normalizeIndex(index: number, count: number): number {
  return (count + (index % count)) % count;
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

/** @returns normalized numeric index from string with absolute or relative index */
export function resolveIndex(index: number | string, current: number, count: number): number {
  index = String(index);
  const isRelative = (index[0] === '+' || index[0] === '-');
  return normalizeIndex(+index + (isRelative ? current : 0), count);
}

/** @returns normalized numeric index from group index */
export function resolveGroupIndex(group: number, activeCount: number, count: number): number {
  const groupCount = Math.floor(count / activeCount);
  const index = group > groupCount ? count - activeCount : activeCount * (group - 1);
  return normalizeIndex(index, count);
}

/** @returns next index in group */
export function nextGroup(current: number, activeCount: number, count: number): number {
  const normalizedIndex = normalizeIndex(current + activeCount, count);
  const lastIndex = count - activeCount;
  // make the last slide active if the circle is over
  return normalizedIndex >= lastIndex ? lastIndex : normalizedIndex;
}

/** @returns previous index in group */
export function prevGroup(current: number, activeCount: number, count: number): number {
  const normalizedIndex = normalizeIndex(current - activeCount, count);
  // make the first slide active if the circle is over
  return current !== 0 && normalizedIndex >= current ? 0 : normalizedIndex;
}

/** @returns normalized index from target definition and current state */
export function toIndex(target: CarouselSlideTarget, {count, activeCount, firstIndex}: ESLCarousel): number {
  target = String(target);
  // Resolve absolute and relative indexes
  if (!isNaN(+target)) return resolveIndex(target, firstIndex, count);
  // Group index handler
  if ('g' === target[0]) return resolveGroupIndex(+target.substring(1), activeCount, count);
  // Next group handler
  if ('next' === target) return nextGroup(firstIndex, activeCount, count);
  // Prev index handler
  if ('prev' === target) return prevGroup(firstIndex, activeCount, count);
  // Fallback
  return firstIndex;
}

/** @returns preferable direction for target or nextIndex */
export function toDirection(target: CarouselSlideTarget, nextIndex: number, {count, firstIndex}: ESLCarousel): CarouselDirection {
  target = String(target);
  if ('+' === target[0]) return 'next';
  if ('-' === target[0]) return 'prev';
  if ('next' === target || 'prev' === target) return target;
  return calcDirection(firstIndex, nextIndex, count);
}

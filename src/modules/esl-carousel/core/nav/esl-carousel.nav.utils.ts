import type {ESLCarouselDirection, ESLCarouselNavIndex, ESLCarouselSlideTarget, ESLCarouselState} from './esl-carousel.nav.types';

/** @returns normalized slide index in bounds of [0, count] range */
export function normalizeIndex(index: number, size: number): number {
  return (size + (index % size)) % size;
}

/** @returns closest direction to move from slide `from` to slide `to` */
export function calcDirection(from: number, to: number, size: number): ESLCarouselDirection {
  const abs = Math.abs(from - to) % size;
  if (to > from) {
    return abs > size - abs ? 'prev' : 'next';
  } else {
    return abs < size - abs ? 'prev' : 'next';
  }
}

/** @returns normalized numeric index from group index */
export function groupToIndex(group: number, count: number, size: number): number {
  const groupCount = Math.ceil(size / count);
  const value = normalizeIndex(group, groupCount);
  const index = value + 1 === groupCount ? size - count : count * value;
  return normalizeIndex(index, size);
}

/** @returns numeric group index from slide index */
export function indexToGroup(index: number, count: number, size: number): number {
  const value = normalizeIndex(index, size);
  if (value > size - count) return Math.ceil(size / count) - 1;
  return Math.ceil(value / count);
}

/** Parse index value defining its value and type (absolute|relative)*/
export function parseIndex(index: string | ESLCarouselNavIndex): {value: number, isRelative: boolean} {
  if (typeof index === 'number') return {value: index, isRelative: false};
  index = index.trim();
  if (index === 'next') return {value: 1, isRelative: true};
  if (index === 'prev') return {value: -1, isRelative: true};
  return {value: +index, isRelative: (index[0] === '+' || index[0] === '-')};
}

/** @returns normalized numeric index from string with absolute or relative index */
export function resolveIndex(index: string | ESLCarouselNavIndex, {firstIndex, size}: ESLCarouselState): number {
  const {value, isRelative} = parseIndex(index);
  return normalizeIndex(value + (isRelative ? firstIndex : 0), size);
}

/** @returns normalized numeric index from string with absolute or relative group index */
export function resolveGroupIndex(index: string | ESLCarouselNavIndex, {firstIndex, count, size}: ESLCarouselState): number {
  const {value, isRelative} = parseIndex(index);
  if (!isRelative) return groupToIndex(value, count, size);
  return Math.min(size - count, normalizeIndex(firstIndex + value * count, size));
}

/** @returns normalized index from target definition and current state */
export function toIndex(target: ESLCarouselSlideTarget, cfg: ESLCarouselState): number {
  if (typeof target === 'number') return normalizeIndex(target, cfg.size);
  // Sanitize value
  target = String(target).replace(/\s/, '');
  // Normalize shortcuts
  target = target.includes(':') ? target : `slide:${target}`;
  // Split type and index part
  const [type, index] = String(target).split(':');
  if (type === 'group') return resolveGroupIndex(index, cfg);
  if (type === 'slide') return resolveIndex(index, cfg);
  // Fallback
  return cfg.firstIndex;
}

/** @returns preferable direction for target or nextIndex */
export function toDirection(target: ESLCarouselSlideTarget, nextIndex: number, {size, firstIndex, loop}: ESLCarouselState): ESLCarouselDirection {
  target = String(target);

  if (!loop && nextIndex >= firstIndex) return 'next';
  if (!loop && nextIndex <= firstIndex) return 'prev';

  if ('+' === target[0]) return 'next';
  if ('-' === target[0]) return 'prev';
  if ('next' === target || 'prev' === target) return target;
  return calcDirection(firstIndex, nextIndex, size);
}

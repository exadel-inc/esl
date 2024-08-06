import type {
  ESLCarouselDirection,
  ESLCarouselNavIndex,
  ESLCarouselNavInfo,
  ESLCarouselSlideTarget,
  ESLCarouselState,
  ESLCarouselStaticState
} from '../esl-carousel.types';

/** @returns normalized slide index in bounds of [0, count] range */
export function normalize(index: number, size: number): number {
  return (size + (index % size)) % size;
}

/** @returns normalize first slide index according to the carousel mode */
export function normalizeIndex(index: number, {size, count, loop}: ESLCarouselStaticState): number {
  return loop ? normalize(index, size) : Math.max(0, Math.min(size - count, index));
}

/** @returns normalized sequence of slides starting from the current index */
export function sequence(current: number, count: number, size: number): number[] {
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(normalize(current + i, size));
  }
  return result;
}

/** Gets count of slides between active and passed considering given direction. */
export function getDistance(from: number, direction: ESLCarouselDirection, {activeIndex, size}: ESLCarouselState): number {
  if (direction === 'prev') return normalize(activeIndex - from, size);
  if (direction === 'next') return normalize(from - activeIndex, size);
  return 0;
}

/** @returns closest direction to move from slide `from` to slide `to` */
function calcDirection(from: number, to: number, size: number): ESLCarouselDirection {
  const abs = Math.abs(from - to) % size;
  if (to > from) {
    return abs > size - abs ? 'prev' : 'next';
  } else {
    return abs > size - abs ? 'next' : 'prev';
  }
}

/** @returns normalized numeric index from group index */
export function groupToIndex(group: number, count: number, size: number): number {
  const groupCount = Math.ceil(size / count);
  const value = normalize(group, groupCount);
  const index = value + 1 === groupCount ? size - count : count * value;
  return normalize(index, size);
}

/** @returns numeric group index from slide index */
export function indexToGroup(index: number, count: number, size: number): number {
  const value = normalize(index, size);
  const groupCount = Math.ceil(size / count);
  const firstGroupIndex = value + count >= size ? groupCount - 1 : Math.floor(value / count);
  const secondGroupIndex = (firstGroupIndex + 1) % groupCount;
  // candidate groups have common slides
  const isGroupIntersected = size - count + 1 < value + count && value + count <= size;
  const commonCount = isGroupIntersected ? groupCount * count - size : 0;
  const firstGroupCount = Math.min(size, (firstGroupIndex + 1) * count) - value;
  const secondGroupCount = count - firstGroupCount + commonCount;
  return (firstGroupCount >= secondGroupCount) ? firstGroupIndex : secondGroupIndex;
}

/** @returns closest direction to move to the passed index */
export function indexToDirection(index: number, {activeIndex, size, loop}: ESLCarouselState): ESLCarouselDirection | undefined {
  if (loop) return calcDirection(activeIndex, index, size);
  if (activeIndex < index) return 'next';
  if (activeIndex > index) return 'prev';
}

/** Splits target string into type and index parts */
function splitTarget(target: string): {index: string, type: string} {
  // Sanitize value
  target = String(target).replace(/\s/, '');
  // Split type and index part
  const [type, index] = String(target).split(':');
  // 'slide' type is used if no prefix provided
  return index ? {type, index} : {type: 'slide', index: target};
}

/** Parses index value defining its value and type (absolute|relative) */
function parseIndex(index: string | ESLCarouselNavIndex): {value: number, isRelative: boolean, direction?: ESLCarouselDirection} {
  if (typeof index === 'number') return {value: index, isRelative: false};
  index = index.trim();
  if (index === 'next') return {value: 1, isRelative: true, direction: 'next'};
  if (index === 'prev') return {value: -1, isRelative: true, direction: 'prev'};
  if (index[0] === '+') return {value: +index, isRelative: true, direction: 'next'};
  if (index[0] === '-') return {value: +index, isRelative: true, direction: 'prev'};
  return {value: +index, isRelative: false};
}

/** @returns normalized numeric index from string with absolute or relative index */
function resolveSlideIndex(indexStr: string | ESLCarouselNavIndex, cfg: ESLCarouselState): ESLCarouselNavInfo {
  const {value, isRelative, direction} = parseIndex(indexStr);
  const target = value + (isRelative ? cfg.activeIndex : 0);
  const index = normalizeIndex(target, cfg);
  return {index, direction: direction || indexToDirection(index, cfg)};
}

/** @returns normalized numeric index from string with absolute or relative group index */
function resolveGroupIndex(indexStr: string | ESLCarouselNavIndex, cfg: ESLCarouselState): ESLCarouselNavInfo {
  const {value, isRelative, direction} = parseIndex(indexStr);
  if (!isRelative) {
    const index = groupToIndex(value, cfg.count, cfg.size);
    return {index, direction: indexToDirection(index, cfg)};
  }
  // TODO: extend navigation boundaries
  if (value === -1 && cfg.activeIndex < cfg.count && cfg.activeIndex > 0) {
    return {index: 0, direction: direction || 'prev'};
  }
  if (value === 1 && normalize(cfg.activeIndex + cfg.count, cfg.size) > cfg.size - cfg.count) {
    return {index: cfg.size - cfg.count, direction: direction || 'next'};
  }
  const index = normalize(cfg.activeIndex + value * cfg.count, cfg.size);
  return {index, direction: direction || indexToDirection(index, cfg)};
}

/** @returns normalized index from target definition and current state */
export function toIndex(target: ESLCarouselSlideTarget, cfg: ESLCarouselState): ESLCarouselNavInfo {
  if (typeof target === 'number') {
    const index = normalizeIndex(target, cfg);
    return {index, direction: indexToDirection(index, cfg)};
  }
  const {type, index} = splitTarget(target);
  if (type === 'group') return resolveGroupIndex(index, cfg);
  if (type === 'slide') return resolveSlideIndex(index, cfg);
  return {index: cfg.activeIndex};
}

/**
 * @returns whether the carousel can navigate to the target passed as {@link ESLCarouselSlideTarget}
 * E.g.: carousel can't navigate to invalid target or to the next slide if it's the last slide and loop is disabled
 */
export function canNavigate(target: ESLCarouselSlideTarget, cfg: ESLCarouselState): boolean {
  if (cfg.size <= cfg.count) return false;
  const {direction, index} = toIndex(target, cfg);
  if (!cfg.loop && index > cfg.activeIndex && direction === 'prev') return false;
  if (!cfg.loop && index < cfg.activeIndex && direction === 'next') return false;
  return !!direction && index !== cfg.activeIndex;
}

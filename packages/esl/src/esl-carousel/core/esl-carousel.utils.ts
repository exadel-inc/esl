import {ESLCarouselDirection} from './esl-carousel.types';
import type {
  ESLCarouselNavIndex,
  ESLCarouselNavInfo,
  ESLCarouselSlideTarget,
  ESLCarouselState,
  ESLCarouselStaticState
} from './esl-carousel.types';

/** @returns sign of the value */
export const sign = (value: number): -1 | 1 | 0 => value > 0 ? 1 : value < 0 ? -1 : 0;

export const bounds =
  (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));

/** @returns normalized slide index in bounds of [0, count] range */
export function normalize(index: number, size: number): number {
  return (size + (index % size)) % size;
}

/** @returns normalize first slide index according to the carousel mode */
export function normalizeIndex(index: number, {size, count, loop}: ESLCarouselStaticState): number {
  return loop && count < size ? normalize(index, size) : bounds(index, 0, size - count);
}

/** @returns normalized sequence of slides starting from the current index */
export function sequence(current: number, count: number, size: number): number[] {
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(normalize(current + i, size));
  }
  return result;
}

/** @returns closest direction to move from the slide `from` to slide `to` */
function calcDirection(from: number, to: number, size: number): ESLCarouselDirection {
  const abs = Math.abs(from - to) % size;
  return sign(to - from) * sign(size / 2 - abs);
}

/** @returns numeric index from group index */
export function groupToIndex(group: number, count: number, size: number): number {
  const groupCount = Math.ceil(size / count);
  if (group < 0 || group >= groupCount) return NaN;
  const index = group + 1 === groupCount ? size - count : count * group;
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
  return loop ? calcDirection(activeIndex, index, size) : sign(index - activeIndex);
}

/** Splits target string into type and index parts */
function splitTarget(target: number | string): {index: string, type?: string} {
  // Sanitize value
  target = String(target).replace(/\s+/g, '');
  // Short form of next/prev considered as slide target
  if (target === 'next' || target === 'prev') return {index: target, type: 'slide'};
  // Split type and index part
  const [type, index] = String(target).split(':');
  return index ? {type, index} : {index: target};
}

/** Parses index value defining its value and type (absolute|relative) */
function parseIndex(index: string | ESLCarouselNavIndex): {value: number, isRelative: boolean, direction?: ESLCarouselDirection} {
  if (typeof index === 'number') return {value: index, isRelative: false};
  index = index.trim();
  if (index === 'next') return {value: 1, isRelative: true, direction: ESLCarouselDirection.NEXT};
  if (index === 'prev') return {value: -1, isRelative: true, direction: ESLCarouselDirection.PREV};
  if (index[0] === '+') return {value: +index, isRelative: true, direction: ESLCarouselDirection.NEXT};
  if (index[0] === '-') return {value: +index, isRelative: true, direction: ESLCarouselDirection.PREV};
  return {value: +index, isRelative: false};
}

/** @returns normalized numeric index from string with absolute or relative index */
function resolveSlideIndex(indexStr: string | ESLCarouselNavIndex, cfg: ESLCarouselState): ESLCarouselNavInfo {
  const {value, isRelative, direction} = parseIndex(indexStr);
  const target = value + (isRelative ? cfg.activeIndex : -1);
  if (!isRelative && (target < 0 || target >= cfg.size)) return {index: NaN};
  const index = isRelative ? normalizeIndex(target, cfg) : bounds(target, 0, cfg.size - cfg.count);
  return {index, direction: direction || indexToDirection(index, cfg)};
}

/** @returns normalized numeric index from string with absolute or relative group index */
function resolveGroupIndex(indexStr: string | ESLCarouselNavIndex, cfg: ESLCarouselState): ESLCarouselNavInfo {
  const {value, isRelative, direction} = parseIndex(indexStr);
  if (!isRelative) {
    const index = groupToIndex(value - 1, cfg.count, cfg.size);
    return {index, direction: indexToDirection(index, cfg)};
  }
  // TODO: extend navigation boundaries
  if (value === -1 && cfg.activeIndex < cfg.count && cfg.activeIndex > 0) {
    return {index: 0, direction: direction || ESLCarouselDirection.PREV};
  }
  if (value === 1 && normalize(cfg.activeIndex + cfg.count, cfg.size) > cfg.size - cfg.count) {
    return {index: cfg.size - cfg.count, direction: direction || ESLCarouselDirection.NEXT};
  }
  const index = normalizeIndex(cfg.activeIndex + value * cfg.count, cfg);
  return {index, direction: direction || indexToDirection(index, cfg)};
}

/** @returns normalized numeric index from simple index definition */
function resolveIndex(target: number | string, cfg: ESLCarouselState): ESLCarouselNavInfo {
  const i = normalize(+target, cfg.size);
  const index = cfg.loop ? i : bounds(Math.max(i, +target), 0, cfg.size - cfg.count);
  const direction = indexToDirection(index, cfg);
  return {index, direction};
}

/** @returns normalized first index from target definition and current state */
export function toIndex(target: ESLCarouselSlideTarget, cfg: ESLCarouselState): ESLCarouselNavInfo {
  const {type, index} = splitTarget(target);
  if (type === 'group') return resolveGroupIndex(index, cfg);
  if (type === 'slide') return resolveSlideIndex(index, cfg);
  return resolveIndex(index, cfg);
}

/**
 * @returns whether the carousel can navigate to the target passed as {@link ESLCarouselSlideTarget}
 * E.g.: carousel can't navigate to invalid target or to the next slide if it's the last slide and loop is disabled
 */
export function canNavigate(target: ESLCarouselSlideTarget, cfg: ESLCarouselState): boolean {
  if (cfg.size <= cfg.count) return false;
  const {direction, index} = toIndex(target, cfg);
  if (isNaN(index)) return false;
  if (!cfg.loop && direction && index < direction * cfg.activeIndex) return false;
  return index !== cfg.activeIndex || Math.abs(cfg.offset) > 0;
}

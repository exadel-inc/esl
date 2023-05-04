import {
  normalizeIndex,
  calcDirection,
  groupToIndex,
  indexToGroup,
  resolveIndex,
  toIndex
} from '../../core/nav/esl-carousel.nav.utils';

import type {
  ESLCarouselDirection,
  ESLCarouselSlideTarget,
  ESLCarouselState
} from '../../core/nav/esl-carousel.nav.types';

describe('ESLCarousel: Nav Utils', () => {
  describe('normalizeIndex', () => {
    test.each([
      // [index, size, result]
      [0, 5, 0],
      [4, 5, 4],
      [10, 10, 0],
      [11, 10, 1],
      [-1, 10, 9],
      [21, 10, 1],
      [-11, 10, 9],
      [-21, 10, 9]
    ])(
      '(index = %d, size = %d) => %d',
      (i: number, size: number, result: number) => expect(normalizeIndex(i, size)).toBe(result)
    );
  });

  describe('calcDirection', () => {
    test.each([
      // [from index, to index, size, result]
      [0, 1, 5, 'next'],
      [1, 3, 5, 'next'],
      [3, 2, 5, 'prev'],
      [1, 4, 5, 'prev'],
      [1, 7, 5, 'next'],
      [7, 1, 5, 'prev']
    ])(
      '(from = %d, to = %d, size = %d) => %s',
      (from: number, to: number, count: number, result: ESLCarouselDirection) => expect(calcDirection(from, to, count)).toBe(result)
    );
  });

  describe('groupToIndex', () => {
    test.each([
      // [group index, active count, size, result]
      [0, {count: 4, size: 5}, 0],
      [1, {count: 4, size: 5}, 1],
      [0, {count: 3, size: 8}, 0],
      [1, {count: 3, size: 8}, 3],
      [2, {count: 3, size: 8}, 5],
      [2, {count: 3, size: 9}, 6],
      [5, {count: 1, size: 5}, 0]
    ])(
      '(group = %d, %o) => %d',
      (group: number, {count, size}: {count: number, size: number}, result: number) => expect(groupToIndex(group, count, size)).toBe(result)
    );
  });

  describe('indexToGroup', () => {
    test.each([
      // [index, active count, size, result]
      [0, {count: 4, size: 5}, 0],
      [1, {count: 4, size: 5}, 1],
      [2, {count: 4, size: 5}, 1],
      [3, {count: 4, size: 5}, 1],

      [0, {count: 3, size: 8}, 0],
      [1, {count: 3, size: 8}, 1],
      [2, {count: 3, size: 8}, 1],
      [3, {count: 3, size: 8}, 1],
      [4, {count: 3, size: 8}, 2],
      [5, {count: 3, size: 8}, 2],
      [6, {count: 3, size: 8}, 2],
      [7, {count: 3, size: 8}, 2],

      [3, {count: 3, size: 9}, 1],
      [6, {count: 3, size: 9}, 2]
    ])(
      '(index = %d, %o) => %d',
      (index: number, {count, size}: {count: number, size: number}, result: number) => expect(indexToGroup(index, count, size)).toBe(result)
    );
  });

  describe('resolveIndex', () => {
    describe('absolute index', () => {
      test.each([
        [0, {count: 2, size: 5, firstIndex: 0}, 0],
        [1, {count: 2, size: 5, firstIndex: 0}, 1],
        [5, {count: 2, size: 5, firstIndex: 0}, 0],
        [6, {count: 2, size: 5, firstIndex: 0}, 1],
        ['2', {count: 2, size: 5, firstIndex: 0}, 2]
      ])(
        '(index = %d, %o) => %d',
        (index: string, cfg: ESLCarouselState, result: number) => expect(resolveIndex(index, cfg)).toBe(result)
      );
    });
    describe('relative index', () => {
      test.each([
        ['-1', {count: 2, size: 5, firstIndex: 2}, 1],
        ['+1', {count: 2, size: 5, firstIndex: 2}, 3],
        ['-3', {count: 2, size: 5, firstIndex: 2}, 4],
        ['+3', {count: 2, size: 5, firstIndex: 2}, 0]
      ])(
        '(relative index = %d, current = %d, count = %d) => %d',
        (index: string, cfg: ESLCarouselState, result: number) =>
          expect(resolveIndex(index, cfg)).toBe(result)
      );
    });
  });

  describe('toIndex', () => {
    describe('numeric input', () => {
      test.each([
        [0, {size: 5, count: 1, firstIndex: 2}, 0],
        [1, {size: 5, count: 2, firstIndex: 2}, 1],
        [5, {size: 5, count: 1, firstIndex: 0}, 0],
        [6, {size: 5, count: 3, firstIndex: 1}, 1]
      ])(
        '(target = %s, cfg = %p) = %d',
        (target: ESLCarouselSlideTarget, cfg: ESLCarouselState, result: number) => expect(toIndex(target, cfg)).toBe(result)
      );
    });

    describe('numeric string input', () => {
      test.each([
        ['0', {size: 5, count: 1, firstIndex: 2}, 0],
        ['1', {size: 5, count: 2, firstIndex: 2}, 1],
        [' 5', {size: 5, count: 1, firstIndex: 0}, 0],
        [' 6 ', {size: 5, count: 3, firstIndex: 1}, 1]
      ])(
        '(target = %s, cfg = %p) = %d',
        (target: ESLCarouselSlideTarget, cfg: ESLCarouselState, result: number) => expect(toIndex(target, cfg)).toBe(result)
      );
    });

    describe('relative slide short target', () => {
      test.each([
        ['prev', {size: 5, count: 1, firstIndex: 2}, 1],
        ['next', {size: 5, count: 2, firstIndex: 2}, 3]
      ])(
        '(target = %s, cfg = %p) = %d',
        (target: ESLCarouselSlideTarget, cfg: ESLCarouselState, result: number) => expect(toIndex(target, cfg)).toBe(result)
      );
    });

    describe('relative slide target', () => {
      test.each([
        ['-1', {size: 5, count: 1, firstIndex: 2}, 1],
        ['+1', {size: 5, count: 2, firstIndex: 2}, 3],
        ['-3', {size: 5, count: 1, firstIndex: 2}, 4],
        ['+3', {size: 5, count: 3, firstIndex: 2}, 0]
      ])(
        '(target = %s, cfg = %p) = %d',
        (target: ESLCarouselSlideTarget, cfg: ESLCarouselState, result: number) => expect(toIndex(target, cfg)).toBe(result)
      );
    });

    describe('slide target absolute full', () => {
      test.each([
        ['slide:0', {size: 5, count: 1, firstIndex: 2}, 0],
        ['slide:1', {size: 5, count: 2, firstIndex: 2}, 1]
      ])(
        '(target = %s, cfg = %p) = %d',
        (target: ESLCarouselSlideTarget, cfg: ESLCarouselState, result: number) => expect(toIndex(target, cfg)).toBe(result)
      );
    });

    describe('slide target relative full', () => {
      test.each([
        ['slide:-1', {size: 5, count: 1, firstIndex: 2}, 1],
        ['slide:+1', {size: 5, count: 2, firstIndex: 2}, 3],
        ['slide:-3', {size: 5, count: 1, firstIndex: 2}, 4],
        ['slide:+3', {size: 5, count: 3, firstIndex: 2}, 0]
      ])(
        '(target = %s, cfg = %p) = %d',
        (target: ESLCarouselSlideTarget, cfg: ESLCarouselState, result: number) => expect(toIndex(target, cfg)).toBe(result)
      );
    });

    describe('group direct target', () => {
      test.each([
        ['group: 0', {size: 8, count: 3, firstIndex: 0}, 0],
        ['group: 1', {size: 8, count: 3, firstIndex: 1}, 3],
        ['group: 2', {size: 8, count: 3, firstIndex: 2}, 5]
      ])(
        '(target = %s, cfg = %p) = %d',
        (target: ESLCarouselSlideTarget, cfg: ESLCarouselState, result: number) => expect(toIndex(target, cfg)).toBe(result)
      );
    });

    describe('group relative target', () => {
      test.each([
        ['group: +1', {size: 5, count: 1, firstIndex: 2}, 3],
        ['group: +1', {size: 5, count: 2, firstIndex: 2}, 3],
        ['group: -1', {size: 5, count: 1, firstIndex: 2}, 1],
        ['group: -1', {size: 5, count: 2, firstIndex: 2}, 0]
      ])(
        '(target = %s, cfg = %p) = %d',
        (target: ESLCarouselSlideTarget, cfg: ESLCarouselState, result: number) => expect(toIndex(target, cfg)).toBe(result)
      );
    });

    describe('group relative short target', () => {
      test.each([
        ['group: next', {size: 5, count: 1, firstIndex: 2}, 3],
        ['group: next', {size: 5, count: 2, firstIndex: 2}, 3],
        ['group: next', {size: 5, count: 1, firstIndex: 4}, 0],
        ['group: next', {size: 5, count: 2, firstIndex: 4}, 1],
        ['group: next', {size: 5, count: 3, firstIndex: 0}, 2],

        ['group: prev', {size: 5, count: 1, firstIndex: 2}, 1],
        ['group: prev', {size: 5, count: 2, firstIndex: 2}, 0],
        ['group: prev', {size: 5, count: 1, firstIndex: 0}, 4],
        ['group: prev', {size: 5, count: 3, firstIndex: 1}, 2],
        ['group: prev', {size: 5, count: 3, firstIndex: 4}, 1]
      ])(
        '(target = %s, cfg = %p) = %d',
        (target: ESLCarouselSlideTarget, cfg: ESLCarouselState, result: number) => expect(toIndex(target, cfg)).toBe(result)
      );
    });
  });
});

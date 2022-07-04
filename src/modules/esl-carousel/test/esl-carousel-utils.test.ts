import {calcDirection, nextGroup, normalizeIndex, prevGroup, resolveGroupIndex, resolveIndex, toIndex} from '../core/esl-carousel-utils';
import type {CarouselDirection, CarouselSlideTarget} from '../core/esl-carousel-utils';
import type {ESLCarousel} from '../core/esl-carousel';

describe('ESLCarousel: Utils', () => {
  describe('normalizeIndex', () => {
    test.each([
      [0, 5, 0],
      [4, 5, 4],
      [10, 10, 0],
      [11, 10, 1],
      [-1, 10, 9],
      [21, 10, 1],
      [-11, 10, 9],
      [-21, 10, 9]
    ])(
      '(index = %d, count = %d) => %d',
      (i: number, size: number, result: number) => expect(normalizeIndex(i, size)).toBe(result)
    );
  });

  describe('calcDirection', () => {
    test.each([
      [0, 1, 5, 'next'],
      [1, 3, 5, 'next'],
      [3, 2, 5, 'prev'],
      [1, 4, 5, 'prev']
    ])(
      '(from = %d, to = %d, count = %d) => %s',
      (from: number, to: number, count: number, result: CarouselDirection) => expect(calcDirection(from, to, count)).toBe(result)
    );
  });

  describe('resolveIndex', () => {
    describe('absolute index', () => {
      test.each([
        [0, 5, 2, 0],
        [1, 5, 2, 1],
        [5, 5, 2, 0],
        [6, 5, 2, 1],
        ['2', 5, 2, 2]
      ])(
        '(absolute index = %d, count = %d) => %d',
        (index: number | string, count: number, activeCount: number, result: number) => expect(resolveIndex(index, NaN, count, activeCount, true)).toBe(result)
      );
    });
    describe('relative index', () => {
      test.each([
        ['-1', 2, 5, 2, 1],
        ['+1', 2, 5, 2, 3],
        ['-3', 2, 5, 2, 4],
        ['+3', 2, 5, 2, 0]
      ])(
        '(relative index = %d, current = %d, count = %d) => %d',
        (index: string, firstIndex: number, count: number, activeCount: number, result: number) =>
          expect(resolveIndex(index, firstIndex, count, activeCount, true)).toBe(result)
      );
    });
  });

  describe('resolveGroupIndex', () => {
    test.each([
      [1, 3, 8, 0],
      [2, 3, 8, 3],
      [3, 3, 8, 5],
      [3, 3, 9, 6]
    ])(
      '(relative index = %d, current = %d, count = %d) => %d',
      (group: number, activeCount: number, count: number, result: number) => expect(resolveGroupIndex(group, activeCount, count)).toBe(result)
    );
  });

  describe('nextGroup', () => {
    test.each([
      [0, 3, 5, 2],
      [1, 3, 5, 2],
      [2, 3, 5, 0],
      [3, 3, 5, 1],
      [4, 3, 5, 2],
      [0, 2, 5, 2],
      [1, 2, 5, 3],
      [2, 2, 5, 3],
      [3, 2, 5, 0],
      [4, 2, 5, 1],
      [2, 1, 5, 3],
      [4, 1, 5, 0]
    ])(
      '(index = %d, active = %d, count = %d) => %d',
      (index: number, activeCount: number, count: number, result: number) => expect(nextGroup(index, activeCount, count)).toBe(result)
    );
  });

  describe('prevGroup', () => {
    test.each([
      [0, 3, 5, 2],
      [1, 3, 5, 0],
      [2, 3, 5, 0],
      [3, 3, 5, 0],
      [4, 3, 5, 1],
      [0, 2, 5, 3],
      [1, 2, 5, 0],
      [2, 2, 5, 0],
      [3, 2, 5, 1],
      [4, 2, 5, 2],
      [2, 1, 5, 1],
      [0, 1, 5, 4]
    ])(
      '(index = %d, active = %d, count = %d) => %d',
      (index: number, activeCount: number, count: number, result: number) => expect(prevGroup(index, activeCount, count)).toBe(result)
    );
  });

  describe('toIndex', () => {
    test.each([
      [0, {size: 5, count: 1, firstIndex: 2}, 0],
      [1, {size: 5, count: 2, firstIndex: 2}, 1],
      [5, {size: 5, count: 1, firstIndex: 0}, 0],
      [6, {size: 5, count: 3, firstIndex: 1}, 1],

      ['-1', {size: 5, count: 1, firstIndex: 2}, 1],
      ['+1', {size: 5, count: 2, firstIndex: 2}, 3],
      ['-3', {size: 5, count: 1, firstIndex: 2}, 4],
      ['+3', {size: 5, count: 3, firstIndex: 2}, 0],

      ['g1', {size: 8, count: 3, firstIndex: 0}, 0],
      ['g2', {size: 8, count: 3, firstIndex: 1}, 3],
      ['g3', {size: 8, count: 3, firstIndex: 2}, 5],
      ['g3', {size: 9, count: 3, firstIndex: 3}, 6],

      ['next', {size: 5, count: 1, firstIndex: 2}, 3],
      ['next', {size: 5, count: 2, firstIndex: 2}, 3],
      ['next', {size: 5, count: 1, firstIndex: 4}, 0],
      ['next', {size: 5, count: 2, firstIndex: 4}, 1],
      ['next', {size: 5, count: 3, firstIndex: 0}, 2],

      ['prev', {size: 5, count: 1, firstIndex: 2}, 1],
      ['prev', {size: 5, count: 2, firstIndex: 2}, 0],
      ['prev', {size: 5, count: 1, firstIndex: 0}, 4],
      ['prev', {size: 5, count: 3, firstIndex: 1}, 0],
      ['prev', {size: 5, count: 3, firstIndex: 4}, 1],
    ])(
      '(target = %s, cfg = %p) = %d',
      (target: CarouselSlideTarget, cfg: Partial<ESLCarousel>, result: number) => expect(toIndex(target, cfg as ESLCarousel)).toBe(result)
    );
  });
});

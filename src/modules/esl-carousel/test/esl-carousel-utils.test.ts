import {calcDirection, normalizeIndex, toIndex} from '../core/esl-carousel-utils';
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
      // TODO [-21, 10, 9]
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

  describe('toIndex', () => {
    describe('absolute index', () => {
      test.each([
        ['0', {count: 5}, 0],
        ['1', {count: 5}, 1],
        ['5', {count: 5}, 0],
        ['6', {count: 5}, 1]
      ])(
        '(target = %s, cfg = %p) => %d',
        (target: CarouselSlideTarget, cfg: Partial<ESLCarousel>, result: number) => expect(toIndex(target, cfg as ESLCarousel)).toBe(result)
      );
    });

    describe('group index', () => {
      test.each([
        ['g1', {count: 8, activeCount: 3, firstIndex: 0}, 0],
        ['g2', {count: 8, activeCount: 3, firstIndex: 1}, 3],
        ['g3', {count: 8, activeCount: 3, firstIndex: 2}, 5],
        ['g3', {count: 9, activeCount: 3, firstIndex: 3}, 6],
        // TODO: expected result for bounds -> ignore out of bounds
        // ['g4', {count: 8, activeCount: 3, firstIndex: 4}, 0],
        // ['g4', {count: 9, activeCount: 3, firstIndex: 4}, 0]
      ])(
        '(target = %s, cfg = %p) => %d',
        (target: CarouselSlideTarget, cfg: Partial<ESLCarousel>, result: number) => expect(toIndex(target, cfg as ESLCarousel)).toBe(result)
      );
    });

    describe('relative index', () => {
      test.each([
        ['-1', {count: 5, firstIndex: 2}, 1],
        ['+1', {count: 5, firstIndex: 2}, 3],
        ['-3', {count: 5, firstIndex: 2}, 4],
        ['+3', {count: 5, firstIndex: 2}, 0]
      ])(
        '(target = %s, cfg = %p) => %d',
        (target: CarouselSlideTarget, cfg: Partial<ESLCarousel>, result: number) => expect(toIndex(target, cfg as ESLCarousel)).toBe(result)
      );
    });

    describe('next group', () => {
      test.each([
        [{count: 5, activeCount: 1, firstIndex: 2}, 3],
        [{count: 5, activeCount: 2, firstIndex: 2}, 4],
        [{count: 5, activeCount: 1, firstIndex: 4}, 0],
        [{count: 5, activeCount: 2, firstIndex: 4}, 0],
        [{count: 5, activeCount: 3, firstIndex: 0}, 3]
      ])(
        '(cfg = %p) = %d',
        (cfg: Partial<ESLCarousel>, result: number) => expect(toIndex('next', cfg as ESLCarousel)).toBe(result)
      );
    });

    describe('previous group', () => {
      test.each([
        [{count: 5, activeCount: 1, firstIndex: 2}, 1],
        [{count: 5, activeCount: 2, firstIndex: 2}, 0],
        [{count: 5, activeCount: 1, firstIndex: 0}, 4],
        [{count: 5, activeCount: 3, firstIndex: 1}, 0],
        [{count: 5, activeCount: 3, firstIndex: 4}, 1]
      ])(
        '(cfg = %p) = %d',
        (cfg: Partial<ESLCarousel>, result: number) => expect(toIndex('prev', cfg as ESLCarousel)).toBe(result)
      );
    });
  });
});

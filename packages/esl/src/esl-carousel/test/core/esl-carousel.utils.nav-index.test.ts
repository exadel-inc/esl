import {toIndex} from '../../core/esl-carousel.utils';
import type {ESLCarouselSlideTarget, ESLCarouselState} from '../../core/esl-carousel.types';

describe('ESLCarousel: Nav Utils (Index)', () => {
  describe('toIndex (returns first index)', () => {
    describe('numeric input in bounds', () => {
      test.each([
        // in-bounds index (regular)
        [0, {size: 5, count: 1, activeIndex: 2, loop: false}, 0],
        [1, {size: 5, count: 2, activeIndex: 2, loop: false}, 1],
        [1, {size: 2, count: 1, activeIndex: 2, loop: false}, 1],
        [1, {size: 2, count: 1, activeIndex: 2, loop: true}, 1],
        [3, {size: 5, count: 2, activeIndex: 2, loop: false}, 3],
        // out of bounds index (loop disabled)
        [4, {size: 5, count: 2, activeIndex: 2, loop: false}, 3],
        [5, {size: 5, count: 2, activeIndex: 2, loop: false}, 3],
        [5, {size: 5, count: 1, activeIndex: 0, loop: false}, 4],
        [6, {size: 5, count: 3, activeIndex: 1, loop: false}, 2],
        // out of bounds index (loop enabled)
        [5, {size: 5, count: 1, activeIndex: 0, loop: true}, 0],
        [6, {size: 5, count: 3, activeIndex: 1, loop: true}, 1],
        // negative index (pointing index from the end)
        [-1, {size: 5, count: 1, activeIndex: 2, loop: false}, 4],
        [-2, {size: 5, count: 2, activeIndex: 2, loop: false}, 3],
        [-1, {size: 5, count: 1, activeIndex: 2, loop: true}, 4],
        [-2, {size: 5, count: 2, activeIndex: 2, loop: true}, 3],
      ])(
        '(target = %s, cfg = %p) = %d',
        (target: ESLCarouselSlideTarget, cfg: ESLCarouselState, result: number) => expect(toIndex(target, cfg).index).toBe(result)
      );
    });

    describe('numeric string input', () => {
      test.each([
        [' 0', {size: 5, count: 1, activeIndex: 2, loop: false}, 0],
        [' 1 ', {size: 5, count: 2, activeIndex: 2, loop: false}, 1],
        ['5', {size: 5, count: 1, activeIndex: 0, loop: false}, 4],
        [' 6 ', {size: 5, count: 3, activeIndex: 1, loop: false}, 2],
        [' 0', {size: 5, count: 1, activeIndex: 2, loop: true}, 0],
        [' 1 ', {size: 5, count: 2, activeIndex: 2, loop: true}, 1],
        ['5', {size: 5, count: 1, activeIndex: 0, loop: true}, 0],
        [' 6 ', {size: 5, count: 3, activeIndex: 1, loop: true}, 1]
      ])(
        '(target = %s, cfg = %p) = %d',
        (target: ESLCarouselSlideTarget, cfg: ESLCarouselState, result: number) => expect(toIndex(target, cfg).index).toBe(result)
      );
    });

    describe('relative slide short target', () => {
      test.each([
        ['prev', {size: 5, count: 1, activeIndex: 2}, 1],
        ['next', {size: 5, count: 2, activeIndex: 2}, 3]
      ])(
        '(target = %s, cfg = %p) = %d',
        (target: ESLCarouselSlideTarget, cfg: ESLCarouselState, result: number) => expect(toIndex(target, cfg).index).toBe(result)
      );
    });

    describe('slide target absolute full', () => {
      test.each([
        // slide:1 should point to index 0, slide:2 to index 1, etc. (1-based)
        ['slide:1', {size: 5, count: 1, activeIndex: 2, loop: true}, 0],
        ['slide:2', {size: 5, count: 2, activeIndex: 2, loop: true}, 1],
        ['slide:3', {size: 5, count: 2, activeIndex: 2, loop: true}, 2],
        ['slide:5', {size: 5, count: 1, activeIndex: 0, loop: true}, 4]
      ])(
        '(target = %s, cfg = %p) = %d',
        (target: ESLCarouselSlideTarget, cfg: ESLCarouselState, result: number) => expect(toIndex(target, cfg).index).toBe(result)
      );
    });

    describe('slide target out of bounds', () => {
      test.each([
        ['slide:0', {size: 5, count: 1, activeIndex: 2, loop: true}],
        ['slide:6', {size: 5, count: 2, activeIndex: 2, loop: true}]
      ])(
        '(target = %s, cfg = %p) should return NaN',
        (target: ESLCarouselSlideTarget, cfg: ESLCarouselState) => expect(toIndex(target, cfg).index).toBe(NaN)
      );
    });

    describe('slide target relative full', () => {
      test.each([
        ['slide:-1', {size: 5, count: 1, activeIndex: 2, loop: false}, 1],
        ['slide:+1', {size: 5, count: 2, activeIndex: 2, loop: false}, 3],
        ['slide:-3', {size: 5, count: 1, activeIndex: 2, loop: true}, 4],
        ['slide:+3', {size: 5, count: 3, activeIndex: 2, loop: true}, 0],
        ['slide:-3', {size: 5, count: 1, activeIndex: 2, loop: false}, 0],
        ['slide:+3', {size: 5, count: 3, activeIndex: 2, loop: false}, 2]
      ])(
        '(target = %s, cfg = %p) = %d',
        (target: ESLCarouselSlideTarget, cfg: ESLCarouselState, result: number) => expect(toIndex(target, cfg).index).toBe(result)
      );
    });

    describe('group direct target', () => {
      test.each([
        // group:1 should point to group index 0, group:2 to group index 1, etc. (1-based)
        ['group:1', {size: 8, count: 3, activeIndex: 0}, 0],
        ['group:2', {size: 8, count: 3, activeIndex: 1}, 3],
        ['group:3', {size: 8, count: 3, activeIndex: 2}, 5]
      ])(
        '(target = %s, cfg = %p) = %d',
        (target: ESLCarouselSlideTarget, cfg: ESLCarouselState, result: number) => expect(toIndex(target, cfg).index).toBe(result)
      );
    });

    describe('group out of bounds', () => {
      test.each([
        ['group:0', {size: 8, count: 3, activeIndex: 0}],
        ['group:4', {size: 8, count: 3, activeIndex: 2}],
        ['group:5', {size: 8, count: 3, activeIndex: 2}],
        ['group:5', {size: 8, count: 2, activeIndex: 2}]
      ])(
        '(target = %s, cfg = %p) should return NaN',
        (target: ESLCarouselSlideTarget, cfg: ESLCarouselState) => expect(toIndex(target, cfg).index).toBe(NaN)
      );
    });

    describe('group relative target', () => {
      test.each([
        ['group: +1', {size: 5, count: 1, activeIndex: 2, loop: true}, 3],
        ['group: +1', {size: 5, count: 2, activeIndex: 2, loop: true}, 3],
        ['group: -1', {size: 5, count: 1, activeIndex: 2, loop: true}, 1],
        ['group: -1', {size: 5, count: 2, activeIndex: 2, loop: true}, 0],
        ['group: +1', {size: 5, count: 2, activeIndex: 4, loop: false}, 3],
        ['group: -1', {size: 5, count: 1, activeIndex: 0, loop: false}, 0],
      ])(
        '(target = %s, cfg = %p) = %d',
        (target: ESLCarouselSlideTarget, cfg: ESLCarouselState, result: number) => expect(toIndex(target, cfg).index).toBe(result)
      );
    });

    describe('group relative short target', () => {
      test.each([
        ['group: next', {size: 5, count: 1, activeIndex: 2, loop: true}, 3],
        ['group: next', {size: 5, count: 2, activeIndex: 2, loop: true}, 3],
        ['group: next', {size: 5, count: 1, activeIndex: 4, loop: false}, 4],
        ['group: next', {size: 5, count: 1, activeIndex: 4, loop: true}, 0],
        ['group: next', {size: 5, count: 2, activeIndex: 4, loop: true}, 1],
        ['group: next', {size: 5, count: 3, activeIndex: 0, loop: true}, 2],

        ['group: prev', {size: 5, count: 1, activeIndex: 2, loop: true}, 1],
        ['group: prev', {size: 5, count: 2, activeIndex: 2, loop: true}, 0],
        ['group: prev', {size: 5, count: 1, activeIndex: 0, loop: false}, 0],
        ['group: prev', {size: 5, count: 1, activeIndex: 0, loop: true}, 4],
        ['group: prev', {size: 5, count: 3, activeIndex: 1, loop: false}, 0],
        ['group: prev', {size: 5, count: 3, activeIndex: 1, loop: true}, 0],
        ['group: prev', {size: 5, count: 3, activeIndex: 4, loop: true}, 1]
      ])(
        '(target = %s, cfg = %p) = %d',
        (target: ESLCarouselSlideTarget, cfg: ESLCarouselState, result: number) => expect(toIndex(target, cfg).index).toBe(result)
      );
    });
  });
});

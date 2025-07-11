import {normalize, groupToIndex, indexToGroup, indexToDirection} from '../../core/esl-carousel.utils';
import {ESLCarouselDirection} from '../../core/esl-carousel.types';
import type {ESLCarouselState} from '../../core/esl-carousel.types';

describe('ESLCarousel: Nav Utils (Core)', () => {
  describe('normalize', () => {
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
      (i: number, size: number, result: number) => expect(normalize(i, size)).toBe(result)
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
      [4, {count: 1, size: 5}, 4]
    ])(
      '(group = %d, %o) => %d',
      (group: number, {count, size}: {count: number, size: number}, result: number) => expect(groupToIndex(group, count, size)).toBe(result)
    );
  });

  describe('indexToGroup', () => {
    test.each([
      // [index, active count, size, result]
      [0, {count: 6, size: 15}, 0],
      [1, {count: 6, size: 15}, 0],
      [2, {count: 6, size: 15}, 0],
      [3, {count: 6, size: 15}, 0],
      [4, {count: 6, size: 15}, 1],
      [5, {count: 6, size: 15}, 1],
      [6, {count: 6, size: 15}, 1],
      [7, {count: 6, size: 15}, 1],
      [8, {count: 6, size: 15}, 2],
      [9, {count: 6, size: 15}, 2],
      [10, {count: 6, size: 15}, 2],
      [11, {count: 6, size: 15}, 2],
      [12, {count: 6, size: 15}, 2],
      [13, {count: 6, size: 15}, 0],
      [14, {count: 6, size: 15}, 0],

      [0, {count: 3, size: 5}, 0],
      [1, {count: 3, size: 5}, 0],
      [2, {count: 3, size: 5}, 1],
      [3, {count: 3, size: 5}, 1],
      [4, {count: 3, size: 5}, 0],

      [1, {count: 2, size: 4}, 0],
      [3, {count: 2, size: 4}, 1],

      [0, {count: 3, size: 4}, 0],
      [1, {count: 3, size: 4}, 1],
      [2, {count: 3, size: 4}, 1],
      [3, {count: 3, size: 4}, 0],

      [2, {count: 3, size: 8}, 1],
      [4, {count: 3, size: 8}, 1],
      [6, {count: 3, size: 8}, 2],
      [7, {count: 3, size: 8}, 0],

      [1, {count: 2, size: 3}, 1],
      [2, {count: 2, size: 3}, 1],

      [0, {count: 2, size: 9}, 0],
      [1, {count: 2, size: 9}, 0],
      [2, {count: 2, size: 9}, 1],
      [3, {count: 2, size: 9}, 1],
      [4, {count: 2, size: 9}, 2],
      [5, {count: 2, size: 9}, 2],
      [6, {count: 2, size: 9}, 3],
      [7, {count: 2, size: 9}, 4],
      [8, {count: 2, size: 9}, 4],

      [0, {count: 4, size: 9}, 0],
      [1, {count: 4, size: 9}, 0],
      [2, {count: 4, size: 9}, 0],
      [3, {count: 4, size: 9}, 1],
      [4, {count: 4, size: 9}, 1],
      [5, {count: 4, size: 9}, 2],
      [6, {count: 4, size: 9}, 2],
      [7, {count: 4, size: 9}, 2],
      [8, {count: 4, size: 9}, 0],

      [0, {count: 5, size: 9}, 0],
      [1, {count: 5, size: 9}, 0],
      [2, {count: 5, size: 9}, 0],
      [3, {count: 5, size: 9}, 1],
      [4, {count: 5, size: 9}, 1],
      [5, {count: 5, size: 9}, 1],
      [6, {count: 5, size: 9}, 1],
      [7, {count: 5, size: 9}, 0],
      [8, {count: 5, size: 9}, 0],

      [0, {count: 6, size: 9}, 0],
      [1, {count: 6, size: 9}, 0],
      [2, {count: 6, size: 9}, 1],
      [3, {count: 6, size: 9}, 1],
      [4, {count: 6, size: 9}, 1],
      [5, {count: 6, size: 9}, 1],
      [6, {count: 6, size: 9}, 1],
      [7, {count: 6, size: 9}, 0],
      [8, {count: 6, size: 9}, 0],

      [0, {count: 1, size: 9}, 0],
      [1, {count: 1, size: 9}, 1],
      [2, {count: 1, size: 9}, 2],
      [3, {count: 1, size: 9}, 3],
      [4, {count: 1, size: 9}, 4],
      [5, {count: 1, size: 9}, 5],
      [6, {count: 1, size: 9}, 6],
      [7, {count: 1, size: 9}, 7],
      [8, {count: 1, size: 9}, 8],

    ])(
      '(index = %d, %o) => %d',
      (index: number, {count, size}: {count: number, size: number}, result: number) => expect(indexToGroup(index, count, size)).toBe(result)
    );
  });

  describe('indexToDirection', () => {
    test.each([
      // [to, {activeIndex, size, loop}, result]
      [1, {activeIndex: 0, size: 5, loop: false}, ESLCarouselDirection.NEXT],
      [4, {activeIndex: 0, size: 5, loop: false}, ESLCarouselDirection.NEXT],
      [4, {activeIndex: 3, size: 5, loop: false}, ESLCarouselDirection.NEXT],
      [0, {activeIndex: 1, size: 5, loop: false}, ESLCarouselDirection.PREV],
      [0, {activeIndex: 4, size: 5, loop: false}, ESLCarouselDirection.PREV],

      [1, {activeIndex: 0, size: 5, loop: true}, ESLCarouselDirection.NEXT],
      [3, {activeIndex: 1, size: 5, loop: true}, ESLCarouselDirection.NEXT],
      [2, {activeIndex: 3, size: 5, loop: true}, ESLCarouselDirection.PREV],
      [4, {activeIndex: 1, size: 5, loop: true}, ESLCarouselDirection.PREV]
    ])(
      '(to = %d, state = %p) => %s',
      (to: number, state: ESLCarouselState, result: ESLCarouselDirection) => expect(indexToDirection(to, state)).toBe(result)
    );
  });
});

import {canNavigate} from '../../core/esl-carousel.utils';
import type {ESLCarouselSlideTarget, ESLCarouselState} from '../../core/esl-carousel.types';

describe('ESLCarousel: Nav Utils', () => {
  describe('canNavigate',  () => {
    test.each([
      // Loop for complete
      ['next', {activeIndex: 0, size: 5, count: 1, loop: true}],
      ['prev', {activeIndex: 0, size: 5, count: 1, loop: true}],
      ['next', {activeIndex: 4, size: 5, count: 1, loop: true}],
      // Non loop case with free space
      ['next', {activeIndex: 0, size: 5, count: 1, loop: false}],
      ['prev', {activeIndex: 4, size: 5, count: 1, loop: false}],
      ['next', {activeIndex: 2, size: 5, count: 1, loop: false}],
      ['prev', {activeIndex: 2, size: 5, count: 1, loop: false}],
      // Group cases
      ['group: next', {activeIndex: 0, size: 5, count: 2, loop: true}],
      ['group: prev', {activeIndex: 0, size: 5, count: 2, loop: true}],
      ['group: next', {activeIndex: 4, size: 5, count: 2, loop: true}],
      ['group: prev', {activeIndex: 4, size: 5, count: 2, loop: true}],
      // Non loop case with free space
      ['group: next', {activeIndex: 0, size: 5, count: 2, loop: false}],
      ['group: prev', {activeIndex: 2, size: 5, count: 2, loop: false}],
      ['group: prev', {activeIndex: 4, size: 5, count: 2, loop: false}],
      // Indexes
      ['slide:1', {activeIndex: 0, size: 4, count: 1, loop: true}],
      ['slide:2', {activeIndex: 0, size: 4, count: 1, loop: true}],
      ['slide:3', {activeIndex: 0, size: 4, count: 1, loop: true}],
      ['slide:0', {activeIndex: 1, size: 4, count: 1, loop: true}],
      ['slide:2', {activeIndex: 1, size: 4, count: 1, loop: true}],
      ['slide:3', {activeIndex: 1, size: 4, count: 1, loop: true}],
    ])(
      'Target %s is allowed for %p configuration',
      (target: ESLCarouselSlideTarget, cfg: ESLCarouselState) => expect(canNavigate(target, cfg)).toBe(true)
    );

    test.each([
      // Non loop case with no free space
      ['next', {activeIndex: 4, size: 5, count: 1, loop: false}],
      ['prev', {activeIndex: 0, size: 5, count: 1, loop: false}],
      // Incomplete cases
      ['next', {activeIndex: 0, size: 1, count: 1, loop: false}],
      ['prev', {activeIndex: 0, size: 1, count: 1, loop: false}],
      ['next', {activeIndex: 0, size: 1, count: 1, loop: true}],
      ['prev', {activeIndex: 0, size: 1, count: 1, loop: true}],
      ['next', {activeIndex: 0, size: 2, count: 2, loop: true}],
      ['prev', {activeIndex: 0, size: 2, count: 2, loop: true}],
      ['next', {activeIndex: 0, size: 1, count: 2, loop: true}],
      ['prev', {activeIndex: 0, size: 1, count: 2, loop: true}],
      // Same slide
      ['0', {activeIndex: 0, size: 5, count: 1, loop: false}],
      ['0', {activeIndex: 0, size: 5, count: 1, loop: true}],
      ['1', {activeIndex: 1, size: 5, count: 2, loop: false}],
      ['1', {activeIndex: 1, size: 5, count: 2, loop: true}],
      // Group cases with no loop
      ['group: next', {activeIndex: 4, size: 5, count: 2, loop: false}],
      ['group: prev', {activeIndex: 0, size: 5, count: 2, loop: false}],
      // Indexes
      ['slide:0', {activeIndex: 0, size: 4, count: 1, loop: true}],
      ['slide:1', {activeIndex: 1, size: 4, count: 1, loop: true}]
    ])(
      'Target %s is not allowed for %p configuration',
      (target: ESLCarouselSlideTarget, cfg: ESLCarouselState) => expect(canNavigate(target, cfg)).toBe(false)
    );
  });
});

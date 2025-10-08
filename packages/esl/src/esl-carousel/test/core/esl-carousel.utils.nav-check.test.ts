import {isCurrent, canNavigate} from '../../core/esl-carousel.utils';
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
      ['slide:1', {activeIndex: 1, size: 4, count: 1, loop: true}],
      ['slide:2', {activeIndex: 0, size: 4, count: 1, loop: true}],
      ['slide:3', {activeIndex: 0, size: 4, count: 1, loop: true}],
      ['slide:3', {activeIndex: 1, size: 4, count: 1, loop: true}],
      ['group:1', {activeIndex: 1, size: 8, count: 3, loop: true}],
      ['group:1', {activeIndex: 3, size: 8, count: 3, loop: true}],
      ['group:2', {activeIndex: 0, size: 8, count: 3, loop: true}],
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
      ['slide:0', {activeIndex: 0, size: 4, count: 1, loop: true}], // invalid, should not navigate
      ['slide:1', {activeIndex: 0, size: 4, count: 1, loop: true}], // already at first slide
      ['slide:2', {activeIndex: 1, size: 4, count: 1, loop: true}],
      ['group:0', {activeIndex: 0, size: 8, count: 3, loop: true}],
      ['group:1', {activeIndex: 0, size: 8, count: 3, loop: true}],
    ])(
      'Target %s is not allowed for %p configuration',
      (target: ESLCarouselSlideTarget, cfg: ESLCarouselState) => expect(canNavigate(target, cfg)).toBe(false)
    );
  });

  describe('isCurrent', () => {
    test.each([
      // Single slide, non-loop
      ['0', {activeIndex: 0, size: 5, count: 1, loop: false}, true],
      ['1', {activeIndex: 0, size: 5, count: 1, loop: false}, false],
      ['slide:1', {activeIndex: 0, size: 5, count: 1, loop: false}, true],
      ['slide:2', {activeIndex: 0, size: 5, count: 1, loop: false}, false],
      ['-1', {activeIndex: 0, size: 5, count: 1, loop: false}, false],
      // Single slide, loop mode (negative index normalization applies)
      ['-1', {activeIndex: 4, size: 5, count: 1, loop: true}, true], // -1 -> 4
      ['-1', {activeIndex: 0, size: 5, count: 1, loop: true}, false],
      ['4', {activeIndex: 4, size: 5, count: 1, loop: true}, true],
      ['slide:5', {activeIndex: 4, size: 5, count: 1, loop: true}, true], // slide:5 -> index 4
      // Multi-slide window non-loop (count = 3)
      ['2', {activeIndex: 2, size: 8, count: 3, loop: false}, true],  // active indices 2,3,4
      ['3', {activeIndex: 2, size: 8, count: 3, loop: false}, true],
      ['4', {activeIndex: 2, size: 8, count: 3, loop: false}, true],
      ['5', {activeIndex: 2, size: 8, count: 3, loop: false}, false],
      ['slide:3', {activeIndex: 2, size: 8, count: 3, loop: false}, true], // 1-based
      ['slide:4', {activeIndex: 2, size: 8, count: 3, loop: false}, true],
      ['slide:5', {activeIndex: 2, size: 8, count: 3, loop: false}, true],
      ['slide:6', {activeIndex: 2, size: 8, count: 3, loop: false}, false],
      // Group checks (size 8, count 3 => groups: 1:[0,1,2],2:[3,4,5],3:[5,6,7])
      ['group:1', {activeIndex: 0, size: 8, count: 3, loop: false}, true],
      ['group:1', {activeIndex: 1, size: 8, count: 3, loop: false}, false], // first slide of group not active
      ['group:2', {activeIndex: 3, size: 8, count: 3, loop: false}, true], // active 3,4,5
      ['group:3', {activeIndex: 5, size: 8, count: 3, loop: false}, true], // active 5,6,7 => first slide =5 active
      ['group:3', {activeIndex: 4, size: 8, count: 3, loop: false}, true], // active 4,5,6 first (5) active => group current
      // Loop group first slide wrapping
      ['group:3', {activeIndex: 6, size: 8, count: 3, loop: true}, false], // active 6,7,0, group3 first slide=5 not active
    ])('Target %s current=%s for %p',
      (target: ESLCarouselSlideTarget, cfg: ESLCarouselState, expected: boolean) => expect(isCurrent(target, cfg)).toBe(expected)
    );

    test.each([
      // Relative targets never current
      ['next', {activeIndex: 0, size: 5, count: 1, loop: true}],
      ['prev', {activeIndex: 0, size: 5, count: 1, loop: true}],
      ['+1', {activeIndex: 0, size: 5, count: 1, loop: true}],
      ['-1', {activeIndex: 2, size: 5, count: 1, loop: true}],
      ['slide:next', {activeIndex: 0, size: 5, count: 1, loop: true}],
      ['slide:+1', {activeIndex: 0, size: 5, count: 1, loop: true}],
      ['group:prev', {activeIndex: 0, size: 5, count: 2, loop: true}],
      ['group:+1', {activeIndex: 0, size: 5, count: 2, loop: true}],
      ['group:-1', {activeIndex: 2, size: 5, count: 2, loop: true}],
    ])('Relative target %s is never current for %p', (target: ESLCarouselSlideTarget, cfg: ESLCarouselState) => {
      expect(isCurrent(target, cfg)).toBe(false);
    });
  });
});

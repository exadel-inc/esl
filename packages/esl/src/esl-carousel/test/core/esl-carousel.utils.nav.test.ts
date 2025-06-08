import {canNavigate, isActiveTarget} from '../../core/esl-carousel.utils';
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

  describe('isActiveTarget', () => {
    describe('simple index passed correctly', () => {
      test.each([
        // | Cfg | Active Indexes | Inactive Indexes |
        [{activeIndex: 0, size: 4, count: 1, loop: false}, [0], []],
        [{activeIndex: 1, size: 4, count: 1, loop: false}, [1], []],
        [{activeIndex: 0, size: 1, count: 1, loop: false}, [0], []],
        [{activeIndex: 0, size: 4, count: 1, loop: true}, [0, 4], [5]],
        [{activeIndex: 1, size: 4, count: 1, loop: true}, [1, 5], [4]],
        [{activeIndex: 0, size: 4, count: 3, loop: false}, [0, 1, 2], []],
        [{activeIndex: 2, size: 4, count: 3, loop: false}, [2, 3], []],
        [{activeIndex: 0, size: 4, count: 3, loop: true}, [0, 1, 2], []],
        [{activeIndex: 2, size: 4, count: 3, loop: true}, [2, 3, 0], []]
      ])('For config %p indexes %p are active', (cfg: ESLCarouselState, indexes: number[], out: number[]) => {
        // Main range indexes should be listed in `indexes` if they are active
        Array.from({length: cfg.size}, (_, i) => i)
          .forEach((i) => expect(isActiveTarget(i, cfg)).toBe(indexes.includes(i)));
        // Out of range indexes mentioned in `indexes` should be active
        const extra = indexes.filter((i) => i < 0 || i >= cfg.size);
        extra.forEach((i) => expect(isActiveTarget(i, cfg)).toBe(true));
        // Out of range indexes should not be active
        out.forEach((i) => expect(isActiveTarget(i, cfg)).toBe(false));
      });
    });

    describe('relative index can not be active', () => {
      const cfg = {activeIndex: 1, size: 4, count: 1, loop: false} as ESLCarouselState;
      test.each([
        '+1', '+2', '+3',
        '-1', '-2', '-3',
        'next', 'prev',
        'slide:+1', 'slide:+2', 'slide:+3',
        'slide:-1', 'slide:-2', 'slide:-3',
        'slide:next', 'slide:prev',
        'group:+1', 'group:+2', 'group:+3',
      ])('Target %s is not active for config %p', (target: ESLCarouselSlideTarget) => {
        expect(isActiveTarget(target, cfg)).toBe(false);
      });
    });

    describe('group indexes act normally', () => {
      test.each([
        // | Target | Cfg |
        ['group:0', {activeIndex: 0, size: 6, count: 3, loop: false}, true],
        ['group:1', {activeIndex: 0, size: 6, count: 3, loop: false}, false],
        ['group:2', {activeIndex: 0, size: 6, count: 3, loop: false}, true], // Normalization to group 0
        ['group:0', {activeIndex: 3, size: 6, count: 3, loop: true}, false],
        ['group:1', {activeIndex: 3, size: 6, count: 3, loop: true}, true],
        ['group:2', {activeIndex: 3, size: 6, count: 3, loop: true}, false],
        ['group:0', {activeIndex: 2, size: 6, count: 3, loop: true}, false],
        ['group:1', {activeIndex: 2, size: 6, count: 3, loop: true}, false],
        ['group:2', {activeIndex: 2, size: 6, count: 3, loop: true}, false]
      ])('Target %s is active for config %p: %b', (target: ESLCarouselSlideTarget, cfg: ESLCarouselState, active: boolean) => {
        expect(isActiveTarget(target, cfg)).toBe(active);
      });
    });
  });
});

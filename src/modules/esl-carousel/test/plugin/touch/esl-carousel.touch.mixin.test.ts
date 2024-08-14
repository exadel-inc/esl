import {ESLCarousel} from '../../../core/esl-carousel';
import {ESLCarouselTouchMixin} from '../../../plugin/touch/esl-carousel.touch.mixin';
import {ESLCarouselDummyRenderer} from '../../common/esl-carousel.dummy.renderer';

describe('ESLCarousel: Touch Plugin', () => {
  ESLCarousel.register();
  ESLCarouselTouchMixin.register();
  ESLCarouselDummyRenderer.register();

  describe('ESLCarouselTouchMixin initialization', () => {
    const $carousel = ESLCarousel.create();

    beforeEach(() => document.body.appendChild($carousel));
    afterEach(() => document.body.removeChild($carousel));

    test('Plugin attached to carousel correctly', async () => {
      $carousel.setAttribute('esl-carousel-touch', '');
      await Promise.resolve();
      expect(ESLCarouselTouchMixin.get($carousel)).not.toBeFalsy();
    });

    test('Plugin attaches with drug action by default', async () => {
      $carousel.setAttribute('esl-carousel-touch', '');
      await Promise.resolve();
      const plugin = ESLCarouselTouchMixin.get($carousel);
      expect(plugin?.isDragMode).toBe(true);
      expect(plugin?.isSwipeMode).toBe(false);
    });

    test('Plugin attaches with swipe action', async () => {
      $carousel.setAttribute('esl-carousel-touch', 'swipe');
      await Promise.resolve();
      const plugin = ESLCarouselTouchMixin.get($carousel);
      expect(plugin?.isDragMode).toBe(false);
      expect(plugin?.isSwipeMode).toBe(true);
    });

    test('Plugin attaches with drag action', async () => {
      $carousel.setAttribute('esl-carousel-touch', 'drag');
      await Promise.resolve();
      const plugin = ESLCarouselTouchMixin.get($carousel);
      expect(plugin?.isDragMode).toBe(true);
      expect(plugin?.isSwipeMode).toBe(false);
    });

    test('Plugin could be attached with none action', async () => {
      $carousel.setAttribute('esl-carousel-touch', 'none');
      await Promise.resolve();
      const plugin = ESLCarouselTouchMixin.get($carousel);
      expect(plugin?.isDragMode).toBe(false);
      expect(plugin?.isSwipeMode).toBe(false);
    });

    test('Plugin attaches with multiple actions', async () => {
      $carousel.setAttribute('esl-carousel-touch', 'none | @XS => swipe | @+SM => drag');
      await Promise.resolve();
      const plugin = ESLCarouselTouchMixin.get($carousel);
      expect(plugin?.isDragMode).toBe(false);
      expect(plugin?.isSwipeMode).toBe(false);
      expect(plugin?.configQuery.rules.length).toBe(3);
    });

    test('Plugin touch action observed to handle changes', async () => {
      $carousel.setAttribute('esl-carousel-touch', '');
      await Promise.resolve();
      const plugin = ESLCarouselTouchMixin.get($carousel);
      expect(plugin?.isDragMode).toBe(true);

      $carousel.setAttribute('esl-carousel-touch', 'swipe');
      await Promise.resolve();
      expect(plugin?.isSwipeMode).toBe(true);
    });
  });
});

import {ESLCarousel} from '../../../core/esl-carousel';
import {ESLCarouselDummyRenderer} from '../../common/esl-carousel.dummy.renderer';
import {ESLCarouselAutoplayMixin} from '../../../plugin/autoplay/esl-carousel.autoplay.mixin';
import {IntersectionObserverMock} from '../../../../esl-utils/test/intersectionObserver.mock';

jest.mock('../../../../esl-utils/dom/ready', () => ({
  onDocumentReady: (cb: any) => cb()
}));

const microtask = () => Promise.resolve();
const doubleTick = () => microtask().then(microtask);

describe('ESLCarousel: Autoplay Plugin', () => {
  ESLCarousel.register();
  ESLCarouselAutoplayMixin.register();
  ESLCarouselDummyRenderer.register();

  beforeAll(() => {
    IntersectionObserverMock.mock();
    jest.useFakeTimers();
  });
  afterAll(() => {
    IntersectionObserverMock.restore();
    jest.useRealTimers();
  });

  describe('ESLCarouselTouchMixin default config', () => {
    const $carousel = ESLCarousel.create();
    $carousel.setAttribute('esl-carousel-autoplay', '');

    beforeAll(() => document.body.appendChild($carousel));
    afterAll(() => document.body.removeChild($carousel));

    test('Plugin attached to carousel correctly', async () => {
      expect(ESLCarouselAutoplayMixin.get($carousel)).not.toBeFalsy();
    });

    test('Plugin uses positive and UX friendly duration by default', async () => {
      const plugin = ESLCarouselAutoplayMixin.get($carousel);
      expect(plugin?.duration).toBeGreaterThan(1000);
    });

    test('Plugin uses slide command by default', async () => {
      const plugin = ESLCarouselAutoplayMixin.get($carousel);
      expect(plugin?.config.command).toContain('slide');
    });
  });

  describe('ESLCarouselTouchMixin custom config', () => {
    const $carousel = ESLCarousel.create();

    beforeEach(() => document.body.appendChild($carousel));
    afterEach(() => document.body.removeChild($carousel));

    test('Plugin attaches with custom duration defined as primary attribute', async () => {
      $carousel.setAttribute('esl-carousel-autoplay', '1100');
      await microtask();
      const plugin = ESLCarouselAutoplayMixin.get($carousel);
      expect(plugin?.duration).toBe(1100);
    });

    test('Plugin attaches with custom duration defined as primary attribute with unit', async () => {
      $carousel.setAttribute('esl-carousel-autoplay', '4.5s');
      await microtask();
      const plugin = ESLCarouselAutoplayMixin.get($carousel);
      expect(plugin?.duration).toBe(4500);
    });

    test('Plugin attaches with custom command', async () => {
      $carousel.setAttribute('esl-carousel-autoplay', '{command: "slide:prev" }');
      await microtask();
      const plugin = ESLCarouselAutoplayMixin.get($carousel);
      expect(plugin?.config.command).toBe('slide:prev');
    });
  });

  describe('ESLCarouselAutoplayMixin timer functionality (main)', () => {
    const $carousel = ESLCarousel.create();
    const goToSpy = jest.spyOn($carousel, 'goTo');

    beforeEach(() => {
      document.body.appendChild($carousel);
      goToSpy.mockImplementation(() => Promise.resolve());
    });
    afterEach(() => {
      document.body.removeChild($carousel);
      goToSpy.mockClear();
      jest.clearAllTimers();
    });

    test('Plugin execute slide command according to timeout', async () => {
      $carousel.setAttribute('esl-carousel-autoplay', '');
      await microtask();
      IntersectionObserverMock.trigger($carousel, {intersectionRatio: 1, isIntersecting: true});

      const plugin = ESLCarouselAutoplayMixin.get($carousel)!;
      expect(plugin.active).toBe(true);
      // Wait for the first slide command execution
      jest.advanceTimersByTime(plugin.duration + 1);
      expect(goToSpy).toHaveBeenCalledTimes(1);
      expect(goToSpy).toHaveBeenCalledWith(plugin.config.command, expect.objectContaining({activator: plugin}));
    });

    test('Plugin continues to execute slide command', async () => {
      $carousel.setAttribute('esl-carousel-autoplay', '');
      await microtask();
      IntersectionObserverMock.trigger($carousel, {intersectionRatio: 1, isIntersecting: true});

      const plugin = ESLCarouselAutoplayMixin.get($carousel)!;
      // Wait for the first slide command execution
      jest.advanceTimersByTime(plugin.duration + 1);
      await doubleTick();
      jest.advanceTimersByTime(plugin.duration + 1);
      expect(goToSpy).toHaveBeenCalledTimes(2);
    });

    test('Plugin does not execute slide command if not intersecting', async () => {
      $carousel.setAttribute('esl-carousel-autoplay', '');
      await microtask();
      IntersectionObserverMock.trigger($carousel, {intersectionRatio: 0, isIntersecting: false});

      const plugin = ESLCarouselAutoplayMixin.get($carousel)!;
      expect(plugin.active).toBe(false);
      // Wait for the first slide command execution
      jest.advanceTimersByTime(plugin.duration + 1);
      expect(goToSpy).not.toHaveBeenCalled();
    });
  });

  describe('ESLCarouselAutoplayMixin: observes user interaction', () => {
    const $carousel = ESLCarousel.create();

    beforeEach(async () => {
      document.body.appendChild($carousel);
      $carousel.setAttribute('esl-carousel-autoplay', '');
      await microtask();
      IntersectionObserverMock.trigger($carousel, {intersectionRatio: 1, isIntersecting: true});
    });
    afterEach(() => document.body.removeChild($carousel));

    test('Plugin pauses on user hovers carousel', async () => {
      const plugin = ESLCarouselAutoplayMixin.get($carousel)!;
      expect(plugin.active).toBe(true);
      // Simulate user interaction
      $carousel.dispatchEvent(new MouseEvent('mouseenter'));
      await Promise.resolve();
      expect(plugin.active).toBe(false);
    });

    test('Plugin resumes on user unhovers carousel', async () => {
      const plugin = ESLCarouselAutoplayMixin.get($carousel)!;
      expect(plugin.active).toBe(true);
      // Simulate user interaction
      $carousel.dispatchEvent(new MouseEvent('mouseenter'));
      await Promise.resolve();
      expect(plugin.active).toBe(false);
      // Resume autoplay
      $carousel.dispatchEvent(new MouseEvent('mouseleave'));
      await Promise.resolve();
      expect(plugin.active).toBe(true);
    });

    test('Plugin pauses on user focuses carousel', async () => {
      const plugin = ESLCarouselAutoplayMixin.get($carousel)!;
      expect(plugin.active).toBe(true);
      // Simulate user interaction
      $carousel.dispatchEvent(new FocusEvent('focusin'));
      await Promise.resolve();
      expect(plugin.active).toBe(false);
    });

    test('Plugin resumes on user leaves carousel', async () => {
      const plugin = ESLCarouselAutoplayMixin.get($carousel)!;
      expect(plugin.active).toBe(true);
      // Simulate user interaction
      $carousel.dispatchEvent(new FocusEvent('focusin'));
      await Promise.resolve();
      expect(plugin.active).toBe(false);
      // Resume autoplay
      $carousel.dispatchEvent(new FocusEvent('focusout'));
      await Promise.resolve();
      expect(plugin.active).toBe(true);
    });
  });
});

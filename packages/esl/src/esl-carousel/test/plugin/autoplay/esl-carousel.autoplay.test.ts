import {ESLCarousel} from '../../../core/esl-carousel';
import {ESLCarouselDummyRenderer} from '../../common/esl-carousel.dummy.renderer';
import {ESLCarouselAutoplayMixin} from '../../../plugin/autoplay/esl-carousel.autoplay.mixin';
import {ESLCarouselAutoplayEvent} from '../../../plugin/autoplay/esl-carousel.autoplay.event';
import {IntersectionObserverMock} from '../../../../test/intersectionObserver.mock';

vi.mock('../../../../esl-utils/dom/ready', () => ({
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
    vi.useFakeTimers();
  });
  afterAll(() => {
    IntersectionObserverMock.restore();
    vi.useRealTimers();
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

  describe('ESLCarouselAutoplayMixin custom config', () => {
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

    test('Plugin treats none duration as disabled', async () => {
      $carousel.setAttribute('esl-carousel-autoplay', 'none');
      await microtask();
      const plugin = ESLCarouselAutoplayMixin.get($carousel);
      expect(plugin?.duration).toBeNaN();
      expect(plugin?.enabled).toBe(false);
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
    const goToSpy = vi.spyOn($carousel, 'goTo');

    vi.spyOn($carousel, 'canNavigate').mockReturnValue(true);

    beforeEach(() => {
      document.body.appendChild($carousel);
      goToSpy.mockImplementation(() => Promise.resolve());
    });
    afterEach(() => {
      document.body.removeChild($carousel);
      goToSpy.mockClear();
      vi.clearAllTimers();
    });

    test('Plugin execute slide command according to timeout', async () => {
      $carousel.setAttribute('esl-carousel-autoplay', '');
      await microtask();
      IntersectionObserverMock.trigger($carousel, {intersectionRatio: 1, isIntersecting: true});

      const plugin = ESLCarouselAutoplayMixin.get($carousel)!;
      expect(plugin.active).toBe(true);
      // Wait for the first slide command execution
      vi.advanceTimersByTime(plugin.duration + 1);
      expect(goToSpy).toHaveBeenCalledTimes(1);
      expect(goToSpy).toHaveBeenCalledWith(plugin.config.command, expect.objectContaining({activator: plugin}));
    });

    test('Plugin continues to execute slide command', async () => {
      $carousel.setAttribute('esl-carousel-autoplay', '');
      await microtask();
      IntersectionObserverMock.trigger($carousel, {intersectionRatio: 1, isIntersecting: true});

      const plugin = ESLCarouselAutoplayMixin.get($carousel)!;
      // Wait for the first slide command execution
      vi.advanceTimersByTime(plugin.duration + 1);
      await doubleTick();
      vi.advanceTimersByTime(plugin.duration + 1);
      expect(goToSpy).toHaveBeenCalledTimes(2);
    });

    test('Plugin does not execute slide command if not intersecting', async () => {
      $carousel.setAttribute('esl-carousel-autoplay', '');
      await microtask();
      IntersectionObserverMock.trigger($carousel, {intersectionRatio: 0, isIntersecting: false});

      const plugin = ESLCarouselAutoplayMixin.get($carousel)!;
      expect(plugin.active).toBe(false);
      // Wait for the first slide command execution
      vi.advanceTimersByTime(plugin.duration + 1);
      expect(goToSpy).not.toHaveBeenCalled();
    });
  });

  describe('ESLCarouselAutoplayMixin public API', () => {
    const $carousel = ESLCarousel.create();
    vi.spyOn($carousel, 'canNavigate').mockReturnValue(true);

    beforeEach(async () => {
      document.body.appendChild($carousel);
      $carousel.setAttribute('esl-carousel-autoplay', '{duration: 1000, blockBehaviour: "pause"}');
      await microtask();
      IntersectionObserverMock.trigger($carousel, {intersectionRatio: 1, isIntersecting: true});
    });

    afterEach(() => {
      document.body.removeChild($carousel);
      vi.clearAllTimers();
    });

    test('pause() sets paused state and preserves remaining timeout', async () => {
      const plugin = ESLCarouselAutoplayMixin.get($carousel)!;
      expect(plugin.active).toBe(true);

      vi.advanceTimersByTime(350);
      plugin.pause();
      await microtask();

      expect(plugin.paused).toBe(true);
      expect(plugin.active).toBe(false);
      expect(plugin.remaining).toBeGreaterThan(0);
      expect(plugin.remaining).toBeLessThan(1000);
    });

    test('start() resumes paused cycle', async () => {
      const plugin = ESLCarouselAutoplayMixin.get($carousel)!;
      vi.advanceTimersByTime(300);
      plugin.pause();
      const pausedRemaining = plugin.remaining;

      plugin.start();
      await microtask();

      expect(plugin.paused).toBe(false);
      expect(plugin.active).toBe(true);
      expect(plugin.remaining).toBeLessThanOrEqual(pausedRemaining);
      expect(plugin.remaining).toBeGreaterThan(0);
    });

    test('stop() disables autoplay until start() is called', async () => {
      const plugin = ESLCarouselAutoplayMixin.get($carousel)!;

      plugin.stop();
      await microtask();
      expect(plugin.enabled).toBe(false);
      expect(plugin.canRun).toBe(false);
      expect(plugin.active).toBe(false);
      expect(plugin.remaining).toBe(0);

      plugin.start();
      await microtask();
      expect(plugin.enabled).toBe(true);
      expect(plugin.active).toBe(true);
    });

    test('dispatches reason and remaining in autoplay change event', async () => {
      const plugin = ESLCarouselAutoplayMixin.get($carousel)!;
      const events: ESLCarouselAutoplayEvent[] = [];
      $carousel.addEventListener(ESLCarouselAutoplayEvent.NAME, (e) => events.push(e as ESLCarouselAutoplayEvent));

      vi.advanceTimersByTime(250);
      plugin.pause('user:pause:call');
      await microtask();

      const pauseEvent = events.at(-1)!;
      expect(pauseEvent.reason).toBe('user:pause:call');
      expect(pauseEvent.state).toBe('paused');
      expect(pauseEvent.paused).toBe(true);
      expect(pauseEvent.active).toBe(false);
      expect(pauseEvent.remaining).toBeGreaterThan(0);
      expect(pauseEvent.remaining).toBeLessThan(1000);
    });

    test('runtime block is reflected as blocked state without setting paused', async () => {
      const plugin = ESLCarouselAutoplayMixin.get($carousel)!;
      const events: ESLCarouselAutoplayEvent[] = [];
      $carousel.addEventListener(ESLCarouselAutoplayEvent.NAME, (e) => events.push(e as ESLCarouselAutoplayEvent));

      vi.advanceTimersByTime(250);
      IntersectionObserverMock.trigger($carousel, {intersectionRatio: 0, isIntersecting: false});
      await microtask();

      const blockEvent = events.at(-1)!;
      expect(plugin.paused).toBe(false);
      expect(plugin.blocked).toBe(true);
      expect(plugin.state).toBe('blocked');
      expect(plugin.remaining).toBeGreaterThan(0);
      expect(blockEvent.reason).toBe('system:pause:block');
      expect(blockEvent.state).toBe('blocked');
      expect(blockEvent.paused).toBe(false);
      expect(blockEvent.blocked).toBe(true);
      expect(blockEvent.remaining).toBeGreaterThan(0);
    });
  });
});

import {ESLCarouselAutoplayMixin} from '../../../plugin/autoplay/esl-carousel.autoplay.mixin';
import {IntersectionObserverMock} from '../../../../esl-utils/test/intersectionObserver.mock';
import {createDummyCarousel} from '../../common/esl-carousel.dummy';

vi.mock('../../../../esl-utils/dom/ready', () => ({
  onDocumentReady: (cb: any) => cb()
}));

const microtask = () => Promise.resolve();
const doubleTick = () => microtask().then(microtask);

describe('ESLCarouselAutoplayMixin: per slide timer definition', () => {
  const {$carousel, $slides} = createDummyCarousel(3);
  const goToSpy = vi.spyOn($carousel, 'goTo');
  ESLCarouselAutoplayMixin.register();

  beforeAll(() => {
    IntersectionObserverMock.mock();
    vi.useFakeTimers();

    // Set up test configuration
    $slides[0].toggleAttribute('active');
    $slides.forEach(($slide, i) =>
      $slide.setAttribute(ESLCarouselAutoplayMixin.SLIDE_DURATION_ATTRIBUTE, `${(i + 1) * 100}`));

    goToSpy.mockImplementation(async () => {
      // Simulate the next slide activation
      const nextIndex = ($carousel.activeIndex + 1) % $carousel.size;
      $carousel.$slides.forEach(($slide, i) => {
        $slide.toggleAttribute('active', i === nextIndex);
      });
    });
  });
  afterAll(() => {
    IntersectionObserverMock.restore();
    vi.useRealTimers();
  });

  test('Default carousel setup', () => {
    expect($carousel.size).toBe(3);
    expect($carousel.activeIndex).toBe(0);
    expect($carousel.config).toEqual(expect.objectContaining({
      count: 1,
      size: 3
    }));
  });

  test('Plugin executes slide command with per slide duration (integration)', async () => {
    $carousel.loop = true;
    $carousel.setAttribute('esl-carousel-autoplay', '');
    await microtask();
    IntersectionObserverMock.trigger($carousel, {intersectionRatio: 1, isIntersecting: true});

    const plugin = ESLCarouselAutoplayMixin.get($carousel)!;
    for (let i = 0; i < $slides.length; i++) {
      // Wait for the slide command execution
      vi.advanceTimersByTime(plugin.effectiveDuration + 1);
      expect(goToSpy).toHaveBeenCalledTimes(i + 1);
      await doubleTick();
    }
  });
});

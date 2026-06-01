import {ESLCarousel} from '../../../core/esl-carousel';
import {ESLCarouselDummyRenderer} from '../../common/esl-carousel.dummy.renderer';
import {ESLCarouselAutoplayMixin} from '../../../plugin/autoplay/esl-carousel.autoplay.mixin';
import {ESLCarouselAutoplayProgressMixin} from '../../../plugin/autoplay/esl-carousel.autoplay.progress.mixin';
import {IntersectionObserverMock} from '../../../../test/intersectionObserver.mock';

vi.mock('../../../../esl-utils/dom/ready', () => ({
  onDocumentReady: (cb: any) => cb()
}));

describe('ESLCarousel: Autoplay Progress Mixin', () => {
  ESLCarousel.register();
  ESLCarouselAutoplayMixin.register();
  ESLCarouselAutoplayProgressMixin.register();
  ESLCarouselDummyRenderer.register();

  beforeAll(() => {
    IntersectionObserverMock.mock();
    vi.useFakeTimers();
  });

  afterAll(() => {
    IntersectionObserverMock.restore();
    vi.useRealTimers();
  });

  afterEach(() => {
    document.body.replaceChildren();
    vi.clearAllTimers();
  });

  const microtask = () => Promise.resolve();
  const getMs = ($el: HTMLElement, name: string): number => Number(($el.style.getPropertyValue(name) || '0').replace('ms', ''));
  const getProgress = ($el: HTMLElement): number => Number($el.style.getPropertyValue('--esl-autoplay-progress') || '0');

  const createProgressSetup = async (autoplayConfig: string = '{duration: 1000, blockBehaviour: "pause"}') => {
    const $container = document.createElement('div');
    $container.className = 'esl-carousel-nav-container';
    const $progress = document.createElement('button');
    $progress.setAttribute('esl-carousel-autoplay-progress', '');
    const $carousel = ESLCarousel.create();
    vi.spyOn($carousel, 'canNavigate').mockReturnValue(true);
    $carousel.setAttribute('esl-carousel-autoplay', autoplayConfig);
    $container.append($progress, $carousel);
    document.body.appendChild($container);
    await microtask();
    IntersectionObserverMock.trigger($carousel, {intersectionRatio: 1, isIntersecting: true});
    await microtask();
    return {$carousel, $progress, plugin: ESLCarouselAutoplayMixin.get($carousel)!};
  };

  test('reflects user pause as paused state and preserves progress markers', async () => {
    const {$progress, plugin} = await createProgressSetup();

    vi.advanceTimersByTime(320);
    plugin.pause();
    await microtask();

    expect(plugin.paused).toBe(true);
    expect(plugin.blocked).toBe(false);
    expect($progress.getAttribute('autoplay-state')).toBe('paused');
    expect(getMs($progress, '--esl-autoplay-timeout')).toBeGreaterThan(0);
    expect(getMs($progress, '--esl-autoplay-timeout')).toBeLessThan(1000);
    expect(getProgress($progress)).toBeGreaterThan(0);
    expect(getProgress($progress)).toBeLessThan(1);
  });

  test('reflects pause-block as blocked state and preserves current progress', async () => {
    const {$carousel, $progress, plugin} = await createProgressSetup('{duration: 1000, blockBehaviour: "pause"}');

    vi.advanceTimersByTime(350);
    IntersectionObserverMock.trigger($carousel, {intersectionRatio: 0, isIntersecting: false});
    await microtask();

    expect(plugin.paused).toBe(false);
    expect(plugin.blocked).toBe(true);
    expect($progress.getAttribute('autoplay-state')).toBe('blocked');
    expect(getMs($progress, '--esl-autoplay-timeout')).toBeGreaterThan(0);
    expect(getMs($progress, '--esl-autoplay-timeout')).toBeLessThan(1000);
    expect(getProgress($progress)).toBeGreaterThan(0);
    expect(getProgress($progress)).toBeLessThan(1);
  });

  test('reflects stop-block as blocked state and resets progress markers', async () => {
    const {$carousel, $progress, plugin} = await createProgressSetup('{duration: 1000, blockBehaviour: "stop"}');

    vi.advanceTimersByTime(350);
    IntersectionObserverMock.trigger($carousel, {intersectionRatio: 0, isIntersecting: false});
    await microtask();

    expect(plugin.paused).toBe(false);
    expect(plugin.blocked).toBe(true);
    expect($progress.getAttribute('autoplay-state')).toBe('blocked');
    expect(getMs($progress, '--esl-autoplay-timeout')).toBe(1000);
    expect(getProgress($progress)).toBe(0);
  });
});


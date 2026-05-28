import {ESLCarousel} from '../../../core/esl-carousel';
import {ESLCarouselDummyRenderer} from '../../common/esl-carousel.dummy.renderer';
import {ESLCarouselAutoplayMixin} from '../../../plugin/autoplay/esl-carousel.autoplay.mixin';
import {ESLCarouselAutoplayStateMixin} from '../../../plugin/autoplay/esl-carousel.autoplay.state.mixin';
import {IntersectionObserverMock} from '../../../../test/intersectionObserver.mock';

vi.mock('../../../../esl-utils/dom/ready', () => ({
  onDocumentReady: (cb: any) => cb()
}));

describe('ESLCarousel: Autoplay State Mixin', () => {
  ESLCarousel.register();
  ESLCarouselAutoplayMixin.register();
  ESLCarouselAutoplayStateMixin.register();
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

  test('reflects active and blocked autoplay state on host', async () => {
    const $container = document.createElement('div');
    $container.className = 'esl-carousel-nav-container';
    const $status = document.createElement('span');
    $status.setAttribute('esl-carousel-autoplay-state', '');
    const $carousel = ESLCarousel.create();
    vi.spyOn($carousel, 'canNavigate').mockReturnValue(true);
    $carousel.setAttribute('esl-carousel-autoplay', '{duration: 1000, blockBehaviour: "pause"}');
    $container.append($status, $carousel);
    document.body.appendChild($container);
    await microtask();

    IntersectionObserverMock.trigger($carousel, {intersectionRatio: 1, isIntersecting: true});
    await microtask();
    expect($status.hasAttribute('disabled')).toBe(false);
    expect($status.getAttribute('autoplay-state')).toBe('active');

    IntersectionObserverMock.trigger($carousel, {intersectionRatio: 0, isIntersecting: false});
    await microtask();
    expect($status.getAttribute('autoplay-state')).toBe('blocked');
  });

  test('reflects unavailable state when target carousel has no autoplay plugin', async () => {
    const $container = document.createElement('div');
    $container.className = 'esl-carousel-nav-container';
    const $status = document.createElement('span');
    $status.setAttribute('esl-carousel-autoplay-state', '');
    const $carousel = ESLCarousel.create();
    $container.append($status, $carousel);
    document.body.appendChild($container);
    await microtask();

    expect($status.hasAttribute('disabled')).toBe(true);
    expect($status.getAttribute('autoplay-state')).toBe('unavailable');
  });
});


import {ESLCarousel} from '../../../core/esl-carousel';
import {ESLCarouselDummyRenderer} from '../../common/esl-carousel.dummy.renderer';
import {ESLCarouselAutoplayMixin} from '../../../plugin/autoplay/esl-carousel.autoplay.mixin';
import {ESLCarouselAutoplayControlMixin} from '../../../plugin/autoplay/esl-carousel.autoplay.control.mixin';
import {ESLCarouselAutoplayEvent} from '../../../plugin/autoplay/esl-carousel.autoplay.event';
import {IntersectionObserverMock} from '../../../../test/intersectionObserver.mock';

vi.mock('../../../../esl-utils/dom/ready', () => ({
  onDocumentReady: (cb: any) => cb()
}));

describe('ESLCarousel: Autoplay Plugin Controls', () => {
  ESLCarousel.register();
  ESLCarouselAutoplayMixin.register();
  ESLCarouselAutoplayControlMixin.register();
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

  const createControlSetup = async (
    behaviour: 'pause' | 'stop',
    autoplayConfig: string = '{duration: 1000, blockBehaviour: "pause"}'
  ) => {
    const $container = document.createElement('div');
    $container.className = 'esl-carousel-nav-container';
    const $carousel = ESLCarousel.create();
    vi.spyOn($carousel, 'canNavigate').mockReturnValue(true);
    const $trigger = document.createElement('button');
    $trigger.setAttribute('esl-carousel-autoplay-control', behaviour);
    $carousel.setAttribute('esl-carousel-autoplay', autoplayConfig);
    $container.append($trigger, $carousel);
    document.body.appendChild($container);
    await microtask();
    IntersectionObserverMock.trigger($carousel, {intersectionRatio: 1, isIntersecting: true});
    return {$carousel, $trigger};
  };

  test('separate pause control toggles pause/resume and keeps plugin enabled', async () => {
    const {$carousel, $trigger} = await createControlSetup('pause');
    const events: ESLCarouselAutoplayEvent[] = [];
    $carousel.addEventListener(ESLCarouselAutoplayEvent.NAME, (e) => events.push(e as ESLCarouselAutoplayEvent));
    const plugin = ESLCarouselAutoplayMixin.get($carousel)!;
    const control = ESLCarouselAutoplayControlMixin.get($trigger)!;

    expect(plugin.enabled).toBe(true);
    expect(plugin.active).toBe(true);
    expect(control.autoplay).toBe(plugin);
    expect($trigger.hasAttribute('disabled')).toBe(false);
    expect(plugin.state).toBe('active');
    expect($trigger.getAttribute('autoplay-state')).toBe('active');
    expect($trigger.getAttribute('aria-controls')).toBe($carousel.id);
    expect($trigger.getAttribute('aria-pressed')).toBe('false');

    $trigger.click();
    await microtask();
    expect(plugin.enabled).toBe(true);
    expect(plugin.paused).toBe(true);
    expect(plugin.active).toBe(false);
    expect(plugin.state).toBe('paused');
    expect($trigger.getAttribute('autoplay-state')).toBe('paused');
    expect($trigger.getAttribute('aria-pressed')).toBe('true');

    $trigger.click();
    await microtask();
    expect(plugin.enabled).toBe(true);
    expect(plugin.paused).toBe(false);
    expect(plugin.active).toBe(true);
    expect(events.at(-1)?.reason).toBe('user:start:control');

    IntersectionObserverMock.trigger($carousel, {intersectionRatio: 0, isIntersecting: false});
    await microtask();
    expect(plugin.paused).toBe(false);
    expect(plugin.blocked).toBe(true);
    expect(plugin.state).toBe('blocked');
    expect($trigger.getAttribute('autoplay-state')).toBe('blocked');
    expect($trigger.getAttribute('aria-pressed')).toBe('false');

    IntersectionObserverMock.trigger($carousel, {intersectionRatio: 1, isIntersecting: true});
    await microtask();
    expect(plugin.blocked).toBe(false);
    expect(plugin.state).toBe('active');
    expect($trigger.getAttribute('autoplay-state')).toBe('active');

  });

  test('separate stop control toggles stop/start lifecycle', async () => {
    const {$carousel, $trigger} = await createControlSetup('stop');
    const events: ESLCarouselAutoplayEvent[] = [];
    $carousel.addEventListener(ESLCarouselAutoplayEvent.NAME, (e) => events.push(e as ESLCarouselAutoplayEvent));
    const plugin = ESLCarouselAutoplayMixin.get($carousel)!;

    expect(plugin.enabled).toBe(true);
    expect(plugin.active).toBe(true);

    $trigger.click();
    await microtask();
    expect(plugin.enabled).toBe(false);
    expect(plugin.paused).toBe(false);
    expect(plugin.active).toBe(false);
    expect(plugin.state).toBe('disabled');
    expect($trigger.getAttribute('autoplay-state')).toBe('disabled');
    expect($trigger.getAttribute('aria-pressed')).toBe('false');
    expect(events.at(-1)?.reason).toBe('user:stop:control');

    $trigger.click();
    await microtask();
    expect(plugin.enabled).toBe(true);
    expect(plugin.active).toBe(true);
    expect(plugin.state).toBe('active');
    expect($trigger.getAttribute('autoplay-state')).toBe('active');
    expect($trigger.getAttribute('aria-pressed')).toBe('true');
    expect(events.at(-1)?.reason).toBe('user:start:control');

  });

  test('control exposes unavailable state when target autoplay plugin is missing', async () => {
    const $trigger = document.createElement('button');
    $trigger.setAttribute('esl-carousel-autoplay-control', 'pause');
    document.body.appendChild($trigger);
    await microtask();

    expect($trigger.hasAttribute('disabled')).toBe(true);
    expect($trigger.getAttribute('autoplay-state')).toBe('unavailable');
    expect($trigger.getAttribute('aria-controls')).toBeNull();
    expect($trigger.getAttribute('aria-pressed')).toBe('false');
  });

  test('control exposes idle state when autoplay is enabled but no cycle is scheduled', async () => {
    const {$trigger} = await createControlSetup('pause', '{duration: 0, blockBehaviour: "pause"}');

    expect($trigger.getAttribute('autoplay-state')).toBe('idle');
    expect($trigger.getAttribute('aria-pressed')).toBe('false');
  });
});

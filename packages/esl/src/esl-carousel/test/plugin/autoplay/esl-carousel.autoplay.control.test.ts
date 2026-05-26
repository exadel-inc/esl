import {ESLCarousel} from '../../../core/esl-carousel';
import {ESLCarouselDummyRenderer} from '../../common/esl-carousel.dummy.renderer';
import {ESLCarouselAutoplayMixin} from '../../../plugin/autoplay/esl-carousel.autoplay.mixin';
import {ESLCarouselAutoplayEvent} from '../../../plugin/autoplay/esl-carousel.autoplay.event';
import {IntersectionObserverMock} from '../../../../test/intersectionObserver.mock';

vi.mock('../../../../esl-utils/dom/ready', () => ({
  onDocumentReady: (cb: any) => cb()
}));

describe('ESLCarousel: Autoplay Plugin Controls', () => {
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

  afterEach(() => {
    document.querySelectorAll('esl-carousel').forEach(($el) => $el.remove());
    vi.clearAllTimers();
  });

  const microtask = () => Promise.resolve();

  const createControlSetup = async (autoplayConfig: string) => {
    const $carousel = ESLCarousel.create();
    vi.spyOn($carousel, 'canNavigate').mockReturnValue(true);
    const $trigger = document.createElement('button');
    $carousel.appendChild($trigger);
    $carousel.setAttribute('esl-carousel-autoplay', autoplayConfig);
    document.body.appendChild($carousel);
    await microtask();
    IntersectionObserverMock.trigger($carousel, {intersectionRatio: 1, isIntersecting: true});
    return {$carousel, $trigger};
  };

  test('controlBehaviour=pause toggles pause/resume and keeps plugin enabled', async () => {
    const {$carousel, $trigger} = await createControlSetup('{duration: 1000, control: "button", controlBehaviour: "pause"}');
    const events: ESLCarouselAutoplayEvent[] = [];
    $carousel.addEventListener(ESLCarouselAutoplayEvent.NAME, (e) => events.push(e as ESLCarouselAutoplayEvent));
    const plugin = ESLCarouselAutoplayMixin.get($carousel)!;

    expect(plugin.enabled).toBe(true);
    expect(plugin.active).toBe(true);

    $trigger.click();
    await microtask();
    expect(plugin.enabled).toBe(true);
    expect(plugin.paused).toBe(true);
    expect(plugin.active).toBe(false);

    $trigger.click();
    await microtask();
    expect(plugin.enabled).toBe(true);
    expect(plugin.paused).toBe(false);
    expect(plugin.active).toBe(true);
    expect(events.at(-1)?.reason).toBe('user:start:control');

  });

  test('controlBehaviour=restart toggles stop/start lifecycle', async () => {
    const {$carousel, $trigger} = await createControlSetup('{duration: 1000, control: "button", controlBehaviour: "restart"}');
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
    expect(events.at(-1)?.reason).toBe('user:stop:control');

    $trigger.click();
    await microtask();
    expect(plugin.enabled).toBe(true);
    expect(plugin.active).toBe(true);
    expect(events.at(-1)?.reason).toBe('user:start:control');

  });
});

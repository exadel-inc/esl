import {ESLCarousel} from '../../../core/esl-carousel';
import {ESLCarouselDummyRenderer} from '../../common/esl-carousel.dummy.renderer';
import {ESLCarouselAutoplayMixin} from '../../../plugin/autoplay/esl-carousel.autoplay.mixin';
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

  describe('ESLCarouselAutoplayMixin: supports control definition', () => {
    const $carousel = ESLCarousel.create();
    $carousel.setAttribute('esl-carousel-autoplay', '{control: "button"}');
    const $trigger = document.createElement('button');

    beforeAll(() => {
      document.body.appendChild($carousel);
      document.body.appendChild($trigger);
    });
    afterAll(() => {
      document.body.removeChild($carousel);
      document.body.removeChild($trigger);
    });

    test('Plugin is enabled by default', async () => {
      expect(ESLCarouselAutoplayMixin.get($carousel)?.enabled).toBe(true);
    });

    test('Plugin toggles autoplay on control click', async () => {
      const plugin = ESLCarouselAutoplayMixin.get($carousel)!;
      const enabled = plugin.enabled;
      $trigger.click();
      await Promise.resolve();
      expect(plugin.enabled).toBe(!enabled);
      $trigger.click();
      await Promise.resolve();
      expect(plugin.enabled).toBe(enabled);
    });
  });
});

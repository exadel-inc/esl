import {ESLCarousel} from '../../core/esl-carousel';
import {ESLCarouselDummyRenderer} from './esl-carousel.dummy.renderer';

export function createDummyCarousel(size: number): {$carousel: ESLCarousel, $slides: HTMLElement[]} {
  ESLCarousel.register();
  ESLCarouselDummyRenderer.register();

  const $carousel = ESLCarousel.create();
  const $slides = Array.from({length: size}, () => {
    const $el = document.createElement('div');
    $el.setAttribute('esl-carousel-slide', '');
    return $el;
  });

  beforeAll(async () => {
    document.body.appendChild($carousel);
    await ESLCarousel.registered;
    $slides.forEach(($slide) => $carousel.addSlide($slide));
  });
  afterAll(() => document.body.removeChild($carousel));

  return {$carousel, $slides};
}

import {ESLCarousel} from '../../core/esl-carousel';
import {ESLCarouselSlide} from '../../core/esl-carousel.slide';
import {ESLCarouselDummyRenderer} from '../common/esl-carousel.dummy.renderer';

describe('ESLCarousel: DOM manipulation', () => {
  const twoTicks = () => Promise.resolve().then(() => Promise.resolve());

  beforeAll(() => {
    ESLCarousel.register();
    ESLCarouselDummyRenderer.register();
  });

  describe('ESLCarouselSlide ensure connection to the carousel inside the slide area', () => {
    const $carousel = ESLCarousel.create();

    beforeEach(async () => {
      document.body.appendChild($carousel);
      await ESLCarousel.registered;
    });
    afterAll(() => document.body.innerHTML = '');

    test('DOM element marked as slide outside carousel does not move itself', async () => {
      const $slide = document.createElement('div');
      $slide.setAttribute('esl-carousel-slide', '');
      document.body.appendChild($slide);
      await Promise.resolve();
      expect($slide.parentElement).toBe(document.body);
    });

    test('DOM element marked as slide inside carousel moves itself to the carousel area', async () => {
      jest.spyOn(console, 'debug').mockImplementationOnce(() => {});
      const $slide = document.createElement('div');
      $slide.setAttribute('esl-carousel-slide', '');
      $carousel.appendChild($slide);
      await twoTicks();
      expect($slide.parentElement).toBe($carousel.$slidesArea);
    });

    test('DOM element marked as slide inside carousel area does not process twice', async () => {
      const $slide = document.createElement('div');
      $slide.setAttribute('esl-carousel-slide', '');
      $carousel.$slidesArea.appendChild($slide);
      const connectedCallbackSpy = jest.spyOn(ESLCarouselSlide.prototype, 'connectedCallback' as any);
      await twoTicks();
      expect($carousel.$slides).toContain($slide);
      expect($slide.parentElement).toBe($carousel.$slidesArea);
      expect(connectedCallbackSpy).toHaveBeenCalledTimes(1);
    });

    test('Usage of the ESLCarousel.addSlide method creates proper slide', async () => {
      const $slide = document.createElement('div');
      $carousel.addSlide($slide);
      await twoTicks();
      expect($carousel.$slides).toContain($slide);
      expect($slide.parentElement).toBe($carousel.$slidesArea);
    });

    test('Removal of the slide ensures carousel be aware of it', async () => {
      const $slide = document.createElement('div');
      $carousel.addSlide($slide);
      await twoTicks();
      expect($carousel.$slides).toContain($slide);
      expect($slide.parentElement).toBe($carousel.$slidesArea);
      $slide.remove();
      await twoTicks();
      expect($carousel.$slides).not.toContain($slide);
      expect($slide.parentElement).toBe(null);
    });
  });

  describe('ESLCarousel manipulation does not affect slides', () => {
    const $carousel = ESLCarousel.create();
    const $slides = Array.from({length: 2}, () => {
      const $slide = document.createElement('div');
      $slide.setAttribute('esl-carousel-slide', '');
      return $slide;
    });

    beforeEach(async () => {
      document.body.appendChild($carousel);
      await ESLCarousel.registered;
      $slides.forEach(($slide) => $carousel.addSlide($slide));
      await twoTicks();
    });
    afterAll(() => document.body.innerHTML = '');

    test('Carousel removal does not affect slides', async () => {
      $carousel.remove();
      await twoTicks();
      $slides.forEach(($slide) => expect($slide.parentElement).toBe($carousel.$slidesArea));
    });

    test('Carousel movement does not affect slides', async () => {
      const $someParent = document.createElement('div');
      document.body.appendChild($someParent);
      $someParent.appendChild($carousel);
      await twoTicks();
      expect($carousel.parentElement).toBe($someParent);
      expect($carousel.$slides).toEqual($slides);
    });
  });
});

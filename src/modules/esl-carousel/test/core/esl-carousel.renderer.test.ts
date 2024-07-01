import {ESLCarousel} from '../../core/esl-carousel';
import {ESLCarouselDummyRenderer} from '../common/esl-carousel.dummy.renderer';

jest.mock('../../../esl-utils/dom/ready', () => ({
  onDocumentReady: (cb: any) => cb()
}));

describe('ESLCarouselRenderer: base class tests', () => {
  ESLCarousel.register();
  ESLCarouselDummyRenderer.register();

  describe('Slide markers defined correctly (`setActive` method of the base class)', () => {
    const $carousel = ESLCarousel.create();
    const $slides = Array.from({length: 5}, () => {
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

    test('Carousel size defined correctly', () => {
      expect($carousel.size).toBe(5);
    });

    describe('3 slides visible, no loop', () => {
      beforeAll(async () => {
        $carousel.count = '3';
        $carousel.loop = 'false';
        await Promise.resolve();
      });

      test('Renderer initialized correctly', () => {
        expect($carousel.renderer).toBeInstanceOf(ESLCarouselDummyRenderer);
      });
      test('Carousel config defined correctly', () => {
        expect($carousel.config).toEqual(expect.objectContaining({count: 3, size: 5, loop: false}));
      });

      test('First slide set active slides defined correctly', () => {
        $carousel.renderer.setActive(0);
        expect($carousel.$slides.map(ESLCarousel.prototype.isActive)).toEqual([true, true, true, false, false]);
      });
      test('Middle slide set active slides defined correctly', () => {
        $carousel.renderer.setActive(1);
        expect($carousel.$slides.map(ESLCarousel.prototype.isActive)).toEqual([false, true, true, true, false]);
      });
      test('Last slide set active slides defined correctly', () => {
        $carousel.renderer.setActive(2);
        expect($carousel.$slides.map(ESLCarousel.prototype.isActive)).toEqual([false, false, true, true, true]);
      });

      test('First slide set next marker defined correctly', () => {
        $carousel.renderer.setActive(0);
        expect($carousel.$slides.map(ESLCarousel.prototype.isNext)).toEqual([false, false, false, true, false]);
      });
      test('Middle slide set next marker defined correctly', () => {
        $carousel.renderer.setActive(1);
        expect($carousel.$slides.map(ESLCarousel.prototype.isNext)).toEqual([false, false, false, false, true]);
      });
      test('Last slide set next marker defined correctly', () => {
        $carousel.renderer.setActive(2);
        expect($carousel.$slides.map(ESLCarousel.prototype.isNext)).toEqual([false, false, false, false, false]);
      });

      test('First slide set prev marker defined correctly', () => {
        $carousel.renderer.setActive(0);
        expect($carousel.$slides.map(ESLCarousel.prototype.isPrev)).toEqual([false, false, false, false, false]);
      });
      test('Middle slide set prev marker defined correctly', () => {
        $carousel.renderer.setActive(1);
        expect($carousel.$slides.map(ESLCarousel.prototype.isPrev)).toEqual([true, false, false, false, false]);
      });
      test('Last slide set prev marker defined correctly', () => {
        $carousel.renderer.setActive(2);
        expect($carousel.$slides.map(ESLCarousel.prototype.isPrev)).toEqual([false, true, false, false, false]);
      });
    });

    describe('3 slides visible, loop', () => {
      beforeAll(async () => {
        $carousel.count = '3';
        $carousel.loop = 'true';
        await Promise.resolve();
      });

      test('Renderer initialized correctly', () => {
        expect($carousel.renderer).toBeInstanceOf(ESLCarouselDummyRenderer);
      });
      test('Carousel config defined correctly', () => {
        expect($carousel.config).toEqual(expect.objectContaining({count: 3, size: 5, loop: true}));
      });

      test('First slide set active slides defined correctly', () => {
        $carousel.renderer.setActive(0);
        expect($carousel.$slides.map(ESLCarousel.prototype.isActive)).toEqual([true, true, true, false, false]);
      });
      test('Second slide set active slides defined correctly', () => {
        $carousel.renderer.setActive(1);
        expect($carousel.$slides.map(ESLCarousel.prototype.isActive)).toEqual([false, true, true, true, false]);
      });
      test('Third slide set active slides defined correctly', () => {
        $carousel.renderer.setActive(2);
        expect($carousel.$slides.map(ESLCarousel.prototype.isActive)).toEqual([false, false, true, true, true]);
      });
      test('Fourth slide set active slides defined correctly', () => {
        $carousel.renderer.setActive(3);
        expect($carousel.$slides.map(ESLCarousel.prototype.isActive)).toEqual([true, false, false, true, true]);
      });
      test('Fifth slide set active slides defined correctly', () => {
        $carousel.renderer.setActive(4);
        expect($carousel.$slides.map(ESLCarousel.prototype.isActive)).toEqual([true, true, false, false, true]);
      });

      test('First slide set next marker defined correctly', () => {
        $carousel.renderer.setActive(0);
        expect($carousel.$slides.map(ESLCarousel.prototype.isNext)).toEqual([false, false, false, true, false]);
      });
      test('Second slide set next marker defined correctly', () => {
        $carousel.renderer.setActive(1);
        expect($carousel.$slides.map(ESLCarousel.prototype.isNext)).toEqual([false, false, false, false, true]);
      });
      test('Third slide set next marker defined correctly', () => {
        $carousel.renderer.setActive(2);
        expect($carousel.$slides.map(ESLCarousel.prototype.isNext)).toEqual([true, false, false, false, false]);
      });
      test('Fourth slide set next marker defined correctly', () => {
        $carousel.renderer.setActive(3);
        expect($carousel.$slides.map(ESLCarousel.prototype.isNext)).toEqual([false, true, false, false, false]);
      });
      test('Fifth slide set next marker defined correctly', () => {
        $carousel.renderer.setActive(4);
        expect($carousel.$slides.map(ESLCarousel.prototype.isNext)).toEqual([false, false, true, false, false]);
      });

      test('First slide set prev marker defined correctly', () => {
        $carousel.renderer.setActive(0);
        expect($carousel.$slides.map(ESLCarousel.prototype.isPrev)).toEqual([false, false, false, false, true]);
      });
      test('Second slide set prev marker defined correctly', () => {
        $carousel.renderer.setActive(1);
        expect($carousel.$slides.map(ESLCarousel.prototype.isPrev)).toEqual([true, false, false, false, false]);
      });
      test('Third slide set prev marker defined correctly', () => {
        $carousel.renderer.setActive(2);
        expect($carousel.$slides.map(ESLCarousel.prototype.isPrev)).toEqual([false, true, false, false, false]);
      });
      test('Fourth slide set prev marker defined correctly', () => {
        $carousel.renderer.setActive(3);
        expect($carousel.$slides.map(ESLCarousel.prototype.isPrev)).toEqual([false, false, true, false, false]);
      });
      test('Fifth slide set prev marker defined correctly', () => {
        $carousel.renderer.setActive(4);
        expect($carousel.$slides.map(ESLCarousel.prototype.isPrev)).toEqual([false, false, false, true, false]);
      });
    });

    describe('5 slides visible (full), no loop', () => {
      beforeAll(async () => {
        $carousel.count = '5';
        $carousel.loop = 'false';
        await Promise.resolve();
      });

      test('Carousel config defined correctly', () => {
        expect($carousel.config).toEqual(expect.objectContaining({count: 5, size: 5, loop: false}));
      });

      test('The only slide set have all active slides', () => {
        $carousel.renderer.setActive(0);
        expect($carousel.$slides.map(ESLCarousel.prototype.isActive)).toEqual([true, true, true, true, true]);
      });
      test('The only slide set have no next slides', () => {
        $carousel.renderer.setActive(0);
        expect($carousel.$slides.map(ESLCarousel.prototype.isNext)).toEqual([false, false, false, false, false]);
      });
      test('The only slide set have no prev slides', () => {
        $carousel.renderer.setActive(0);
        expect($carousel.$slides.map(ESLCarousel.prototype.isPrev)).toEqual([false, false, false, false, false]);
      });
    });

    describe('5 slides visible (full), loop', () => {
      beforeAll(async () => {
        $carousel.count = '5';
        $carousel.loop = 'true';
        await Promise.resolve();
      });

      test('Carousel config defined correctly', () => {
        expect($carousel.config).toEqual(expect.objectContaining({count: 5, size: 5, loop: true}));
      });

      test('First slide set have all active slides', () => {
        $carousel.renderer.setActive(0);
        expect($carousel.$slides.map(ESLCarousel.prototype.isActive)).toEqual([true, true, true, true, true]);
      });
      test('First slide set have no next slides', () => {
        $carousel.renderer.setActive(0);
        expect($carousel.$slides.map(ESLCarousel.prototype.isNext)).toEqual([false, false, false, false, false]);
      });
      test('First slide set have no prev slides', () => {
        $carousel.renderer.setActive(0);
        expect($carousel.$slides.map(ESLCarousel.prototype.isPrev)).toEqual([false, false, false, false, false]);
      });
    });
  });
});

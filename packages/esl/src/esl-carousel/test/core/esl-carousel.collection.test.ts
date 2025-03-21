import {ESLCarousel} from '../../core';

describe('ESLCarousel: Slides Collection methods', () => {
  class CarouselMock extends ESLCarousel {
    public static override readonly is = 'esl-carousel-dummy';

    public mockSlides: HTMLElement[] = [];

    public override get $slides(): HTMLElement[] { return this.mockSlides; }

    public setMockActiveSlides(slides: boolean[]): void {
      this.mockSlides = slides.map((active, index) => {
        const slide = document.createElement('div');
        slide.setAttribute('esl-carousel-slide', '');
        slide.toggleAttribute('active', active);
        return slide;
      });
    }
  }
  CarouselMock.register();

  describe('ESlCarousel#activeIndex and ESlCarousel#$activeSlide resolves start active slide form carousel collection', () => {
    const mock = new CarouselMock();
    mock.count = '3';

    test('No slides', () => {
      mock.setMockActiveSlides([]);
      expect(mock.activeIndex).toBe(-1);
      expect(mock.$activeSlide).toBe(undefined);
    });
    test('No active slides', () => {
      mock.setMockActiveSlides([false, false, false]);
      expect(mock.activeIndex).toBe(-1);
      expect(mock.$activeSlide).toBe(undefined);
    });
    test('One active slide', () => {
      mock.setMockActiveSlides([true]);
      expect(mock.activeIndex).toBe(0);
      expect(mock.$activeSlide).toBe(mock.$slides[0]);
    });
    test('One active group', () => {
      mock.setMockActiveSlides([true, true, true]);
      expect(mock.activeIndex).toBe(0);
      expect(mock.$activeSlide).toBe(mock.$slides[0]);
    });
    test('Full carousel first slide active', () => {
      mock.setMockActiveSlides([true, false, false, false, false]);
      expect(mock.activeIndex).toBe(0);
      expect(mock.$activeSlide).toBe(mock.$slides[0]);
    });
    test('Full carousel last slide active', () => {
      mock.setMockActiveSlides([false, false, false, false, true]);
      expect(mock.activeIndex).toBe(4);
      expect(mock.$activeSlide).toBe(mock.$slides[4]);
    });
    test('Full carousel middle slide active', () => {
      mock.setMockActiveSlides([false, false, true, false, false]);
      expect(mock.activeIndex).toBe(2);
      expect(mock.$activeSlide).toBe(mock.$slides[2]);
    });
    test('Full carousel first group active', () => {
      mock.setMockActiveSlides([true, true, true, false, false]);
      expect(mock.activeIndex).toBe(0);
      expect(mock.$activeSlide).toBe(mock.$slides[0]);
    });
    test('Full carousel last group active', () => {
      mock.setMockActiveSlides([false, false, true, true, true]);
      expect(mock.activeIndex).toBe(2);
      expect(mock.$activeSlide).toBe(mock.$slides[2]);
    });
    test('Full carousel middle group active', () => {
      mock.setMockActiveSlides([false, true, true, true, false]);
      expect(mock.activeIndex).toBe(1);
      expect(mock.$activeSlide).toBe(mock.$slides[1]);
    });
    test('Full carousel cross group active', () => {
      mock.setMockActiveSlides([true, false, false, false, true]);
      expect(mock.activeIndex).toBe(4);
      expect(mock.$activeSlide).toBe(mock.$slides[4]);
    });
    test('Full carousel cross group active (long start)', () => {
      mock.setMockActiveSlides([true, false, false, true, true]);
      expect(mock.activeIndex).toBe(3);
      expect(mock.$activeSlide).toBe(mock.$slides[3]);
    });
    test('Full carousel cross group active (long tile)', () => {
      mock.setMockActiveSlides([true, true, false, false, true]);
      expect(mock.activeIndex).toBe(4);
      expect(mock.$activeSlide).toBe(mock.$slides[4]);
    });
  });

  describe('ESlCarousel#activeIndexes and ESlCarousel#$activeSlides resolves active slides indexes form carousel collection', () => {
    const mock = new CarouselMock();
    mock.count = '3';

    test('No slides', () => {
      mock.setMockActiveSlides([]);
      expect(mock.activeIndexes).toEqual([]);
      expect(mock.$activeSlides).toEqual([]);
    });
    test('No active slides', () => {
      mock.setMockActiveSlides([false, false, false]);
      expect(mock.activeIndexes).toEqual([]);
      expect(mock.$activeSlides).toEqual([]);
    });
    test('One active slide', () => {
      mock.setMockActiveSlides([true]);
      expect(mock.activeIndexes).toEqual([0]);
      expect(mock.$activeSlides).toEqual([mock.$slides[0]]);
    });
    test('One active group', () => {
      mock.setMockActiveSlides([true, true, true]);
      expect(mock.activeIndexes).toEqual([0, 1, 2]);
      expect(mock.$activeSlides).toEqual([mock.$slides[0], mock.$slides[1], mock.$slides[2]]);
    });
    test('Full carousel first slide active', () => {
      mock.setMockActiveSlides([true, false, false, false, false]);
      expect(mock.activeIndexes).toEqual([0]);
      expect(mock.$activeSlides).toEqual([mock.$slides[0]]);
    });
    test('Full carousel last slide active', () => {
      mock.setMockActiveSlides([false, false, false, false, true]);
      expect(mock.activeIndexes).toEqual([4]);
      expect(mock.$activeSlides).toEqual([mock.$slides[4]]);
    });
    test('Full carousel middle slide active', () => {
      mock.setMockActiveSlides([false, false, true, false, false]);
      expect(mock.activeIndexes).toEqual([2]);
      expect(mock.$activeSlides).toEqual([mock.$slides[2]]);
    });
    test('Full carousel first group active', () => {
      mock.setMockActiveSlides([true, true, true, false, false]);
      expect(mock.activeIndexes).toEqual([0, 1, 2]);
      expect(mock.$activeSlides).toEqual([mock.$slides[0], mock.$slides[1], mock.$slides[2]]);
    });
    test('Full carousel last group active', () => {
      mock.setMockActiveSlides([false, false, true, true, true]);
      expect(mock.activeIndexes).toEqual([2, 3, 4]);
      expect(mock.$activeSlides).toEqual([mock.$slides[2], mock.$slides[3], mock.$slides[4]]);
    });
    test('Full carousel middle group active', () => {
      mock.setMockActiveSlides([false, true, true, true, false]);
      expect(mock.activeIndexes).toEqual([1, 2, 3]);
      expect(mock.$activeSlides).toEqual([mock.$slides[1], mock.$slides[2], mock.$slides[3]]);
    });
    test('Full carousel cross group active', () => {
      mock.setMockActiveSlides([true, false, false, false, true]);
      expect(mock.activeIndexes).toEqual([4, 0]);
      expect(mock.$activeSlides).toEqual([mock.$slides[4], mock.$slides[0]]);
    });
    test('Full carousel cross group active (long start)', () => {
      mock.setMockActiveSlides([true, false, false, true, true]);
      expect(mock.activeIndexes).toEqual([3, 4, 0]);
      expect(mock.$activeSlides).toEqual([mock.$slides[3], mock.$slides[4], mock.$slides[0]]);
    });
    test('Full carousel cross group active (long tile)', () => {
      mock.setMockActiveSlides([true, true, false, false, true]);
      expect(mock.activeIndexes).toEqual([4, 0, 1]);
      expect(mock.$activeSlides).toEqual([mock.$slides[4], mock.$slides[0], mock.$slides[1]]);
    });
  });
});

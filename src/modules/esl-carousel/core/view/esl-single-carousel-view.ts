import {promisifyEvent, resolvePromise} from '../../../esl-utils/async/promise';
import {ESLCarouselView} from './esl-carousel-view';

import type {ESLCarousel, CarouselDirection} from '../esl-carousel';

export class ESLSingleCarouselView extends ESLCarouselView {

  public static is = 'single-carousel';

  protected currentIndex: number = 0;

  public constructor(carousel: ESLCarousel) {
    super(carousel);
  }

  public bind() {
    this.carousel.classList.add(ESLSingleCarouselView.is);
    this.draw();
  }
  public unbind() {
    this.carousel.classList.remove(ESLSingleCarouselView.is);
  }

  // TODO: check
  public draw() {
    const {$slides, $slidesArea} = this.carousel;
    if (!$slidesArea || !$slides.length) return;

    const slideStyles = getComputedStyle($slides[this.carousel.firstIndex]);
    const slidesAreaStyles = getComputedStyle($slidesArea);

    const slideWidth = parseFloat(slidesAreaStyles.width) - parseFloat(slideStyles.marginLeft) - parseFloat(slideStyles.marginRight);

    $slides.forEach((slide) => {
      slide.style.minWidth = slideWidth + 'px';
    });
  }

  public async onBeforeAnimate() {
    if (this.carousel.hasAttribute('animate')) return Promise.reject();
    return Promise.resolve();
  }

  public async onAnimate(nextIndex: number, direction: CarouselDirection) {
    this.carousel.toggleAttribute('animate', true);
    this.carousel.setAttribute('direction', direction);

    const activeSlide = this.carousel.$slides[this.carousel.firstIndex];
    const nextSlide = this.carousel.$slides[nextIndex];

    activeSlide.classList.add(direction);
    nextSlide.classList.add(direction);

    activeSlide.classList.add('previous');

    // TODO: !
    return promisifyEvent(this.carousel.$slidesArea!, 'animationend')
      .catch(resolvePromise);
  }

  public async onAfterAnimate() {
    this.carousel.toggleAttribute('animate', false);
    this.carousel.removeAttribute('direction');
    this.carousel.$slides.forEach((slide) => {
      slide.classList.remove('next');
      slide.classList.remove('prev');
      slide.classList.remove('previous');
    });

    return Promise.resolve();
  }

  // TODO: discuss the max offset width
  public onMove(offset: number) {
    // const width = parseFloat(getComputedStyle(this.carousel.$activeSlide as Element).width);
    //
    // if (Math.abs(offset) > width) return;
    //
    // this.carousel.$slides.forEach((el) => el.toggleAttribute('visible', true));
    // this.carousel.$slidesArea!.style.left = `-${this.carousel.$activeSlide?.offsetLeft}px`;
    //
    // this.carousel.$slidesArea!.style.transform = `translateX(${offset}px)`;
    //
    // const count = Math.floor(Math.abs(offset) / width);
    // const sign = offset < 0 ? 1 : -1;
    //
    // this.currentIndex = this.carousel.normalizeIndex(this.carousel.firstIndex + count * sign);
  }

  public async commit(direction: CarouselDirection) {
    // // if (this.carousel.hasAttribute('animate')) return;
    // const width = parseFloat(getComputedStyle(this.carousel.$activeSlide as Element).width);
    //
    // this.carousel.toggleAttribute('animate', true);
    // this.carousel.$slidesArea!.style.transform = `translateX(-${width * this.currentIndex}px)`;
    //
    // await promisifyEvent(this.carousel.$slidesArea!, 'transitionend').catch(resolvePromise);
    //
    // // TODO: fix direction
    // const $activeSlide = this.carousel.$activeSlide;
    // const $nextSlide = direction === 'prev' ? $activeSlide?.$next : $activeSlide?.$prev;
    // this.carousel.$activeSlide!.active = false;
    // $nextSlide!.active = true;
    //
    // this.carousel.$slides.forEach((el) => el.toggleAttribute('visible', false));
    // this.carousel.$slidesArea!.style.left = '0';
    // this.carousel.$slidesArea!.style.transform = 'translateX(0px)';
    // this.carousel.toggleAttribute('animate', false);
    //
    // // TODO: change info
    // this.carousel.$$fire('slide:changed', {
    //   detail: {direction}
    // });
  }
}

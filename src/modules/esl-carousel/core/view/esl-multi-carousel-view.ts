import {promisifyNextRender} from '../../../esl-utils/async/raf';
import {promisifyEvent, repeatSequence, resolvePromise} from '../../../esl-utils/async/promise';
import {ESLCarouselView} from './esl-carousel-view';

import type {ESLCarousel, CarouselDirection} from '../esl-carousel';
import type {ESLCarouselSlide} from '../esl-carousel-slide';

export class ESLMultiCarouselView extends ESLCarouselView {

  public static is = 'multi-carousel';

  protected currentIndex: number = 0;

  public constructor(carousel: ESLCarousel) {
    super(carousel);
  }

  public bind() {
    this.carousel.classList.add(ESLMultiCarouselView.is);
    this.draw();
  }
  public unbind() {
    this.carousel.classList.remove(ESLMultiCarouselView.is);

    this.carousel.$slides.forEach((el) => el.toggleAttribute('visible', false));
    this.carousel.$slidesArea!.style.transform = 'translateX(0px)';
    this.carousel.$slides.forEach((el) => {
      el.style.order = '0';
    });
    this.carousel.toggleAttribute('animate', false);
  }

  public nextIndex(direction: CarouselDirection) {
    const offset = direction === 'next' ? this.carousel.activeCount : -1;
    return this.carousel.normalizeIndex(this.currentIndex + offset);
  }

  protected getDistance(slide: ESLCarouselSlide | number, direction: CarouselDirection) {
    if (typeof slide !== 'number') slide = slide.index;
    let count = 0;
    if (direction === 'prev') {
      count = this.carousel.normalizeIndex(this.carousel.firstIndex - slide);
    } else if (direction === 'next') {
      count = this.carousel.normalizeIndex(slide - this.carousel.firstIndex);
    }
    return count;
  }

  public draw() {
    const {$slides, $slidesArea} = this.carousel;
    if (!$slidesArea || !$slides.length) return;

    const slideStyles = getComputedStyle($slides[this.carousel.firstIndex]);
    const slidesAreaStyles = getComputedStyle($slidesArea);

    const slideWidth = parseFloat(slidesAreaStyles.width) / this.carousel.activeCount
      - parseFloat(slideStyles.marginLeft) - parseFloat(slideStyles.marginRight);
    $slides.forEach((slide) => {
      slide.style.minWidth = slideWidth + 'px';
    });

    this.currentIndex = this.carousel.firstIndex;
    this._setOrderFrom(this.currentIndex);
  }

  public async onBeforeAnimate() {
    if (this.carousel.hasAttribute('animate')) return Promise.reject();
    return Promise.resolve();
  }

  public onAnimate(nextIndex: number, direction: CarouselDirection) {
    this.currentIndex = this.carousel.firstIndex;

    const animateSlide = () =>
      this.onBeforeStepAnimate(direction)
        .then(() => this.onStepAnimate(direction))
        .then(() => this.onAfterStepAnimate(direction));

    return repeatSequence(animateSlide, this.getDistance(nextIndex, direction));
  }

  public async onAfterAnimate() {
    this.carousel.$slidesArea!.style.transform = 'none';
    return Promise.resolve();
  }

  protected async onBeforeStepAnimate(direction: CarouselDirection): Promise<void> {
    this.carousel.$slides.forEach((el) => el.toggleAttribute('visible'));

    const orderIndex = direction === 'next' ? this.currentIndex : this.carousel.normalizeIndex(this.currentIndex - 1);
    this._setOrderFrom(orderIndex);

    const offsetIndex = direction === 'next' ? this.carousel.normalizeIndex(this.currentIndex + 1) : this.currentIndex;
    const offset = this.carousel.$slides[offsetIndex].offsetLeft;
    const shiftX = direction === 'next' ? 0 : -offset;
    this.carousel.$slidesArea!.style.transform = `translateX(${shiftX}px)`;

    return promisifyNextRender();
    // +this.carousel.$slidesArea!.offsetLeft;
    // return Promise.resolve();
  }

  protected async onStepAnimate(direction: CarouselDirection): Promise<void> {
    this.carousel.toggleAttribute('animate', true);

    const offsetIndex = direction === 'next' ? this.carousel.normalizeIndex(this.currentIndex + 1) : this.currentIndex;
    const offset = this.carousel.$slides[offsetIndex].offsetLeft;
    const shiftX = direction === 'next' ? -offset : 0;
    this.carousel.$slidesArea!.style.transform = `translateX(${shiftX}px)`;

    // TODO: !
    return promisifyEvent(this.carousel.$slidesArea!, 'transitionend')
      .catch(resolvePromise);
  }

  protected async onAfterStepAnimate(direction: CarouselDirection): Promise<void> {
    this.carousel.$slides.forEach((el) => el.toggleAttribute('visible', false));
    this.carousel.$slidesArea!.style.transform = 'translateX(0px)';

    this.currentIndex = direction === 'next' ? this.currentIndex + 1 : this.currentIndex - 1;
    this.currentIndex = this.carousel.normalizeIndex(this.currentIndex);

    this._setOrderFrom(this.currentIndex);

    this.carousel.toggleAttribute('animate', false);
    return Promise.resolve();
  }

  public onMove(offset: number) {
    this.carousel.$slides.forEach((el) => el.toggleAttribute('visible', true));

    const width = parseFloat(getComputedStyle(this.carousel.$slides[0]).width);
    const sign = offset < 0 ? 1 : -1;
    const count = Math.floor(Math.abs(offset) / width);

    this.currentIndex = this.carousel.normalizeIndex(this.carousel.firstIndex + count * sign);
    const orderIndex = offset < 0 ? this.currentIndex : this.carousel.normalizeIndex(this.currentIndex - 1);
    this._setOrderFrom(orderIndex);

    const stageOffset = offset < 0 ? offset + count * width : offset - (count + 1) * width;
    this.carousel.$slidesArea!.style.transform = `translateX(${stageOffset}px)`;
  }

  public async commit(direction?: CarouselDirection) {
    // if (this.carousel.hasAttribute('animate')) return;
    this.carousel.toggleAttribute('animate', true);
    this.carousel.$slidesArea!.style.transform = 'translateX(0px)';

    this.currentIndex = this.carousel.normalizeIndex(this.currentIndex);
    direction = direction || this.carousel.getDirection(this.carousel.firstIndex, this.currentIndex);
    this._setOrderFrom(this.currentIndex);

    this.carousel.$slides.forEach((el) => el.active = false);
    for (let i = 0; i < this.carousel.activeCount; i++) {
      this.carousel.slideAt(this.currentIndex + i).active = true;
    }
    await promisifyEvent(this.carousel.$slidesArea!, 'transitionend').catch(resolvePromise);

    this.carousel.$slides.forEach((el) => el.toggleAttribute('visible', false));
    this.carousel.toggleAttribute('animate', false);

    // TODO: change info
    this.carousel.$$fire('slide:changed', {
      detail: {direction}
    });
  }

  protected _setOrderFrom(index: number) {
    if (index < 0 || index > this.carousel.count) return;

    let $slide = this.carousel.$slides[index];
    for (let order = 0; order < this.carousel.count; order++) {
      $slide.style.order = String(order);
      $slide = $slide.$nextCyclic;
    }
  }
}

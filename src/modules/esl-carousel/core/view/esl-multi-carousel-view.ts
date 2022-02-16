import {promisifyNextRender} from '../../../esl-utils/async/raf';
import {promisifyEvent, repeatSequence, resolvePromise} from '../../../esl-utils/async/promise';

import {calcDirection, normalizeIndex} from '../esl-carousel-utils';
import {ESLCarouselView} from './esl-carousel-view';

import type {ESLCarouselSlide} from '../esl-carousel-slide';
import type {CarouselDirection} from '../esl-carousel-utils';


export class ESLMultiCarouselView extends ESLCarouselView {
  public static is = 'multi';

  protected currentIndex: number = 0;

  protected getDistance(slide: ESLCarouselSlide | number, direction: CarouselDirection): number {
    if (typeof slide !== 'number') slide = slide.index;
    let count = 0;
    if (direction === 'prev') {
      count = normalizeIndex(this.carousel.firstIndex - slide, this.size);
    } else if (direction === 'next') {
      count = normalizeIndex(slide - this.carousel.firstIndex, this.size);
    }
    return count;
  }

  public onBind(): void {
    const {$slides, $slidesArea} = this.carousel;
    if (!$slidesArea || !$slides.length) return;

    const slidesAreaStyles = getComputedStyle($slidesArea);
    this.slideWidth = parseFloat(slidesAreaStyles.width) / this.carousel.activeCount;
    $slides.forEach((slide) => slide.style.minWidth = this.slideWidth + 'px');

    this.currentIndex = this.carousel.firstIndex;
    this._setOrderFrom(this.currentIndex);
  }

  public onUnbind(): void {
    this.carousel.$slides.forEach((el) => {
      el.toggleAttribute('visible', false);
      el.style.removeProperty('order');
    });
    this.carousel.$slidesArea!.style.removeProperty('transform');
    this.carousel.toggleAttribute('animate', false);
  }

  public async onBeforeAnimate(): Promise<void> {
    if (this.carousel.hasAttribute('animate')) return Promise.reject();
    return Promise.resolve();
  }

  public onAnimate(nextIndex: number, direction: CarouselDirection): Promise<void> {
    this.currentIndex = this.carousel.firstIndex;

    const animateSlide = (): Promise<void> =>
      this.onBeforeStepAnimate(direction)
        .then(() => this.onStepAnimate(direction))
        .then(() => this.onAfterStepAnimate(direction));

    return repeatSequence(animateSlide, this.getDistance(nextIndex, direction));
  }

  public async onAfterAnimate(): Promise<void> {
    this.carousel.$slidesArea!.style.transform = 'none';
    return Promise.resolve();
  }

  protected async onBeforeStepAnimate(direction: CarouselDirection): Promise<void> {
    this.carousel.$slides.forEach((el) => el.toggleAttribute('visible'));

    const orderIndex = direction === 'next' ? this.currentIndex : normalizeIndex(this.currentIndex - 1, this.size);
    this._setOrderFrom(orderIndex);

    const offsetIndex = direction === 'next' ? normalizeIndex(this.currentIndex + 1, this.size) : this.currentIndex;
    const offset = this.carousel.$slides[offsetIndex].offsetLeft;
    const shiftX = direction === 'next' ? 0 : -offset;
    this.carousel.$slidesArea!.style.transform = `translateX(${shiftX}px)`;

    return promisifyNextRender();
  }

  protected async onStepAnimate(direction: CarouselDirection): Promise<void> {
    this.carousel.toggleAttribute('animate', true);

    const offsetIndex = direction === 'next' ? normalizeIndex(this.currentIndex + 1, this.size) : this.currentIndex;
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
    this.currentIndex = normalizeIndex(this.currentIndex, this.size);

    this._setOrderFrom(this.currentIndex);

    this.carousel.toggleAttribute('animate', false);
    return Promise.resolve();
  }

  public onMove(offset: number): void {
    this.carousel.$slides.forEach((el) => el.toggleAttribute('visible', true));

    const sign = offset < 0 ? 1 : -1;
    const count = Math.floor(Math.abs(offset) / this.slideWidth);

    const nextIndex = this.carousel.firstIndex + count * sign;
    if (nextIndex >= this.carousel.count || nextIndex < 0) return;

    const currentIndex = normalizeIndex(this.carousel.firstIndex + count * sign, this.size);
    if (offset > 0 && currentIndex - 1 < 0) return;
    if (offset < 0 && currentIndex + this.carousel.activeCount >= this.carousel.count) return;

    const orderIndex = offset < 0 ? currentIndex : normalizeIndex(currentIndex - 1, this.size);
    this._setOrderFrom(orderIndex);
    this.currentIndex = currentIndex;

    const stageOffset = offset < 0 ? offset + count * this.slideWidth : offset - (count + 1) * this.slideWidth;
    this.carousel.$slidesArea!.style.transform = `translateX(${stageOffset}px)`;
  }

  public async commit(offset: number): Promise<void> {
    // calculate offset to move to
    const shiftCount = Math.abs(offset) % this.slideWidth >= this.slideWidth / 4 ? 1 : 0;
    const stageOffset = offset < 0 ? -shiftCount * this.slideWidth : (shiftCount - 1) * this.slideWidth;

    this.carousel.toggleAttribute('animate', true);
    this.carousel.$slidesArea!.style.transform = `translateX(${stageOffset}px)`;

    await promisifyEvent(this.carousel.$slidesArea!, 'transitionend').catch(resolvePromise);

    // clear animation
    this.carousel.toggleAttribute('animate', false);
    this.carousel.$slidesArea!.style.transform = 'translateX(0)';
    this.carousel.$slides.forEach((el) => el.toggleAttribute('visible', false));

    const sign = offset < 0 ? 1 : -1;
    const count = Math.abs(offset) % this.slideWidth >= this.slideWidth / 4 ?
      Math.ceil(Math.abs(offset) / this.slideWidth) : Math.floor(Math.abs(offset) / this.slideWidth);
    const nextIndex = this.carousel.firstIndex + count * sign;

    if (!this.carousel.loop && offset > 0 && nextIndex - 1 < 0) {
      this.currentIndex = 0;
    } else if (!this.carousel.loop && offset < 0 && nextIndex + this.carousel.activeCount >= this.carousel.count) {
      this.currentIndex = this.carousel.count - this.carousel.activeCount;
    } else {
      this.currentIndex = normalizeIndex(nextIndex, this.size);
    }

    let direction = offset > 0 ? 'next' : 'prev'; // TODO
    direction = direction || calcDirection(this.carousel.firstIndex, this.currentIndex, this.size);
    this._setOrderFrom(this.currentIndex);

    this.carousel.$slides.forEach((el) => el.active = false);
    for (let i = 0; i < this.carousel.activeCount; i++) {
      this.carousel.slideAt(this.currentIndex + i).active = true;
    }

    // TODO: change info
    this.carousel.$$fire('slide:changed', {
      detail: {direction}
    });
  }

  protected _setOrderFrom(index: number): void {
    if (index < 0 || index > this.carousel.count) return;

    let $slide = this.carousel.$slides[index];
    for (let order = 0; order < this.carousel.count; order++) {
      $slide.style.order = String(order);
      $slide = $slide.$nextCyclic;
    }
  }
}

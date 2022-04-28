import {promisifyEvent, repeatSequence, resolvePromise} from '../../../esl-utils/async/promise';

import {calcDirection, normalizeIndex} from '../esl-carousel-utils';
import {ESLCarouselView} from './esl-carousel-view';

import type {ESLCarouselSlide} from '../esl-carousel-slide';
import type {CarouselDirection} from '../esl-carousel-utils';


export class ESLMultiCarouselView extends ESLCarouselView {
  public static is = 'multi';

  /** First index of active slides. */
  protected currentIndex: number = 0;

  /** Gets count of slides between active and passed considering given direction. */
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

  /**
   * Processes binding of defined view to the carousel {@link ESLCarousel}.
   * Prepare to view animation.
   */
  public onBind(): void {
    const {$slides, $slidesArea} = this.carousel;
    if (!$slidesArea || !$slides.length) return;

    const slidesAreaStyles = getComputedStyle($slidesArea);
    this.slideWidth = parseFloat(slidesAreaStyles.width) / this.carousel.activeCount;
    $slides.forEach((slide) => slide.style.minWidth = this.slideWidth + 'px');

    this.currentIndex = this.carousel.firstIndex;
    this._setOrderFrom(this.currentIndex);
  }

  /**
   * Processes unbinding of defined view from the carousel {@link ESLCarousel}.
   * Clear animation.
   */
  public onUnbind(): void {
    this.carousel.$slides.forEach((el) => {
      el.toggleAttribute('visible', false);
      el.style.removeProperty('order');
    });
    this.carousel.$slidesArea!.style.removeProperty('transform');
    this.carousel.toggleAttribute('animate', false);
  }

  /** Pre-processing animation action. */
  public async onBeforeAnimate(): Promise<void> {
    if (this.carousel.hasAttribute('animate')) return Promise.reject('Already animating');
    return Promise.resolve();
  }

  /** Processes animation. */
  public onAnimate(nextIndex: number, direction: CarouselDirection): Promise<void> {
    this.currentIndex = this.carousel.firstIndex;

    const animateSlide = (): Promise<void> =>
      this.onBeforeStepAnimate(direction).then(() => this.onAfterStepAnimate(direction));

    return repeatSequence(animateSlide, this.getDistance(nextIndex, direction));
  }

  /** Post-processing animation action. */
  public async onAfterAnimate(): Promise<void> {
    this.carousel.$slidesArea!.style.transform = 'translate3d(0px, 0px, 0px)';
    return Promise.resolve();
  }

  /** Pre-processing the transition animation of one slide. */
  protected async onBeforeStepAnimate(direction: CarouselDirection): Promise<void> {
    this.carousel.$slides.forEach((el) => el.toggleAttribute('visible'));

    const orderIndex = direction === 'next' ? this.currentIndex : normalizeIndex(this.currentIndex - 1, this.size);
    this._setOrderFrom(orderIndex);

    // // TODO: reflow
    const offsetIndex = direction === 'next' ? normalizeIndex(this.currentIndex + 1, this.size) : this.currentIndex;
    const offset = this.carousel.$slides[offsetIndex].offsetLeft;
    const shiftXBefore = direction === 'next' ? 0 : -offset;
    this.carousel.$slidesArea!.style.transform = `translate3d(${shiftXBefore}px, 0px, 0px)`;

    +this.carousel.offsetLeft;
    this.carousel.toggleAttribute('animate', true);

    const shiftXAfter = direction === 'next' ? -offset : 0;
    this.carousel.$slidesArea!.style.transform = `translate3d(${shiftXAfter}px, 0px, 0px)`;

    return new Promise((resolve) => {
      const cb = (e: TransitionEvent): void => {
        if (e.propertyName !== 'transform') return;
        this.carousel.$slidesArea?.removeEventListener('transitionend', cb);
        resolve();
      };
      this.carousel.$slidesArea?.addEventListener('transitionend', cb);
    });
  }

  /** Processes animation of one slide. */
  // protected async onStepAnimate(direction: CarouselDirection): Promise<void> {
  //   // TODO: move from
  //   // this.carousel.toggleAttribute('animate', true);
  //
  //   // TODO: take from before
  //   const offsetIndex = direction === 'next' ? normalizeIndex(this.currentIndex + 1, this.size) : this.currentIndex;
  //   const offset = this.carousel.$slides[offsetIndex].offsetLeft;
  //
  //   // TODO: !
  // }

  /** Post-processing the transition animation of one slide. */
  protected async onAfterStepAnimate(direction: CarouselDirection): Promise<void> {
    // TODO: onAfterAnimate
    this.carousel.$slides.forEach((el) => el.toggleAttribute('visible', false));
    this.carousel.$slidesArea!.style.transform = 'translate3d(0px, 0px, 0px)';

    this.currentIndex = direction === 'next' ? this.currentIndex + 1 : this.currentIndex - 1;
    this.currentIndex = normalizeIndex(this.currentIndex, this.size);

    this._setOrderFrom(this.currentIndex);

    this.carousel.toggleAttribute('animate', false);
    +this.carousel.offsetLeft;
    return Promise.resolve();
  }

  /** Handles the slides transition. */
  public onMove(offset: number): void {
    this.carousel.$slides.forEach((el) => el.toggleAttribute('visible', true));

    const sign = offset < 0 ? 1 : -1;
    const count = Math.floor(Math.abs(offset) / this.slideWidth);
    const nextIndex = this.carousel.firstIndex + count * sign;
    const currentIndex = normalizeIndex(this.carousel.firstIndex + count * sign, this.size);

    // check non-loop state
    if (!this.carousel.loop && nextIndex >= this.carousel.count || nextIndex < 0) return;
    // check left border of non-loop state
    if (!this.carousel.loop && offset > 0 && currentIndex - 1 < 0) return;
    // check right border of non-loop state
    if (!this.carousel.loop && offset < 0 && currentIndex + 1 + this.carousel.activeCount > this.carousel.count) return;

    const orderIndex = offset < 0 ? currentIndex : normalizeIndex(currentIndex - 1, this.size);
    this._setOrderFrom(orderIndex);
    this.currentIndex = currentIndex;

    const stageOffset = offset < 0 ? offset + count * this.slideWidth : offset - (count + 1) * this.slideWidth;
    this.carousel.$slidesArea!.style.transform = `translateX(${stageOffset}px)`;
  }

  /** Ends current transition and make permanent all changes performed in the transition. */
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

  /** Sets order style property for slides starting at index */
  protected _setOrderFrom(index: number): void {
    if (index < 0 || index > this.carousel.count) return;

    let $slide = this.carousel.$slides[index];
    for (let order = 0; order < this.carousel.count; order++) {
      $slide.style.order = String(order);
      $slide = $slide.$nextCyclic;
    }
  }
}

import {promisifyEvent, repeatSequence, resolvePromise} from '../../../esl-utils/async/promise';

import {calcDirection, normalizeIndex} from '../../core/nav/esl-carousel.nav.utils';
import {ESLCarouselRenderer} from '../../core/esl-carousel.renderer';

import type {ESLCarouselSlide} from '../../core/esl-carousel.slide';
import type {ESLCarouselDirection} from '../../core/nav/esl-carousel.nav.types';

@ESLCarouselRenderer.register
export class ESLMultiCarouselRenderer extends ESLCarouselRenderer {
  public static override is = 'multi';

  /** First index of active slides. */
  protected currentIndex: number = 0;

  /** Gets count of slides between active and passed considering given direction. */
  protected getDistance(slide: ESLCarouselSlide | number, direction: ESLCarouselDirection): number {
    if (typeof slide !== 'number') slide = slide.index;
    let count = 0;
    if (direction === 'prev') {
      count = normalizeIndex(this.carousel.activeIndex - slide, this.size);
    } else if (direction === 'next') {
      count = normalizeIndex(slide - this.carousel.activeIndex, this.size);
    }
    return count;
  }

  /**
   * Processes binding of defined renderer to the carousel {@link ESLCarousel}.
   * Prepare to renderer animation.
   */
  public override onBind(): void {
    this.redraw();

    this.currentIndex = this.carousel.activeIndex;
    this._setOrderFrom(this.currentIndex);
  }

  public override redraw(): void {
    const {$slides, $slidesArea} = this.carousel;
    if (!$slidesArea || !$slides.length) return;

    const slidesAreaStyles = getComputedStyle($slidesArea);
    this.slideWidth = parseFloat(slidesAreaStyles.width) / this.carousel.count;
    $slides.forEach((slide) => slide.style.minWidth = this.slideWidth + 'px');
  }

  /**
   * Processes unbinding of defined renderer from the carousel {@link ESLCarousel}.
   * Clear animation.
   */
  public override onUnbind(): void {
    this.carousel.$slides.forEach((el) => {
      el.toggleAttribute('visible', false);
      el.style.removeProperty('order');
    });
    this.carousel.$slidesArea!.style.removeProperty('transform');
    this.carousel.toggleAttribute('animating', false);
    this.carousel.$slidesArea!.style.transform = 'translate3d(0px, 0px, 0px)';
  }

  /** Pre-processing animation action. */
  public async onBeforeAnimate(): Promise<void> {
    if (this.carousel.hasAttribute('animating')) return Promise.reject('Already animating');
    return Promise.resolve();
  }

  /** Processes animation. */
  public onAnimate(nextIndex: number, direction: ESLCarouselDirection): Promise<void> {
    this.currentIndex = this.carousel.activeIndex;

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
  protected async onBeforeStepAnimate(direction: ESLCarouselDirection): Promise<void> {
    this.carousel.$slides.forEach((el) => el.toggleAttribute('visible'));

    const orderIndex = direction === 'next' ? this.currentIndex : normalizeIndex(this.currentIndex - 1, this.size);
    this._setOrderFrom(orderIndex);

    // TODO: reflow
    const offsetIndex = direction === 'next' ? normalizeIndex(this.currentIndex + 1, this.size) : this.currentIndex;
    const offset = this.carousel.$slides[offsetIndex].offsetLeft;
    const shiftXBefore = direction === 'next' ? 0 : -offset;
    this.carousel.$slidesArea!.style.transform = `translate3d(${shiftXBefore}px, 0px, 0px)`;

    +this.carousel.offsetLeft;
    this.carousel.toggleAttribute('animating', true);

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

  /** Post-processing the transition animation of one slide. */
  protected async onAfterStepAnimate(direction: ESLCarouselDirection): Promise<void> {
    // TODO: onAfterAnimate
    this.carousel.$slides.forEach((el) => el.toggleAttribute('visible', false));
    this.carousel.$slidesArea!.style.transform = 'translate3d(0px, 0px, 0px)';

    this.currentIndex = direction === 'next' ? this.currentIndex + 1 : this.currentIndex - 1;
    this.currentIndex = normalizeIndex(this.currentIndex, this.size);

    this._setOrderFrom(this.currentIndex);

    this.carousel.toggleAttribute('animating', false);
    +this.carousel.offsetLeft;
    return Promise.resolve();
  }

  /** Handles the slides transition. */
  public onMove(offset: number): void {
    this.carousel.$slides.forEach((el) => el.toggleAttribute('visible', true));

    const sign = offset < 0 ? 1 : -1;
    const count = Math.floor(Math.abs(offset) / this.slideWidth);
    const currentIndex = normalizeIndex(this.carousel.activeIndex + count * sign, this.size);

    if (!this._checkNonLoop(offset)) return;

    const orderIndex = offset < 0 ? currentIndex : normalizeIndex(currentIndex - 1, this.size);
    this._setOrderFrom(orderIndex);
    this.currentIndex = currentIndex;

    const stageOffset = offset < 0 ? offset + count * this.slideWidth : offset - (count + 1) * this.slideWidth;
    this.carousel.$slidesArea!.style.transform = `translateX(${stageOffset}px)`;
  }

  protected _checkNonLoop(offset: number): boolean {
    const sign = offset < 0 ? 1 : -1;
    const count = Math.floor(Math.abs(offset) / this.slideWidth);
    const nextIndex = this.carousel.activeIndex + count * sign;
    const currentIndex = normalizeIndex(this.carousel.activeIndex + count * sign, this.size);

    if (this.carousel.loop) return true;
    // check non-loop state
    if (nextIndex >= this.carousel.size || nextIndex < 0) return false;
    // check left border of non-loop state
    if (offset > 0 && currentIndex - 1 < 0) return false;
    // check right border of non-loop state
    return !(offset < 0 && currentIndex + 1 + this.carousel.count > this.carousel.size);
  }

  /** Ends current transition and make permanent all changes performed in the transition. */
  // eslint-disable-next-line sonarjs/cognitive-complexity
  public async commit(offset: number): Promise<void> {
    const achieveBorders = this._checkNonLoop(offset);
    if (achieveBorders) {
      // calculate offset to move to
      const shiftCount = Math.abs(offset) % this.slideWidth >= this.slideWidth / 4 ? 1 : 0;
      const stageOffset = offset < 0 ? -shiftCount * this.slideWidth : (shiftCount - 1) * this.slideWidth;

      this.carousel.toggleAttribute('animating', true);
      this.carousel.$slidesArea!.style.transform = `translateX(${stageOffset}px)`;
      await promisifyEvent(this.carousel.$slidesArea!, 'transitionend').catch(resolvePromise);
    }

    // clear animation
    this.carousel.toggleAttribute('animating', false);
    this.carousel.$slidesArea!.style.transform = 'translateX(0)';
    this.carousel.$slides.forEach((el) => el.toggleAttribute('visible', false));

    const sign = offset < 0 ? 1 : -1;
    const count = Math.abs(offset) % this.slideWidth >= this.slideWidth / 4 ?
      Math.ceil(Math.abs(offset) / this.slideWidth) : Math.floor(Math.abs(offset) / this.slideWidth);
    const nextIndex = this.carousel.activeIndex + count * sign;

    if (!this.carousel.loop && offset > 0 && nextIndex - 1 < 0) {
      this.currentIndex = 0;
    } else if (!this.carousel.loop && offset < 0 && nextIndex + this.carousel.count >= this.carousel.size) {
      this.currentIndex = this.carousel.size - this.carousel.count;
    } else {
      this.currentIndex = normalizeIndex(nextIndex, this.size);
    }

    let direction = offset > 0 ? 'prev' : 'next';
    direction = direction || calcDirection(this.carousel.activeIndex, this.currentIndex, this.size);
    this._setOrderFrom(this.currentIndex);

    this.setActive(this.currentIndex);

    // TODO: change info
    this.carousel.$$fire('esl:slide:changed', {
      detail: {direction},
      bubbles: false
    });
  }

  /** Sets order style property for slides starting at index */
  protected _setOrderFrom(index: number): void {
    if (index < 0 || index > this.carousel.size) return;

    let $slide = this.carousel.$slides[index];
    for (let order = 0; order < this.carousel.size; order++) {
      $slide.style.order = String(order);
      $slide = $slide.$nextCyclic;
    }
  }
}

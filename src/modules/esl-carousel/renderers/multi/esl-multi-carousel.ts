import {promisifyEvent, promisifyTransition, resolvePromise} from '../../../esl-utils/async';

import {boundIndex, calcDirection, normalizeIndex} from '../../core/nav/esl-carousel.nav.utils';
import {ESLCarouselRenderer} from '../../core/esl-carousel.renderer';
import {ESLCarouselSlideEvent} from '../../core/esl-carousel.events';

import type {ESLCarouselDirection} from '../../core/nav/esl-carousel.nav.types';

@ESLCarouselRenderer.register
export class ESLMultiCarouselRenderer extends ESLCarouselRenderer {
  public static override is = 'multi';

  /** Slides gap width */
  protected gapWidth: number = 0;
  /** Slide width cached value */
  protected slideWidth: number = 0;
  /** First index of active slides. */
  protected currentIndex: number = 0;

  /**
   * Processes binding of defined renderer to the carousel {@link ESLCarousel}.
   * Prepare to renderer animation.
   */
  public override onBind(): void {
    this.currentIndex = this.carousel.activeIndex;
    this.redraw();
  }

  public override redraw(): void {
    this.resize();
    this.reindex();
    this.setActive(this.currentIndex);
  }

  /**
   * Processes unbinding of defined renderer from the carousel {@link ESLCarousel}.
   * Clear animation.
   */
  public override onUnbind(): void {
    this.carousel.$slides.forEach((el) => {
      el.toggleAttribute('visible', false);
      el.style.removeProperty('order');
      el.style.removeProperty('width');
    });
    this.$area.style.removeProperty('transform');
    this.$area.style.transform = 'translate3d(0px, 0px, 0px)';
    this.carousel.toggleAttribute('animating', false);
  }

  /** Pre-processing animation action. */
  public async onBeforeAnimate(): Promise<void> {
    if (this.carousel.hasAttribute('animating')) return Promise.reject('Already animating');
    this.carousel.$slides.forEach((el) => el.toggleAttribute('visible', true));
    return Promise.resolve();
  }

  /** Processes animation. */
  public async onAnimate(nextIndex: number, direction: ESLCarouselDirection): Promise<void> {
    const {activeIndex, $slidesArea} =  this.carousel;
    this.currentIndex = activeIndex;
    if (!$slidesArea) return;
    while (this.currentIndex !== nextIndex) {
      await this.onBeforeStepAnimate(direction);
      await this.onAfterStepAnimate(direction);
    }
  }

  /** Post-processing animation action. */
  public async onAfterAnimate(): Promise<void> {
    this.$area.style.transform = 'translate3d(0px, 0px, 0px)';
    this.carousel.$slides.forEach((el) => el.removeAttribute('visible'));
    return Promise.resolve();
  }

  /** Pre-processing the transition animation of one slide. */
  protected async onBeforeStepAnimate(direction: ESLCarouselDirection): Promise<void> {
    const orderIndex = direction === 'next' ? this.currentIndex : normalizeIndex(this.currentIndex - 1, this.size);
    this.reindex(orderIndex);

    // TODO: reflow
    const offsetIndex = direction === 'next' ? normalizeIndex(this.currentIndex + 1, this.size) : this.currentIndex;
    const offset = this.carousel.$slides[offsetIndex].offsetLeft;
    const shiftXBefore = direction === 'next' ? 0 : -offset;
    this.$area.style.transform = `translate3d(${shiftXBefore}px, 0px, 0px)`;

    +this.carousel.offsetLeft;
    this.carousel.toggleAttribute('animating', true);

    const shiftXAfter = direction === 'next' ? -offset : 0;
    this.$area.style.transform = `translate3d(${shiftXAfter}px, 0px, 0px)`;

    return promisifyTransition(this.$area, 'transform');
  }

  /** Post-processing the transition animation of one slide. */
  protected async onAfterStepAnimate(direction: ESLCarouselDirection): Promise<void> {
    // TODO: onAfterAnimate
    this.$area.style.transform = 'translate3d(0px, 0px, 0px)';

    this.currentIndex = direction === 'next' ? this.currentIndex + 1 : this.currentIndex - 1;
    this.currentIndex = normalizeIndex(this.currentIndex, this.size);

    this.reindex(this.currentIndex);

    this.carousel.toggleAttribute('animating', false);
    +this.carousel.offsetLeft;
    return Promise.resolve();
  }

  /** Handles the slides transition. */
  public onMove(offset: number): void {
    this.carousel.$slides.forEach((el) => el.toggleAttribute('visible', true));

    const sign = offset < 0 ? 1 : -1;
    const slideWidth = this.slideWidth + this.gapWidth;
    const count = Math.floor(Math.abs(offset) / slideWidth);
    const currentIndex = normalizeIndex(this.carousel.activeIndex + count * sign, this.size);

    if (!this._checkNonLoop(offset)) return;

    const orderIndex = offset < 0 ? currentIndex : normalizeIndex(currentIndex - 1, this.size);
    this.reindex(orderIndex);
    this.currentIndex = currentIndex;

    const stageOffset = offset < 0 ? offset + count * slideWidth : offset - (count + 1) * slideWidth;
    this.$area.style.transform = `translateX(${stageOffset}px)`;
  }

  protected _checkNonLoop(offset: number): boolean {
    const sign = offset < 0 ? 1 : -1;
    const count = Math.floor(Math.abs(offset) / (this.slideWidth + this.gapWidth));
    const nextIndex = this.carousel.activeIndex + count * sign;
    const currentIndex = normalizeIndex(this.carousel.activeIndex + count * sign, this.size);

    if (this.loop) return true;
    // check non-loop state
    if (nextIndex >= this.carousel.size || nextIndex < 0) return false;
    // check left border of non-loop state
    if (offset > 0 && currentIndex - 1 < 0) return false;
    // check right border of non-loop state
    return !(offset < 0 && currentIndex + 1 + this.count > this.carousel.size);
  }

  /** Ends current transition and make permanent all changes performed in the transition. */
  // eslint-disable-next-line sonarjs/cognitive-complexity
  public async commit(offset: number): Promise<void> {
    const activeIndex = this.carousel.activeIndex;
    const achieveBorders = this._checkNonLoop(offset);
    if (achieveBorders) {
      const slideWidth = this.slideWidth + this.gapWidth;
      // calculate offset to move to
      const shiftCount = Math.abs(offset) % slideWidth >= slideWidth / 4 ? 1 : 0;
      const stageOffset = offset < 0 ? -shiftCount * slideWidth : (shiftCount - 1) * slideWidth;

      this.carousel.toggleAttribute('animating', true);
      this.$area.style.transform = `translateX(${stageOffset}px)`;
      await promisifyEvent(this.$area, 'transitionend').catch(resolvePromise);
    }

    // clear animation
    this.carousel.toggleAttribute('animating', false);
    this.$area.style.transform = 'translateX(0)';
    this.carousel.$slides.forEach((el) => el.toggleAttribute('visible', false));

    const sign = offset < 0 ? 1 : -1;
    const count = Math.abs(offset) % this.slideWidth >= this.slideWidth / 4 ?
      Math.ceil(Math.abs(offset) / this.slideWidth) : Math.floor(Math.abs(offset) / this.slideWidth);
    const nextIndex = this.carousel.activeIndex + count * sign;

    if (this.loop) {
      this.currentIndex = normalizeIndex(nextIndex, this.size);
    } else {
      this.currentIndex = boundIndex(nextIndex, this.size - this.count);
    }

    let direction: ESLCarouselDirection = offset > 0 ? 'prev' : 'next';
    direction = direction || calcDirection(this.carousel.activeIndex, this.currentIndex, this.size);
    this.reindex(this.currentIndex);

    this.setActive(this.currentIndex);

    if (activeIndex !== this.currentIndex) {
      this.carousel.dispatchEvent(ESLCarouselSlideEvent.create('AFTER', {
        direction,
        current: this.currentIndex,
        related: activeIndex
      }));
    }
  }

  /** Sets order style property for slides starting at index */
  protected resize(): void {
    const {$slides, $slidesArea} = this.carousel;
    if (!$slidesArea || !$slides.length) return;
    const slidesAreaStyles = getComputedStyle($slidesArea);
    const width = parseFloat(slidesAreaStyles.width);
    this.gapWidth = parseFloat(slidesAreaStyles.columnGap);
    this.slideWidth = (width - this.gapWidth * (this.count - 1)) / this.count;
    $slides.forEach((slide) => slide.style.minWidth = this.slideWidth + 'px');
  }

  /** Sets order style property for slides starting at index */
  protected reindex(index: number = this.currentIndex): void {
    if (index < 0 || index > this.carousel.size) return;
    const {size, $slides} = this.carousel;
    if (!$slides.length) return;
    for (let i = 0; i < size; ++i) {
      $slides[i].style.order = String((size + i - index) % size);
    }
  }
}
import {promisifyEvent, promisifyTransition, resolvePromise} from '../../esl-utils/async';

import {boundIndex, calcDirection, normalizeIndex} from '../core/nav/esl-carousel.nav.utils';
import {ESLCarouselRenderer} from '../core/esl-carousel.renderer';
import {ESLCarouselSlideEvent} from '../core/esl-carousel.events';

import type {ESLCarouselDirection} from '../core/nav/esl-carousel.nav.types';

@ESLCarouselRenderer.register
export class ESLDefaultCarouselRenderer extends ESLCarouselRenderer {
  public static override is = 'default';
  public static override classes: string[] = ['esl-carousel-default-renderer'];

  /** Slides gap size */
  protected gap: number = 0;
  /** Slide size cached value */
  protected slideSize: number = 0;
  /** First index of active slides. */
  protected currentIndex: number = 0;

  /**
   * Processes binding of defined renderer to the carousel {@link ESLCarousel}.
   * Prepare to renderer animation.
   */
  public override onBind(): void {
    this.currentIndex = this.$carousel.activeIndex;
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
    this.$slides.forEach((el) => {
      el.toggleAttribute('visible', false);
      el.style.removeProperty('order');
      el.style.removeProperty('min-width');
      el.style.removeProperty('min-height');
    });
    this.$area.style.removeProperty('transform');
    this.$carousel.toggleAttribute('animating', false);
  }

  /** Get slide offset by the slide index */
  protected getOffset(index: number): number {
    const slide = this.$slides[index];
    if (!slide) return 0;
    return this.vertical ? slide.offsetTop : slide.offsetLeft;
  }
  /** Sets scene offset */
  protected setTransformOffset(offset: number): void {
    this.$area.style.transform = this.vertical ? `translate3d(0px, ${offset}px, 0px)` : `translate3d(${offset}px, 0px, 0px)`;
  }

  /** Pre-processing animation action. */
  public async onBeforeAnimate(): Promise<void> {
    if (this.$carousel.hasAttribute('animating')) throw new Error('[ESL] Carousel: already animating');
    this.$slides.forEach((el) => el.toggleAttribute('visible', true));
  }

  /** Processes animation. */
  public async onAnimate(nextIndex: number, direction: ESLCarouselDirection): Promise<void> {
    const {activeIndex, $slidesArea} =  this.$carousel;
    this.currentIndex = activeIndex;
    if (!$slidesArea) return;
    while (this.currentIndex !== nextIndex) {
      await this.onBeforeStepAnimate(direction);
      await this.onAfterStepAnimate(direction);
    }
  }

  /** Post-processing animation action. */
  public async onAfterAnimate(): Promise<void> {
    this.setTransformOffset(0);
    this.$slides.forEach((el) => el.removeAttribute('visible'));
  }

  /** Pre-processing the transition animation of one slide. */
  protected async onBeforeStepAnimate(direction: ESLCarouselDirection): Promise<void> {
    const orderIndex = direction === 'next' ? this.currentIndex : normalizeIndex(this.currentIndex - 1, this.size);
    this.reindex(orderIndex);

    // TODO: reflow
    const offsetIndex = direction === 'next' ? normalizeIndex(this.currentIndex + 1, this.size) : this.currentIndex;
    const offset = this.getOffset(offsetIndex);
    const shiftXBefore = direction === 'next' ? 0 : -offset;
    this.setTransformOffset(shiftXBefore);

    +this.$carousel.offsetLeft;
    this.$carousel.toggleAttribute('animating', true);

    const shiftXAfter = direction === 'next' ? -offset : 0;
    this.setTransformOffset(shiftXAfter);

    await promisifyTransition(this.$area, 'transform');
  }

  /** Post-processing the transition animation of one slide. */
  protected async onAfterStepAnimate(direction: ESLCarouselDirection): Promise<void> {
    // TODO: onAfterAnimate
    this.setTransformOffset(0);

    this.currentIndex = direction === 'next' ? this.currentIndex + 1 : this.currentIndex - 1;
    this.currentIndex = normalizeIndex(this.currentIndex, this.size);

    this.reindex(this.currentIndex);

    this.$carousel.toggleAttribute('animating', false);
    +this.$carousel.offsetLeft;
  }

  /** Handles the slides transition. */
  public onMove(offset: number): void {
    this.$slides.forEach((el) => el.toggleAttribute('visible', true));

    const sign = offset < 0 ? 1 : -1;
    const slideSize = this.slideSize + this.gap;
    const count = Math.floor(Math.abs(offset) / slideSize);
    const currentIndex = normalizeIndex(this.$carousel.activeIndex + count * sign, this.size);

    if (!this._checkNonLoop(offset)) return;

    const orderIndex = offset < 0 ? currentIndex : normalizeIndex(currentIndex - 1, this.size);
    this.reindex(orderIndex);
    this.currentIndex = currentIndex;

    const stageOffset = offset < 0 ? offset + count * slideSize : offset - (count + 1) * slideSize;
    this.setTransformOffset(stageOffset);
  }

  protected _checkNonLoop(offset: number): boolean {
    const sign = offset < 0 ? 1 : -1;
    const count = Math.floor(Math.abs(offset) / (this.slideSize + this.gap));
    const nextIndex = this.$carousel.activeIndex + count * sign;
    const currentIndex = normalizeIndex(this.$carousel.activeIndex + count * sign, this.size);

    if (this.loop) return true;
    // check non-loop state
    if (nextIndex >= this.$carousel.size || nextIndex < 0) return false;
    // check left border of non-loop state
    if (offset > 0 && currentIndex - 1 < 0) return false;
    // check right border of non-loop state
    return !(offset < 0 && currentIndex + 1 + this.count > this.$carousel.size);
  }

  /** Ends current transition and make permanent all changes performed in the transition. */
  // eslint-disable-next-line sonarjs/cognitive-complexity
  public async commit(offset: number): Promise<void> {
    const activeIndex = this.$carousel.activeIndex;
    const achieveBorders = this._checkNonLoop(offset);
    if (achieveBorders) {
      const slideSize = this.slideSize + this.gap;
      // calculate offset to move to
      const shiftCount = Math.abs(offset) % slideSize >= slideSize / 4 ? 1 : 0;
      const stageOffset = offset < 0 ? -shiftCount * slideSize : (shiftCount - 1) * slideSize;

      this.$carousel.toggleAttribute('animating', true);
      this.setTransformOffset(stageOffset);
      await promisifyEvent(this.$area, 'transitionend').catch(resolvePromise);
    }

    const sign = offset < 0 ? 1 : -1;
    const slideSize = this.slideSize + this.gap;
    const count = Math.abs(offset) % slideSize >= slideSize / 4 ?
      Math.ceil(Math.abs(offset) / this.slideSize) : Math.floor(Math.abs(offset) / this.slideSize);
    const nextIndex = this.$carousel.activeIndex + count * sign;

    if (this.loop) {
      this.currentIndex = normalizeIndex(nextIndex, this.size);
    } else {
      this.currentIndex = boundIndex(nextIndex, this.size - this.count);
    }

    let direction: ESLCarouselDirection = offset > 0 ? 'prev' : 'next';
    direction = direction || calcDirection(this.$carousel.activeIndex, this.currentIndex, this.size);
    this.reindex(this.currentIndex);

    this.setActive(this.currentIndex);

    // clear animation
    this.$carousel.toggleAttribute('animating', false);
    this.setTransformOffset(0);
    this.$slides.forEach((el) => el.toggleAttribute('visible', false));

    if (activeIndex !== this.currentIndex) {
      this.$carousel.dispatchEvent(ESLCarouselSlideEvent.create('AFTER', {
        direction,
        current: this.currentIndex,
        related: activeIndex
      }));
    }
  }

  /** Sets order style property for slides starting at index */
  protected reindex(index: number = this.currentIndex): void {
    if (index < 0 || index > this.$carousel.size) return;
    const {size, $slides} = this;
    if (!$slides.length) return;
    for (let i = 0; i < size; ++i) {
      $slides[i].style.order = String((size + i - index) % size);
    }
  }

  /** Sets min size for slides */
  protected resize(): void {
    if (!this.$area) return;
    const areaStyles = getComputedStyle(this.$area);

    this.gap = parseFloat(this.vertical ? areaStyles.rowGap : areaStyles.columnGap);
    const areaSize = parseFloat(this.vertical ? areaStyles.height : areaStyles.width);
    this.slideSize = (areaSize - this.gap * (this.count - 1)) / this.count;
    this.$slides.forEach((slide) => {
      const prop = this.vertical ? 'min-height' : 'min-width';
      slide.style.setProperty(prop, this.slideSize + 'px');
    });
  }
}

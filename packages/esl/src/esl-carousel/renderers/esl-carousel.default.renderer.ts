import {ESLMediaQuery} from '../../esl-media-query/core';
import {bounds, normalize, normalizeIndex, sign} from '../core/esl-carousel.utils';
import {ESLCarouselRenderer} from '../core/esl-carousel.renderer';

import type {ESLCarouselDirection, ESLCarouselActionParams} from '../core/esl-carousel.types';

/**
 * Default carousel renderer based on CSS Flexbox stage, order (flex), and stage animated movement via CSS transform.
 * Supports multiple slides per view, (infinite) loop mode, touch-move, vertical mode, slide siblings rendering.
 *
 * Provides default slide width, supports gap between slides. Does not rely on default slide width, potentially can be used with CSS custom slide width.
 */
@ESLCarouselRenderer.register
export class ESLDefaultCarouselRenderer extends ESLCarouselRenderer {
  public static override is = 'default';
  public static override classes: string[] = ['esl-carousel-default-renderer'];

  /** CSS variable name for slide auto size */
  public static SIZE_PROP = '--esl-slide-size';

  /** Tolerance to treat offset enough to move to the next slide. Relative (0-1) to slide width */
  public static readonly NEXT_SLIDE_TOLERANCE = 0.25;

  /** Slides gap size */
  protected gap: number = 0;
  /** First index of active slides. */
  protected currentIndex: number = 0;

  /** @returns shift size in pixels */
  public override accessor offset: number = 0;

  /** Multiplier for the index move on the slide move */
  protected get INDEX_MOVE_MULTIPLIER(): number {
    return 1;
  }

  /** @returns true if moving half of the slides before current is forbidden */
  protected get lazyReorder(): boolean {
    const reserve = this.$carousel.getAttribute('lazy-reorder');
    if (reserve === null) return false;
    return ESLMediaQuery.for(reserve).matches;
  }

  /** Actual slide size (uses average) */
  protected get slideSize(): number {
    return this.$slides.reduce((size, $slide) => {
      return size + (this.vertical ? $slide.offsetHeight : $slide.offsetWidth);
    }, 0) / this.$slides.length;
  }

  /**
   * Processes binding of defined renderer to the carousel {@link ESLCarousel}.
   * Prepare to renderer animation.
   */
  public override onBind(): void {
    this.currentIndex = bounds(this.$carousel.activeIndex, 0, this.size - this.count);
    this.redraw(true);
  }

  public override redraw(initial = false): void {
    this.resize();

    // Calculate initial offset based on current rendered state (available only on an initial render)
    const fallbackOffset = initial ? this.getOffset(this.getReserveCount()) : 0;
    this.reorder();
    this.setActive(this.currentIndex);

    // Set initial offset based on pre-calculation
    initial && this.setTransformOffset(this.offset - fallbackOffset);
    // Update offset according to main algorithm (fix edge cases if the fallback offset is not correct)
    this.setTransformOffset(this.offset - this.getOffset(this.currentIndex));
  }

  /**
   * Processes unbinding of defined renderer from the carousel {@link ESLCarousel}.
   * Clear animation.
   */
  public override onUnbind(): void {
    this.$slides.forEach((el) => el.style.removeProperty('order'));
    this.$area.style.removeProperty('transform');
    this.$area.style.removeProperty(ESLDefaultCarouselRenderer.SIZE_PROP);
    this.animating = false;
    this.$carousel.$$attr('active', false);
  }

  /** @returns slide offset by the slide index */
  protected getOffset(index: number): number {
    const slide = this.$slides[index];
    if (!slide) return 0;
    return this.vertical ? slide.offsetTop : slide.offsetLeft;
  }

  /** Sets scene offset */
  protected setTransformOffset(offset: number): void {
    this.$area.style.transform = `translate3d(${this.vertical ? `0px, ${offset}px` : `${offset}px, 0px`}, 0px)`;
  }

  /** Animates scene offset to index */
  protected async animateTo(index: number, duration: number): Promise<void> {
    this.currentIndex = this.normalizeIndex(index);
    const offset = -this.getOffset(this.currentIndex);
    this.animating = true;
    await this.$area.animate({
      transform: [`translate3d(${this.vertical ? `0px, ${offset}px` : `${offset}px, 0px`}, 0px)`]
    }, {duration, easing: 'linear'}).finished;
    this.offset = 0; // reset offset after animation
    this.animating =  false;
  }

  /** Processes animation. */
  public async onAnimate(nextIndex: number, direction: ESLCarouselDirection, params: ESLCarouselActionParams): Promise<void> {
    const {activeIndex, $slidesArea} =  this.$carousel;
    this.currentIndex = activeIndex;
    if (!$slidesArea) return;
    const distance = normalize((nextIndex - activeIndex) * direction, this.size);
    const speed = Math.min(1, this.count / distance) * this.transitionDuration;
    this.$carousel.$$attr('active', true);
    while (this.currentIndex !== nextIndex) {
      await this.onStepAnimate(direction * this.INDEX_MOVE_MULTIPLIER, speed);
    }
    // if no slide change performed, reset offset
    if (this.offset !== 0) await this.onStepAnimate(0, speed);
    this.$carousel.$$attr('active', false);
  }

  /** Post-processing animation action. */
  public override async onAfterAnimate(nextIndex: number, direction: ESLCarouselDirection, params: ESLCarouselActionParams): Promise<void> {
    // Make sure we end up in a defined state on transition end
    this.reorder();
    this.setTransformOffset(-this.getOffset(this.currentIndex));
    return super.onAfterAnimate(nextIndex, direction, params);
  }

  /** Makes pre-processing the transition animation of one slide. */
  protected async onStepAnimate(indexOffset: number, duration: number): Promise<void> {
    const index = normalize(this.currentIndex + indexOffset, this.size);

    // Make sure there is a slide in required direction
    this.reorder(indexOffset < 0);
    const offsetFrom = this.offset - this.getOffset(this.currentIndex);
    this.setTransformOffset(offsetFrom);

    await this.animateTo(index, duration);
  }

  /** Handles the slides transition. */
  public move(offset: number, from: number, params: ESLCarouselActionParams): void {
    this.$carousel.$$attr('active', true);

    const direction = sign(-offset);
    const slideSize = this.slideSize + this.gap;
    const amount = Math.abs(offset) / slideSize;
    const index = from + Math.floor(amount) * this.INDEX_MOVE_MULTIPLIER * direction;
    const next = from + Math.ceil(amount) * this.INDEX_MOVE_MULTIPLIER * direction;

    // Normalize index according to loop state
    this.currentIndex = normalizeIndex(index, this);
    // Block move before the first slide if loop is disabled
    if (this.currentIndex === 0 && !this.loop) offset = Math.min(0, offset);
    // Block move after the last slide if loop is disabled
    if (this.currentIndex + this.count >= this.size && !this.loop) offset = Math.max(0, offset);

    this.reorder(offset > 0);

    const previousOffset = this.offset;
    this.offset = Math.round(offset % slideSize);
    const stageOffset = this.getOffset(this.currentIndex) - this.offset;
    this.setTransformOffset(-stageOffset);

    if (next !== index) {
      const nextIndex = normalize(next, this.size);
      this.setPreActive(nextIndex, {...params, direction: sign(next - index)});
    }

    if (previousOffset !== this.offset) {
      this.dispatchMoveEvent(this.offset, this.currentIndex, previousOffset - this.offset, params);
    }

    if (this.currentIndex !== this.$carousel.activeIndex) {
      this.setActive(this.currentIndex, {...params, direction});
    }
  }

  /** Ends current transition and make permanent all changes performed in the transition. */
  public async commit(params: ESLCarouselActionParams): Promise<void> {
    const {offset} = this;
    const dir = sign(-offset);
    const slideSize = this.slideSize + this.gap;
    const amount = Math.abs(offset) / slideSize;
    const tolerance = ESLDefaultCarouselRenderer.NEXT_SLIDE_TOLERANCE;
    const direction = params.direction || sign((amount - Math.floor(amount)) - tolerance);
    const count = direction > 0 ? Math.ceil(amount) : Math.floor(amount);
    const index = this.currentIndex + count * this.INDEX_MOVE_MULTIPLIER * dir;

    await this.animateTo(index, this.transitionDuration);
    this.$carousel.$$attr('active', false);
    await this.onAfterAnimate(this.currentIndex, direction, params);
  }

  /**
   * @returns count of slides to be rendered (reserved) before the first slide
   */
  protected getReserveCount(back?: boolean): number {
    const {size, count, loop, currentIndex} = this;
    const freeSlides = size - count;
    // no need to reorder if there are no free slides or loop is disabled
    if (!loop || !freeSlides) return 0;
    // if back option is not set, prefer to reserve slides with respect to semantic order
    if (typeof back !== 'boolean') back = !!currentIndex;
    // Check if reorder is forbidden (if back option is set - we should reserve at least one slide for animation)
    if (this.lazyReorder) return back ? 1 : 0;
    // otherwise, ensure that there are at least half of free slides reserved (if the back option is set - round up, otherwise - round down)
    return back ? Math.ceil(freeSlides / 2) : Math.floor(freeSlides / 2);
  }

  /**
   * Sets order style property for slides starting at index
   * @param back - if true, ensures that there is a slide rendered before the current one
   */
  protected reorder(back?: boolean): void {
    const {size, loop, currentIndex, $slides} = this;
    const reserve = this.getReserveCount(back);

    const index = loop ? currentIndex : 0;
    for (let i = 0; i < size; ++i) {
      let offset = (size + i - index) % size;
      // inverses index for backward reserve
      if (offset >= size - reserve) offset -= size;
      $slides[i].style.order = String(offset);
    }
  }

  /** Sets min size for slides */
  protected resize(): void {
    if (!this.$area) return;
    const areaStyles = getComputedStyle(this.$area);

    this.gap = parseFloat(this.vertical ? areaStyles.rowGap : areaStyles.columnGap);
    const areaSize = parseFloat(this.vertical ? areaStyles.height : areaStyles.width);
    const slideSize = Math.floor((areaSize - this.gap * (this.count - 1)) / this.count);
    this.$area.style.setProperty(ESLDefaultCarouselRenderer.SIZE_PROP, slideSize + 'px');
  }
}

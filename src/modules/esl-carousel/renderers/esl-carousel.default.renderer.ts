import {normalize, sign} from '../core/esl-carousel.utils';
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

  /** Multiplier for the index move on the slide move */
  protected get INDEX_MOVE_MULTIPLIER(): number {
    return 1;
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
    this.currentIndex = this.normalizeIndex(Math.max(0, this.$carousel.activeIndex));
    this.redraw();
  }

  public override redraw(): void {
    this.resize();
    this.reorder();
    this.setActive(this.currentIndex);
    this.setTransformOffset(-this.getOffset(this.currentIndex));
  }

  /**
   * Processes unbinding of defined renderer from the carousel {@link ESLCarousel}.
   * Clear animation.
   */
  public override onUnbind(): void {
    this.$slides.forEach((el) => el.style.removeProperty('order'));
    this.$area.style.removeProperty('transform');
    this.$area.style.removeProperty(ESLDefaultCarouselRenderer.SIZE_PROP);
    this.$carousel.$$attr('animating', false);
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
  protected async animateTo(index: number, duration = 250): Promise<void> {
    this.currentIndex = this.normalizeIndex(index);
    const offset = -this.getOffset(this.currentIndex);
    this.$carousel.$$attr('animating', true);
    await this.$area.animate({
      transform: [`translate3d(${this.vertical ? `0px, ${offset}px` : `${offset}px, 0px`}, 0px)`]
    }, {duration, easing: 'linear'}).finished;
    this.$carousel.$$attr('animating', false);
  }

  /** Pre-processing animation action. */
  public override async onBeforeAnimate(nextIndex: number, direction: ESLCarouselDirection, params: ESLCarouselActionParams): Promise<void> {
    if (this.$carousel.hasAttribute('animating')) throw new Error('[ESL] Carousel: already animating');
    this.$carousel.$$attr('active', true);
  }

  /** Processes animation. */
  public async onAnimate(nextIndex: number, direction: ESLCarouselDirection, params: ESLCarouselActionParams): Promise<void> {
    const {activeIndex, $slidesArea} =  this.$carousel;
    this.currentIndex = activeIndex;
    if (!$slidesArea) return;
    const distance = normalize((nextIndex - activeIndex) * direction, this.size);
    const speed = Math.min(1, this.count / distance);
    while (this.currentIndex !== nextIndex) {
      await this.onStepAnimate(direction * this.INDEX_MOVE_MULTIPLIER, params.stepDuration * speed);
    }
  }

  /** Post-processing animation action. */
  public override async onAfterAnimate(nextIndex: number, direction: ESLCarouselDirection, params: ESLCarouselActionParams): Promise<void> {
    // Make sure we end up in a defined state on transition end
    this.reorder();
    this.setTransformOffset(-this.getOffset(this.currentIndex));
    this.$carousel.$$attr('active', false);
  }

  /** Makes pre-processing the transition animation of one slide. */
  protected async onStepAnimate(indexOffset: number, duration: number): Promise<void> {
    const index = normalize(this.currentIndex + indexOffset, this.size);

    // Make sure there is a slide in required direction
    this.reorder(indexOffset < 0);
    const offsetFrom = -this.getOffset(this.currentIndex);
    this.setTransformOffset(offsetFrom);

    await this.animateTo(index, duration);
  }

  /** Handles the slides transition. */
  public move(offset: number, from: number, params: ESLCarouselActionParams): void {
    this.$carousel.toggleAttribute('active', true);

    const slideSize = this.slideSize + this.gap;
    const count = Math.floor(Math.abs(offset) / slideSize);
    const index = from + count * this.INDEX_MOVE_MULTIPLIER * (offset < 0 ? 1 : -1);

    // check left border of non-loop state
    if (!this.loop && offset > 0 && index <= 0) return;
    // check right border of non-loop state
    if (!this.loop && offset < 0 && index + this.count >= this.size) return;

    this.currentIndex = normalize(index, this.size);
    this.reorder(offset > 0);

    const stageOffset = this.getOffset(this.currentIndex) - (offset % slideSize);
    this.setTransformOffset(-stageOffset);

    if (this.currentIndex !== this.$carousel.activeIndex) {
      this.setActive(this.currentIndex, {direction: sign(-offset)});
    }
  }

  /** Ends current transition and make permanent all changes performed in the transition. */
  // eslint-disable-next-line sonarjs/cognitive-complexity
  public async commit(offset: number, from: number, params: ESLCarouselActionParams): Promise<void> {
    const slideSize = this.slideSize + this.gap;

    const amount = Math.abs(offset) / slideSize;
    const tolerance = ESLDefaultCarouselRenderer.NEXT_SLIDE_TOLERANCE;
    const count = (amount - Math.floor(amount)) > tolerance ? Math.ceil(amount) : Math.floor(amount);
    const index = from + count * this.INDEX_MOVE_MULTIPLIER * (offset < 0 ? 1 : -1);

    await this.animateTo(index);

    this.reorder();
    this.setTransformOffset(-this.getOffset(this.currentIndex));
    this.$carousel.$$attr('active', false);

    if (this.currentIndex !== this.$carousel.activeIndex) {
      this.setActive(this.currentIndex, {direction: sign(-offset)});
    }
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

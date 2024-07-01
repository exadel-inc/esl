import {promisifyTransition} from '../../esl-utils/async';
import {normalize, normalizeIndex} from '../core/nav/esl-carousel.nav.utils';
import {ESLCarouselRenderer} from '../core/esl-carousel.renderer';

import type {ESLCarouselDirection} from '../core/nav/esl-carousel.nav.types';

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
  /** Slide size cached value */
  protected slideSize: number = 0;
  /** First index of active slides. */
  protected currentIndex: number = 0;

  /**
   * Processes binding of defined renderer to the carousel {@link ESLCarousel}.
   * Prepare to renderer animation.
   */
  public override onBind(): void {
    this.currentIndex = this.$carousel.activeIndex >= 0 ? this.$carousel.activeIndex : 0;
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

  /** @returns current slide area's transform offset */
  protected getTransformOffset(): number {
    // computed value is matrix(a, b, c, d, tx, ty)
    const transform = getComputedStyle(this.$area).transform;
    if (!transform || transform === 'none') return 0;
    const position = this.vertical ? 5 : 4; // tx or ty position
    return parseInt(transform.split(',')[position], 10);
  }

  /** Pre-processing animation action. */
  public override async onBeforeAnimate(): Promise<void> {
    if (this.$carousel.hasAttribute('animating')) throw new Error('[ESL] Carousel: already animating');
    this.$carousel.$$attr('active', true);
  }

  /** Processes animation. */
  public async onAnimate(nextIndex: number, direction: ESLCarouselDirection): Promise<void> {
    const {activeIndex, $slidesArea} =  this.$carousel;
    this.currentIndex = activeIndex;
    if (!$slidesArea) return;
    while (this.currentIndex !== nextIndex) await this.onStepAnimate(direction === 'next' ? 1 : -1);
  }

  /** Post-processing animation action. */
  public override async onAfterAnimate(): Promise<void> {
    // Make sure we end up in a defined state on transition end
    this.reorder();
    this.setTransformOffset(-this.getOffset(this.currentIndex));
    this.$carousel.$$attr('active', false);
  }

  /** Makes pre-processing the transition animation of one slide. */
  protected async onStepAnimate(indexOffset: number): Promise<void> {
    const index = normalize(this.currentIndex + indexOffset, this.size);

    // Make sure there is a slide in required direction
    this.reorder(indexOffset < 0);

    const offsetFrom = -this.getOffset(this.currentIndex);
    this.setTransformOffset(offsetFrom);

    // here is the final reflow before transition
    const offsetTo = -this.getOffset(index);
    // Allow animation and move to the target slide
    this.$carousel.$$attr('animating', true);
    this.setTransformOffset(offsetTo);
    if (offsetTo !== offsetFrom) {
      await promisifyTransition(this.$area, 'transform');
    }

    this.currentIndex = index;
    this.$carousel.$$attr('animating', false);
  }

  protected indexByOffset(count: number): number {
    return this.$carousel.activeIndex + count;
  }

  /** Handles the slides transition. */
  public onMove(offset: number): void {
    this.$carousel.toggleAttribute('active', true);

    const slideSize = this.slideSize + this.gap;
    const count = Math.floor(Math.abs(offset) / slideSize);
    const index = this.indexByOffset(count * (offset < 0 ? 1 : -1));

    // check left border of non-loop state
    if (!this.loop && offset > 0 && index <= 0) return;
    // check right border of non-loop state
    if (!this.loop && offset < 0 && index + this.count >= this.size) return;

    this.currentIndex = normalize(index, this.size);
    this.reorder(offset > 0);

    const stageOffset = this.getOffset(this.currentIndex) - (offset % slideSize);
    this.setTransformOffset(-stageOffset);
  }

  /** Ends current transition and make permanent all changes performed in the transition. */
  // eslint-disable-next-line sonarjs/cognitive-complexity
  public async commit(offset: number): Promise<void> {
    const slideSize = this.slideSize + this.gap;

    const amount = Math.abs(offset) / slideSize;
    const tolerance = ESLDefaultCarouselRenderer.NEXT_SLIDE_TOLERANCE;
    const count = (amount - Math.floor(amount)) > tolerance ? Math.ceil(amount) : Math.floor(amount);
    const index = this.indexByOffset(count * (offset < 0 ? 1 : -1));

    this.currentIndex = normalizeIndex(index, this);

    // Hm ... that's what actually happens on slide step
    this.$carousel.$$attr('animating', true);
    const stageOffset = -this.getOffset(this.currentIndex);
    this.setTransformOffset(stageOffset);
    if (stageOffset !== this.getTransformOffset()) {
      await promisifyTransition(this.$area, 'transform');
    }
    this.$carousel.$$attr('animating', false);

    this.reorder();
    this.setTransformOffset(-this.getOffset(this.currentIndex));
    this.setActive(this.currentIndex, {direction: offset < 0 ? 'next' : 'prev'});
    this.$carousel.$$attr('active', false);
  }

  /**
   * @returns count of slides to be rendered (reserved) before the first slide
   */
  protected calcReserveCount(back?: boolean): number {
    const {size, count, loop, currentIndex} = this;
    const freeSlides = size - count;
    // no need to reorder if there are no free slides or loop is disabled
    if (!loop || !freeSlides) return 0;
    // if back option is not set, prefer to reserve slides with respect to semantic order
    if (typeof back !== 'boolean') back = !!currentIndex;
    // otherwise, ensure that there are at least half of free slides reserved (if the back option is set - round up, otherwise - round down)
    return Math.min(count, back ? Math.ceil(freeSlides / 2) : Math.floor(freeSlides / 2));
  }

  /**
   * Sets order style property for slides starting at index
   * @param back - if true, ensures that there is a slide rendered before the current one
   */
  protected reorder(back?: boolean): void {
    const {size, loop, currentIndex, $slides} = this;
    const reserve = this.calcReserveCount(back);

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
    this.slideSize = Math.floor((areaSize - this.gap * (this.count - 1)) / this.count);
    this.$area.style.setProperty(ESLDefaultCarouselRenderer.SIZE_PROP, this.slideSize + 'px');
  }
}

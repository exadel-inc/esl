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

  /** Min slides to position from both sides if possible */
  protected reserve: number = 1;
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
    while (this.currentIndex !== nextIndex) await this.onStepAnimate(direction);
  }

  /** Post-processing animation action. */
  public override async onAfterAnimate(): Promise<void> {
    // Make sure we end up in a defined state on transition end
    this.reorder(this.currentIndex);
    this.setTransformOffset(-this.getOffset(this.currentIndex));
    this.$carousel.$$attr('active', false);
  }

  /** Makes pre-processing the transition animation of one slide. */
  protected async onStepAnimate(direction: ESLCarouselDirection): Promise<void> {
    const index = normalize(this.currentIndex + (direction === 'next' ? 1 : -1), this.size);

    // Make sure there is a slide in required direction
    this.reorder(index, direction !== 'prev');

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

  /** Handles the slides transition. */
  public onMove(offset: number): void {
    this.$carousel.toggleAttribute('active', true);

    const sign = offset < 0 ? 1 : -1;
    const slideSize = this.slideSize + this.gap;
    const count = Math.floor(Math.abs(offset) / slideSize);
    const index = this.$carousel.activeIndex + count * sign;

    // check left border of non-loop state
    if (!this.loop && offset > 0 && index - 1 < 0) return;
    // check right border of non-loop state
    if (!this.loop && offset < 0 && index + 1 + this.count > this.$carousel.size) return;

    const currentIndex = normalize(index, this.size);
    const orderIndex = offset < 0 ? currentIndex : normalize(currentIndex - 1, this.size);

    this.reorder(orderIndex);
    this.currentIndex = currentIndex;

    const stageOffset = this.getOffset(this.currentIndex) - (offset % slideSize);
    this.setTransformOffset(-stageOffset);
  }

  /** Ends current transition and make permanent all changes performed in the transition. */
  // eslint-disable-next-line sonarjs/cognitive-complexity
  public async commit(offset: number): Promise<void> {
    const sign = offset < 0 ? 1 : -1;
    const slideSize = this.slideSize + this.gap;

    const amount = Math.abs(offset) / slideSize;
    const count = (amount - Math.floor(amount)) > 0.25 ? Math.ceil(amount) : Math.floor(amount);
    const index = this.$carousel.activeIndex + count * sign;

    this.currentIndex = normalizeIndex(index, this);

    // Hm ... that's what actually happens on slide step
    this.$carousel.$$attr('animating', true);
    const stageOffset = -this.getOffset(this.currentIndex);
    this.setTransformOffset(stageOffset);
    if (stageOffset !== this.getTransformOffset()) {
      await promisifyTransition(this.$area, 'transform');
    }
    this.$carousel.$$attr('animating', false);

    this.reorder(this.currentIndex);
    this.setTransformOffset(-this.getOffset(this.currentIndex));
    this.setActive(this.currentIndex, {direction: sign > 0 ? 'next' : 'prev'});
    this.$carousel.$$attr('active', false);
  }

  /** Sets order style property for slides starting at index */
  protected reorder(index: number = this.currentIndex, back?: boolean): void {
    if (index < 0 || index > this.$carousel.size) return;
    const {size, $slides} = this;
    if (!$slides.length) return;

    // max reserve limited to a half of free slides, unless backward reorder requested (for back animation)
    const maxReserve = Math.max(back ? 1 : 0, Math.floor((this.size - this.count) / 2));
    // reserve slides from both sides if requested (or for loop carousel by default); reserve in normal direction is in priority
    const reserve = Math.min((typeof back === 'boolean' ? back : this.loop) ? this.reserve : 0, maxReserve);
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

import {promisifyTransition} from '../../esl-utils/async';
import {boundIndex, normalizeIndex} from '../core/nav/esl-carousel.nav.utils';
import {ESLCarouselRenderer} from '../core/esl-carousel.renderer';

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
    this.setTransformOffset(-this.getOffset(this.currentIndex));
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

  protected getTransformOffset(): number {
    // computed value is matrix(a, b, c, d, tx, ty)
    const transform = getComputedStyle(this.$area).transform;
    if (!transform || transform === 'none') return 0;
    const position = this.vertical ? 5 : 4; // tx or ty position
    return parseInt(transform.split(',')[position], 10);
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
    this.setTransformOffset(-this.getOffset(this.currentIndex));
    this.$slides.forEach((el) => el.removeAttribute('visible'));
  }

  /** Pre-processing the transition animation of one slide. */
  protected async onBeforeStepAnimate(direction: ESLCarouselDirection): Promise<void> {
    this.reindex(this.currentIndex, direction === 'prev');

    const offsetIndex = normalizeIndex(this.currentIndex + (direction === 'next' ? 1 : -1), this.size);
    const offsetFrom = -this.getOffset(this.currentIndex);

    this.setTransformOffset(offsetFrom);
    const offsetTo = -this.getOffset(offsetIndex);

    this.$carousel.toggleAttribute('animating', true);
    this.setTransformOffset(offsetTo);

    if (offsetTo === offsetFrom) return;
    await promisifyTransition(this.$area, 'transform');
  }

  /** Post-processing the transition animation of one slide. */
  protected async onAfterStepAnimate(direction: ESLCarouselDirection): Promise<void> {
    this.currentIndex = direction === 'next' ? this.currentIndex + 1 : this.currentIndex - 1;
    this.currentIndex = normalizeIndex(this.currentIndex, this.size);

    this.reindex(this.currentIndex);

    this.setTransformOffset(-this.getOffset(this.currentIndex));
    this.$carousel.toggleAttribute('animating', false);
    +this.$carousel.offsetLeft;
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

    const stageOffset = this.getOffset(this.currentIndex) - (offset % slideSize);
    this.setTransformOffset(-stageOffset);
  }

  /** Ends current transition and make permanent all changes performed in the transition. */
  // eslint-disable-next-line sonarjs/cognitive-complexity
  public async commit(offset: number): Promise<void> {
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

    this.$carousel.toggleAttribute('animating', true);
    const stageOffset = -this.getOffset(this.currentIndex);

    this.setTransformOffset(stageOffset);
    if (stageOffset !== this.getTransformOffset()) {
      await promisifyTransition(this.$area, 'transform');
    }

    this.$carousel.toggleAttribute('animating', false);
    this.reindex(this.currentIndex);
    this.setTransformOffset(-this.getOffset(this.currentIndex));
    this.setActive(this.currentIndex, {direction: sign > 0 ? 'next' : 'prev'});
    this.$slides.forEach((el) => el.toggleAttribute('visible', false));
  }

  /** Sets order style property for slides starting at index */
  protected reindex(index: number = this.currentIndex, back = this.loop): void {
    if (index < 0 || index > this.$carousel.size) return;
    const {size, $slides} = this;
    if (!$slides.length) return;
    for (let i = 0; i < size; ++i) {
      let offset = (size + i - index) % size;
      if (back && offset >= size - 1) offset = offset - size;
      $slides[i].style.order = String(offset);
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

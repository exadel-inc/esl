import {prop, memoize} from '../../esl-utils/decorators';
import {ESLCarouselRenderer} from '../core/esl-carousel.renderer';
import {ESLDefaultCarouselRenderer} from './esl-carousel.default.renderer';

import type {ESLCarouselActionParams} from '../core/esl-carousel.types';

/**
 * {@link ESLDefaultCarouselRenderer} extension to render slides as a multi-row grid.
 * Only 2 rows layout available for now.
 * Supports vertical-carousel mode, touch-move, slide siblings rendering.
 *
 * Provides and relies on the slide width provided with CSS custom property from renderer itself.
 * (CSS Grid-based layout does not allow to provide a slide width in CSS relatively based on the container width)
 */
@ESLCarouselRenderer.register
export class ESLGridCarouselRenderer extends ESLDefaultCarouselRenderer {
  public static override is = 'grid';
  public static override classes: string[] = ['esl-carousel-grid-renderer'];

  /** Slide count per carousel dimension */
  @prop(2, {readonly: true})
  public readonly ROWS: number;

  /** Multiplier for the index move on the slide move */
  protected override get INDEX_MOVE_MULTIPLIER(): number {
    return this.ROWS;
  }

  /** Count of fake slides to fill the last "row" or incomplete carousel state */
  public get fakeSlidesCount(): number {
    const slidesLength = this.$carousel.$slides.length;
    if (slidesLength === 0) return 0;
    if (slidesLength < this.count) {
      return this.count - slidesLength;
    }
    return slidesLength % this.ROWS;
  }

  /**
   * @returns fake slides collection
   * @see ESLGridCarouselRenderer.fakeSlidesCount
   */
  @memoize()
  public get $fakeSlides(): HTMLElement[] {
    const length = this.fakeSlidesCount;
    if (length === 0) return [];
    return Array.from({length}, this.buildFakeSlide.bind(this));
  }

  /** All slides including {@link ESLGridCarouselRenderer.$fakeSlides} slides created in grid mode */
  public override get $slides(): HTMLElement[] {
    return (this.$carousel.$slides || []).concat(this.$fakeSlides);
  }

  /** creates fake slide element */
  public buildFakeSlide(): HTMLElement {
    const $slide = document.createElement('div');
    $slide.setAttribute('esl-carousel-fake-slide', '');
    return $slide;
  }

  /**
   * Processes binding of defined renderer to the carousel {@link ESLCarousel}.
   * Prepare to renderer animation.
   */
  public override onBind(): void {
    memoize.clear(this, '$fakeSlides');
    this.$area.append(...this.$fakeSlides);
    super.onBind();
  }

  /**
   * Processes unbinding of defined renderer from the carousel {@link ESLCarousel}.
   * Clear animation.
   */
  public override onUnbind(): void {
    this.$fakeSlides.forEach((el) => el.remove());
    super.onUnbind();
  }

  /**
   * Normalize actual active index to the first slide in the current dimension ('row')
   */
  protected override normalizeIndex(index: number, params?: ESLCarouselActionParams): number {
    return super.normalizeIndex(index - (index % this.ROWS), params);
  }

  /**
   * @returns count of slides to be rendered (reserved) before the first slide does not include fake slides
   */
  protected override getReserveCount(back?: boolean): number {
    const reserve = super.getReserveCount(back);
    return reserve - (reserve % this.ROWS);
  }

  /** Sets min size for slides */
  protected override resize(): void {
    if (!this.$area) return;
    const areaStyles = getComputedStyle(this.$area);

    this.gap = parseFloat(this.vertical ? areaStyles.rowGap : areaStyles.columnGap);
    const areaSize = parseFloat(this.vertical ? areaStyles.height : areaStyles.width);
    const count = Math.floor(this.count / this.ROWS);
    const slideSize = Math.floor((areaSize - this.gap * (count - 1)) / count);
    this.$area.style.setProperty(ESLDefaultCarouselRenderer.SIZE_PROP, slideSize + 'px');
  }
}

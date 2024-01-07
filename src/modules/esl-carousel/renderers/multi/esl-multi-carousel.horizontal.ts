import {ESLCarouselRenderer} from '../../core/esl-carousel.renderer';

import {ESLMultiCarouselRenderer} from './esl-multi-carousel';

@ESLCarouselRenderer.register
export class ESLHorizontalMultiCarouselRenderer extends ESLMultiCarouselRenderer {
  public static override is = 'horizontal';

  /** Sets order style property for slides starting at index */
  protected override resize(): void {
    const {$area} = this;
    if (!$area) return;
    const slidesAreaStyles = getComputedStyle($area);
    const width = parseFloat(slidesAreaStyles.width);
    this.gap = parseFloat(slidesAreaStyles.columnGap);
    this.slideSize = (width - this.gap * (this.count - 1)) / this.count;
    this.$slides.forEach((slide) => slide.style.setProperty('min-width', this.slideSize + 'px'));
  }

  protected override clear(): void {
    this.$slides.forEach((el) => el.style.removeProperty('min-width'));
  }

  protected override getOffset(index: number): number {
    return this.$slides[index]?.offsetLeft || 0;
  }

  protected override setTransformOffset(offset: number): void {
    this.$area.style.transform = `translate3d(${offset}px, 0px, 0px)`;
  }
}

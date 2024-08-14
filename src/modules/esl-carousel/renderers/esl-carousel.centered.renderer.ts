import {normalize} from '../core/nav/esl-carousel.nav.utils';
import {ESLCarouselRenderer} from '../core/esl-carousel.renderer';
import {ESLDefaultCarouselRenderer} from './esl-carousel.default.renderer';

/**
 * {@link ESLDefaultCarouselRenderer} extension with positioning logic updated to center active slides inside the carousel area
 *
 * @see ESLDefaultCarouselRenderer
 */
@ESLCarouselRenderer.register
export class ESLCenteredCarouselRenderer extends ESLDefaultCarouselRenderer {
  public static override is = 'centered';
  public static override classes: string[] = ['esl-carousel-centered-renderer', 'esl-carousel-default-renderer'];

  /** Size of all active slides */
  public get activeSlidesSize(): number {
    const count = Math.min(this.count, this.size);
    let width = (count - 1) * this.gap;
    for (let i = 0; i < count; i++) {
      const position = normalize(i + this.currentIndex, this.size);
      const $slide = this.$slides[position];
      width += this.vertical ? $slide.offsetHeight : $slide.offsetWidth;
    }
    return width;
  }

  /** Carousel size */
  public get carouselSize(): number {
    return this.vertical ? this.$carousel.clientHeight : this.$carousel.clientWidth;
  }

  /** Carousel padding value */
  public get carouselPadding(): number {
    const carouselStyles = getComputedStyle(this.$carousel);
    return parseFloat(carouselStyles[this.vertical ? 'paddingTop' : 'paddingLeft']);
  }

  /** @returns slide offset by the slide index */
  protected override getOffset(index: number): number {
    const offset = super.getOffset(index);
    return offset - (this.carouselSize - this.activeSlidesSize) / 2 + this.carouselPadding;
  }
}

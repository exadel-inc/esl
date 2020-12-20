import {ExportNs} from '../../../esl-utils/environment/export-ns';
import ESLCarouselPlugin from './esl-carousel-plugin';

/**
 * Slide Carousel Dots plugin
 * Dots plugin renders carousel dots navigation
 *
 * @author Julia Murashko
 */
@ExportNs('CarouselPlugins.Dots')
export class ESLCarouselDotsPlugin extends ESLCarouselPlugin {
  public static is = 'esl-carousel-dots';
  public static freePlacement = true;

  private _onUpdate = () => this.rerender();

  public bind() {
    this.rerender();
    this.carousel.addEventListener('esl:carousel:slide:changed', this._onUpdate);
  }

  public unbind() {
    this.innerHTML = '';
    this.carousel.removeEventListener('esl:carousel:slide:changed', this._onUpdate);
  }

  public rerender() {
    let html = '';
    const activeDot = Math.floor(this.carousel.activeIndexes[this.carousel.activeCount - 1] / this.carousel.activeCount);
    for (let i = 0; i < Math.ceil(this.carousel.count / this.carousel.activeCount); ++i) {
      html += this.buildDot(i, i === activeDot);
    }
    this.innerHTML = html;
  }

  public buildDot(index: number, isActive: boolean) {
    return `<button role="button" class="carousel-dot ${isActive ? 'active-dot' : ''}" data-slide-target="g${index + 1}"></button>`;
  }
}

export default ESLCarouselDotsPlugin;


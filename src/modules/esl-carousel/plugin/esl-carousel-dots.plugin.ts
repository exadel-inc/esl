import {ExportNs} from '../../esl-utils/environment/export-ns';
import {bind} from '../../esl-utils/decorators/bind';
import {ARROW_LEFT, ARROW_RIGHT} from '../../esl-utils/dom/keys';
import {findNextLooped, findPrevLooped} from '../../esl-utils/dom/traversing';
import {ESLCarouselPlugin} from './esl-carousel-plugin';

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

  private _onUpdate = (): void => this.rerender();

  public bind(): void {
    this.rerender();
    this.carousel.addEventListener('esl:slide:changed', this._onUpdate);
    this.addEventListener('keydown', this._onKeydown);
  }

  public unbind(): void {
    this.innerHTML = '';
    this.carousel.removeEventListener('esl:slide:changed', this._onUpdate);
    this.removeEventListener('keydown', this._onKeydown);
  }

  public rerender(): void {
    let html = '';
    const activeDot = Math.floor(this.carousel.activeIndexes[this.carousel.activeCount - 1] / this.carousel.activeCount);
    for (let i = 0; i < Math.ceil(this.carousel.count / this.carousel.activeCount); ++i) {
      html += this.buildDot(i, i === activeDot);
    }
    this.innerHTML = html;
  }

  public buildDot(index: number, isActive: boolean): string {
    return `<button role="button" class="carousel-dot ${isActive ? 'active-dot' : ''}"
            aria-current="${isActive ? 'true' : 'false'}" data-slide-target="g${index + 1}"></button>`;
  }

  /** Handles `keydown` event */
  @bind
  protected _onKeydown(event: KeyboardEvent): void {
    if (ARROW_LEFT === event.key) {
      const $eventTarget: HTMLElement = event.target as HTMLElement;
      const $nextDot = findPrevLooped($eventTarget, '.carousel-dot') as HTMLElement;
      $nextDot.click();
    }
    if (ARROW_RIGHT === event.key) {
      const $eventTarget: HTMLElement = event.target as HTMLElement;
      const $nextDot = findNextLooped($eventTarget, '.carousel-dot') as HTMLElement;
      $nextDot.click();
    }
  }
}

declare global {
  export interface ESLCarouselPlugins {
    Dots: typeof ESLCarouselDotsPlugin;
  }
  export interface HTMLElementTagNameMap {
    'esl-carousel-dots': ESLCarouselDotsPlugin;
  }
}

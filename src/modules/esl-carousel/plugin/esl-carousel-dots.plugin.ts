import {ExportNs} from '../../esl-utils/environment/export-ns';
import {bind, listen} from '../../esl-utils/decorators';
import {ARROW_LEFT, ARROW_RIGHT} from '../../esl-utils/dom/keys';
import {findNextLooped, findPrevLooped} from '../../esl-utils/dom/traversing';

import {ESLCarouselPlugin} from '../core/esl-carousel-plugin';

/**
 * Slide Carousel Dots plugin
 * Dots plugin renders carousel dots navigation
 *
 * @author Julia Murashko
 */
@ExportNs('CarouselPlugins.Dots')
export class ESLCarouselDotsPlugin extends ESLCarouselPlugin {
  public static override is = 'esl-carousel-dots';
  public static override DEFAULT_TARGET = '::parent([esl-carousel-container])::find(esl-carousel)';

  public bind(): void {
    this.rerender();
    this.carousel.addEventListener('esl:slide:changed', this._onUpdate);
  }

  public unbind(): void {
    this.innerHTML = '';
    this.carousel.removeEventListener('esl:slide:changed', this._onUpdate);
  }

  /** Renders dots according to the carousel state. */
  public rerender(): void {
    let html = '';
    const activeDot = Math.floor(this.carousel.activeIndexes[this.carousel.count - 1] / this.carousel.count);
    for (let i = 0; i < Math.ceil(this.carousel.size / this.carousel.count); ++i) {
      html += this.buildDot(i, i === activeDot);
    }
    this.innerHTML = html;
  }

  /** Builds content of dots. */
  public buildDot(index: number, isActive: boolean): string {
    return `<button role="button"
                data-group-index="${index + 1}"
                class="carousel-dot ${isActive ? 'active-dot' : ''}"
                aria-current="${isActive ? 'true' : 'false'}"></button>`;
  }

  @bind
  protected _onUpdate(e: Event): void {
    if (this.carousel !== e.target) return;
    this.rerender();
  }

  @listen('click')
  protected _onClick(event: PointerEvent): void {
    const $target = (event.target as Element).closest('[data-group-index]');
    if (!$target) return;
    const index = +($target.getAttribute('data-group-index') || '0');
    this.carousel.goTo('g' + index);
  }

  /** Handles `keydown` event. */
  @listen('keydown')
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

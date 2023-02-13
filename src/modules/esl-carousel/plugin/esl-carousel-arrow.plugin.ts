import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLCarouselPlugin} from '../core/esl-carousel-plugin';
import {listen, attr} from '../../esl-base-element/core';

/**
 * Slide Carousel Arrow plugin
 * Arrow plugin renders carousel arrow navigation
 *
 * @author Julia Murashko
 */
@ExportNs('CarouselPlugins.Arrow')
export class ESLCarouselArrowPlugin extends ESLCarouselPlugin {
  public static is = 'esl-carousel-arrow';
  public static DEFAULT_TARGET = '::parent([esl-carousel-container])::find(esl-carousel)';

  /** Horizontal scroll orientation marker */
  @attr({name: 'direction', defaultValue: 'next'}) public direction: string;

  public bind(): void {
    this.rerender();
  }

  public unbind(): void {
    this.innerHTML = '';
  }

  /** Renders arrow. */
  public rerender(): void {
    this.innerHTML = this.buildArrow();
  }

  /** Builds content of arrow according to the direction. */
  public buildArrow(): string {
    return `<button class="arrow-${this.direction} icon-arrow-${this.direction}"
                    data-slide-target="${this.direction}"></button>`;
  }

  @listen({event: 'click'})
  protected _onClick(event: PointerEvent): void {
    if (!this.carousel.loop &&    // check if the end point position
      this.direction === 'next' &&
      this.carousel.$activeSlides[this.carousel.$activeSlides.length - 1].index === (this.carousel.$slides.length - 1)) {
      return;
    }
    if (!this.carousel.loop &&   // check if the start point position
      this.direction === 'prev' &&
      this.carousel.$activeSlides[0].index === 0) {
      return;
    }
    this.carousel.goTo(this.direction);
  }

  // /** Handles `keydown` event. */
  // @listen('keydown')
  // protected _onKeydown(event: KeyboardEvent): void {
  //   if (ARROW_LEFT === event.key) {
  //     const $eventTarget: HTMLElement = event.target as HTMLElement;
  //     const $nextDot = findPrevLooped($eventTarget, '.carousel-dot') as HTMLElement;
  //     $nextDot.click();
  //   }
  //   if (ARROW_RIGHT === event.key) {
  //     const $eventTarget: HTMLElement = event.target as HTMLElement;
  //     const $nextDot = findNextLooped($eventTarget, '.carousel-dot') as HTMLElement;
  //     $nextDot.click();
  //   }
  // }
}

declare global {
  export interface ESLCarouselPlugins {
    Arrow: typeof ESLCarouselArrowPlugin;
  }
  export interface HTMLElementTagNameMap {
    'esl-carousel-arrow': ESLCarouselArrowPlugin;
  }
}

// TODO: rework, simplify and refactor
import {ExportNs} from '../../../esl-utils/environment/export-ns';
import {attr, listen, memoize, ready} from '../../../esl-utils/decorators';
import {ARROW_LEFT, ARROW_RIGHT} from '../../../esl-utils/dom/keys';
import {findNextLooped, findPrevLooped} from '../../../esl-utils/dom/traversing';
import {ESLBaseElement} from '../../../esl-base-element/core';
import {ESLTraversingQuery} from '../../../esl-traversing-query/core';

import {indexToGroup} from '../../core/nav/esl-carousel.nav.utils';
import {ESLCarouselChangeEvent, ESLCarouselSlideEvent} from '../../core/esl-carousel.events';

import type {ESLCarousel} from '../../core/esl-carousel';

/**
 * {@link ESLCarousel} Dots navigation element
 * @author Julia Murashko
 *
 * Example:
 * ```
 * <esl-carousel-dots></esl-carousel-dots>
 * ```
 */
@ExportNs('Carousel.Dots')
export class ESLCarouselNavDots extends ESLBaseElement {
  public static override is = 'esl-carousel-dots';

  /** {@link ESLTraversingQuery} string to find {@link ESLCarousel} instance */
  @attr({
    defaultValue: '::parent([esl-carousel-container])::find(esl-carousel)'
  })
  public carousel: string;

  /** @returns ESLCarousel instance; based on {@link carousel} attribute */
  @memoize()
  public get $carousel(): ESLCarousel | null {
    return ESLTraversingQuery.first(this.carousel, this) as ESLCarousel;
  }

  @ready
  public override async connectedCallback(): Promise<void> {
    this.$$attr('disabled', true);
    if (!this.$carousel) return;
    await customElements.whenDefined(this.$carousel.tagName.toLowerCase());
    super.connectedCallback();
    this.rerender();
    this.updateA11y();
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    memoize.clear(this, '$carousel');
  }

  /** Renders dots according to the carousel state. */
  public rerender(): void {
    if (!this.$carousel) return;
    const {activeIndex, count, size} = this.$carousel.state;
    this.$$attr('disabled', size < 2);
    let html = '';
    const activeDot = indexToGroup(activeIndex, count, size);
    for (let i = 0; i < Math.ceil(size / count); ++i) {
      html += this.buildDot(i, i === activeDot);
    }
    this.innerHTML = html;
  }

  /** Builds content of dots. */
  public buildDot(index: number, isActive: boolean): string {
    return `<button role="button"
                aria-label="Show group ${index  + 1}"
                aria-disabled="${isActive}"
                data-nav-target="group:${index}"
                class="carousel-dot ${isActive ? 'active-dot' : ''}"
                aria-current="${isActive ? 'true' : 'false'}"></button>`;
  }

  protected updateA11y(): void {
    this.$$attr('role', 'group');
    if (!this.hasAttribute('aria-label')) {
      this.$$attr('aria-label', 'Carousel dots');
    }
  }

  /** Handles carousel state changes */
  @listen({
    event: `${ESLCarouselSlideEvent.AFTER} ${ESLCarouselChangeEvent.TYPE}`,
    target: ($el: ESLCarouselNavDots) => $el.$carousel
  })
  protected _onSlideChange(e: Event): void {
    if (this.$carousel !== e.target) return;
    this.rerender();
  }

  /** Handles `click` on the dots */
  @listen('click')
  protected _onClick(event: PointerEvent): void {
    if (!this.$carousel || typeof this.$carousel.goTo !== 'function') return;
    const $target = (event.target as Element).closest('[data-nav-target]');
    if (!$target) return;
    this.$carousel.goTo($target.getAttribute('data-nav-target')!);
  }

  /** Handles `keydown` event */
  @listen('keydown')
  protected _onKeydown(event: KeyboardEvent): void {
    const $eventTarget: HTMLElement = event.target as HTMLElement;
    if (ARROW_LEFT === event.key) {
      const $prevDot = findPrevLooped($eventTarget, '.carousel-dot') as HTMLElement;
      $prevDot.click();
    }
    if (ARROW_RIGHT === event.key) {
      const $nextDot = findNextLooped($eventTarget, '.carousel-dot') as HTMLElement;
      $nextDot.click();
    }
  }
}

declare global {
  export interface ESLCarouselNS {
    Dots: typeof ESLCarouselNavDots;
  }
  export interface HTMLElementTagNameMap {
    'esl-carousel-dots': ESLCarouselNavDots;
  }
}

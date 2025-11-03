import {ExportNs} from '../../../esl-utils/environment/export-ns';
import {format} from '../../../esl-utils/misc/format';
import {attr, memoize, listen} from '../../../esl-utils/decorators';
import {ESLBaseElement} from '../../../esl-base-element/core';
import {ESLTraversingQuery} from '../../../esl-traversing-query/core';

import {indexToGroup} from '../../core/esl-carousel.utils';
import {ESLCarouselChangeEvent, ESLCarouselSlideEvent} from '../../core/esl-carousel.events';

import type {ESLCarousel} from '../../core/esl-carousel';

/**
 * {@link ESLCarousel} — Element for displaying dynamic textual information based on the carousel’s current state.
 *
 * Example:
 * ```
 * <esl-carousel-info format="Slide {current} of {total}"></esl-carousel-info>
 * ```
 */
@ExportNs('Carousel.Info')
export class ESLCarouselInfo extends ESLBaseElement {
  public static override is = 'esl-carousel-info';
  public static observedAttributes = ['format', 'target'];

  /** {@link ESLTraversingQuery} string to find {@link ESLCarousel} instance */
  @attr({
    name: 'target',
    defaultValue: '::parent(.esl-carousel-nav-container)::find(esl-carousel)'
  })
  public carousel: string;

  /** Format string used to render info text. Supports `{name}`, `{{name}}` and `{%name%}` */
  @attr({defaultValue: '{current} of {total}'})
  public format: string;

  /** Returns ESLCarousel instance based on `target` attr */
  @memoize()
  public get $carousel(): ESLCarousel | null {
    return ESLTraversingQuery.first(this.carousel, this) as ESLCarousel;
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    this.update();
    this.initA11y();
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    memoize.clear(this, ['$carousel']);
  }

  public override attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (!this.connected) return;
    if (name === 'target') {
      memoize.clear(this, ['$carousel']);
      this.$$on(this._onSlideChange);
    }
    this.update();
  }

  /** Builds state object used for formatting */
  protected get state(): Record<string, any> {
    if (!this.$carousel?.renderer) return {};
    const {activeIndex, size, count} = this.$carousel.state;

    const current = indexToGroup(activeIndex, count, size) + 1; // 1-based
    const total = count ? Math.ceil(size / count) : 0;
    const currentSlide = activeIndex + 1; // 1-based
    const totalSlides = size;
    const title = this.activeTitle;
    const percent = total ? Math.round((current / total) * 100) : 0;

    return {current, total, currentSlide, totalSlides, title, percent};
  }

  /** Title text for the active slide */
  protected get activeTitle(): string {
    const $slide = this.$carousel?.$activeSlide;
    if (!$slide) return '';
    return ($slide.getAttribute('data-title') || $slide.getAttribute('title') || '').trim();
  }

  /** Updates rendered content according to format and current state */
  public update(): void {
    if (!this.$carousel) memoize.clear(this, '$carousel');
    if (!this.$carousel) return;

    this.textContent = format(this.format, this.state);
  }

  /** Inits a11y of `ESLCarouselInfo` as a status container */
  protected initA11y(): void {
    if (!this.hasAttribute('role')) this.$$attr('role', 'status');
    if (!this.hasAttribute('aria-live')) this.$$attr('aria-live', 'polite');
  }

  /** Handles carousel state changes */
  @listen({
    event: `${ESLCarouselSlideEvent.AFTER} ${ESLCarouselChangeEvent.TYPE}`,
    target: ($el: ESLCarouselInfo) => $el.$carousel
  })
  protected _onSlideChange(e: Event): void {
    if (this.$carousel === e.target) this.update();
  }
}

declare global {
  export interface ESLCarouselNS {
    Info: typeof ESLCarouselInfo;
  }
  export interface HTMLElementTagNameMap {
    'esl-carousel-info': ESLCarouselInfo;
  }
}

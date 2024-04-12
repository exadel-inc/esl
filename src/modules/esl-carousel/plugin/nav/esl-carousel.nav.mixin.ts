import {ExportNs} from '../../../esl-utils/environment/export-ns';
import {attr, listen, memoize, ready} from '../../../esl-utils/decorators';
import {ESLMixinElement} from '../../../esl-mixin-element/core';
import {ESLTraversingQuery} from '../../../esl-traversing-query/core';

import {ESLCarouselChangeEvent, ESLCarouselSlideEvent} from '../../core/esl-carousel.events';

import type {ESLCarousel} from '../../core/esl-carousel';
import type {ESLCarouselSlideTarget} from '../../core/nav/esl-carousel.nav.types';

/**
 * ESLCarousel navigation helper to define triggers for carousel navigation.
 *
 * Example:
 * ```
 * <div esl-carousel-container>
 *  <button esl-carousel-nav="group:prev">Prev</button>
 *  <esl-carousel>...</esl-carousel>
 *  <button esl-carousel-nav="group:next">Next</button>
 * </div>
 * ```
 */
@ExportNs('Carousel.Nav')
export class ESLCarouselNavMixin extends ESLMixinElement {
  static override is = 'esl-carousel-nav';

  /** {@link ESLCarouselSlideTarget} target to navigate in carousel */
  @attr({name: ESLCarouselNavMixin.is}) public target: ESLCarouselSlideTarget;

  /** {@link ESLTraversingQuery} string to find {@link ESLCarousel} instance */
  @attr({
    name: ESLCarouselNavMixin.is + '-target',
    defaultValue: '::parent([esl-carousel-container])::find(esl-carousel)'
  })
  public carousel: string;

  /** @returns ESLCarousel instance; based on {@link carousel} attribute */
  @memoize()
  public get $carousel(): ESLCarousel | null {
    return ESLTraversingQuery.first(this.carousel, this.$host) as ESLCarousel;
  }

  @ready
  public override async connectedCallback(): Promise<void> {
    this.$$attr('disabled', true);
    if (!this.$carousel) return;
    await customElements.whenDefined(this.$carousel.tagName.toLowerCase());
    super.connectedCallback();
    this._onSlideChange();
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    memoize.clear(this, '$carousel');
  }

  /** Handles carousel state changes */
  @listen({
    event: `${ESLCarouselSlideEvent.AFTER} ${ESLCarouselChangeEvent.TYPE}`,
    target: ($nav: ESLCarouselNavMixin) => $nav.$carousel
  })
  protected _onSlideChange(): void {
    const canNavigate = this.$carousel && this.$carousel.canNavigate(this.target);
    this.$$attr('disabled', !canNavigate);
  }

  /** Handles $host element click */
  @listen('click')
  protected _onClick(e: PointerEvent): void {
    if (!this.$carousel || typeof this.$carousel.goTo !== 'function') return;
    this.$carousel.goTo(this.target);
    e.preventDefault();
  }
}

declare global {
  export interface ESLCarouselNS {
    Nav: typeof ESLCarouselNavMixin;
  }
}

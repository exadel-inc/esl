import {attr, listen, memoize} from '../../esl-utils/decorators';
import {ESLMixinElement} from '../../esl-mixin-element/core';
import {ESLTraversingQuery} from '../../esl-traversing-query/core';

import type {ESLCarousel} from '../core/esl-carousel';
import type {ESLCarouselSlideTarget} from '../core/nav/esl-carousel.nav.types';

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

  public override async connectedCallback(): Promise<void> {
    this.$$attr('disabled', true);
    if (!this.$carousel) return;
    await customElements.whenDefined(this.$carousel.tagName.toLowerCase());
    super.connectedCallback();
    this.onSlideChange();
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    memoize.clear(this, '$carousel');
  }

  @listen({
    event: 'esl:slide:changed',
    target: ($nav: ESLCarouselNavMixin) => $nav.$carousel
  })
  protected onSlideChange(): void {
    const canNavigate = this.$carousel && this.$carousel.canNavigate(this.target);
    this.$$attr('disabled', !canNavigate);
  }

  @listen('click')
  protected onClick(e: PointerEvent): void {
    if (!this.$carousel || typeof this.$carousel.goTo !== 'function') return;
    this.$carousel.goTo(this.target);
    e.preventDefault();
  }
}

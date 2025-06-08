import {ExportNs} from '../../../esl-utils/environment/export-ns';
import {attr, listen, memoize, ready} from '../../../esl-utils/decorators';
import {ESLMixinElement} from '../../../esl-mixin-element/core';
import {ESLTraversingQuery} from '../../../esl-traversing-query/core';

import {ESLCarouselChangeEvent, ESLCarouselSlideEvent} from '../../core/esl-carousel.events';

import type {ESLCarousel} from '../../core/esl-carousel';
import type {ESLCarouselSlideTarget} from '../../core/esl-carousel.types';

/**
 * ESLCarousel navigation helper to define triggers for carousel navigation.
 *
 * Example:
 * ```
 * <div class="esl-carousel-nav-container">
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
  @attr({name: ESLCarouselNavMixin.is}) public command: ESLCarouselSlideTarget;

  /** {@link ESLTraversingQuery} string to find {@link ESLCarousel} instance */
  @attr({
    name: ESLCarouselNavMixin.is + '-target',
    defaultValue: '::parent(.esl-carousel-nav-container)::find(esl-carousel)'
  })
  public carousel: string;

  /** @returns ESLCarousel instance; based on {@link carousel} attribute */
  @memoize()
  public get $carousel(): ESLCarousel {
    return ESLTraversingQuery.first(this.carousel, this.$host) as ESLCarousel;
  }

  public get isActive(): boolean {
    return !!this.$carousel?.renderer && !this.$carousel.incomplete;
  }

  /** @returns accessible target ID */
  public get targetID(): string {
    return this.$carousel?.id || '';
  }

  @ready
  public override connectedCallback(): void {
    super.connectedCallback();
    if (!this.$carousel) return;
    if (this.$carousel.renderer) this._onUpdate();
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    memoize.clear(this, '$carousel');
    this.$$attr('active', false);
    this.$$attr('disabled', false);
  }

  /** Handles carousel state changes */
  @listen({
    event: `${ESLCarouselChangeEvent.TYPE} ${ESLCarouselSlideEvent.AFTER}`,
    target: ($nav: ESLCarouselNavMixin) => $nav.$carousel
  })
  protected _onUpdate(): void {
    const isActive = this.isActive;
    const isCurrent = isActive && this.$carousel.isCurrent(this.command);
    const isDisabled = isActive && !this.$carousel.canNavigate(this.command);
    this.$$attr('active', isActive);
    this.$$attr('disabled', isDisabled);
    this.$$attr('current', isCurrent);
    this.$$attr('aria-controls', this.targetID);
  }

  /** Handles $host element click */
  @listen('click')
  protected _onClick(e: PointerEvent): void {
    if (!this.$carousel || typeof this.$carousel.goTo !== 'function') return;
    this.$carousel.goTo(this.command).catch(console.debug);
    e.preventDefault();
  }
}

declare global {
  export interface ESLCarouselNS {
    Nav: typeof ESLCarouselNavMixin;
  }
}

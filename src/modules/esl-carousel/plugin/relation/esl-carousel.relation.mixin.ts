import {ExportNs} from '../../../esl-utils/environment/export-ns';
import {attr, listen, memoize} from '../../../esl-utils/decorators';
import {ESLTraversingQuery} from '../../../esl-traversing-query/core';

import {ESLCarousel} from '../../core/esl-carousel';
import {ESLCarouselPlugin} from '../esl-carousel.plugin';

/**
 * Slide Carousel Link plugin mixin to bind carousel positions
 */
@ExportNs('Carousel.Link')
export class ESLCarouselRelationMixin extends ESLCarouselPlugin {
  public static override is = 'esl-carousel-relate-to';

  @attr({name: ESLCarouselRelationMixin.is})
  public target: string;

  @memoize()
  public get $target(): ESLCarousel | null {
    const $target = ESLTraversingQuery.first(this.target);
    return ($target instanceof ESLCarousel) ? $target : null;
  }

  protected override attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    memoize.clear(this, '$target');
  }

  /** Handles event that fires when the carousel slides state is changed. */
  @listen('esl:slide:changed')
  protected _onSlideChange(e: CustomEvent): void {
    if (!this.$target) return;
    if (e.detail.activator !== this) {
      this.$target.goTo(this.$host.firstIndex, {
        direction: e.detail.direction,
        activator: this
      });
    }
  }
}

declare global {
  export interface ESLCarouselNS {
    Link: typeof ESLCarouselRelationMixin;
  }
}

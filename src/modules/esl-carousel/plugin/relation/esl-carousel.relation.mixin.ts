import {ExportNs} from '../../../esl-utils/environment/export-ns';
import {attr, listen, memoize} from '../../../esl-utils/decorators';
import {parseBoolean} from '../../../esl-utils/misc/format';
import {ESLTraversingQuery} from '../../../esl-traversing-query/core';

import {ESLCarousel} from '../../core/esl-carousel';
import {ESLCarouselPlugin} from '../esl-carousel.plugin';
import {ESLCarouselSlideEvent} from '../../core/esl-carousel.events';

/**
 * Slide Carousel Link plugin mixin to bind carousel positions
 */
@ExportNs('Carousel.RelateTo')
export class ESLCarouselRelateToMixin extends ESLCarouselPlugin {
  public static override is = 'esl-carousel-relate-to';

  @attr({name: ESLCarouselRelateToMixin.is})
  public target: string;

  @attr({name: ESLCarouselRelateToMixin.is + '-proactive', parser: parseBoolean})
  public proactive: boolean;

  protected get event(): string {
    return this.proactive ? ESLCarouselSlideEvent.BEFORE : ESLCarouselSlideEvent.AFTER;
  }

  /** @returns ESLCarousel target to share state changes */
  @memoize()
  public get $target(): ESLCarousel | null {
    const $target = ESLTraversingQuery.first(this.target);
    return ($target instanceof ESLCarousel) ? $target : null;
  }

  protected override attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    this.$$off(this._onSlideChange);
    memoize.clear(this, '$target');
    this.$$on(this._onSlideChange);
  }

  /** Handles event that fires when the carousel slides state is changed. */
  @listen({event: ($this: ESLCarouselRelateToMixin) => $this.event})
  protected _onSlideChange(e: ESLCarouselSlideEvent): void {
    if (!this.$target || e.activator === this) return;
    this.$target.goTo(this.$host.activeIndex, {
      activator: this
    });
  }
}

declare global {
  export interface ESLCarouselNS {
    RelateTo: typeof ESLCarouselRelateToMixin;
  }
}

import {ExportNs} from '../../../esl-utils/environment/export-ns';
import {listen, memoize} from '../../../esl-utils/decorators';
import {ESLTraversingQuery} from '../../../esl-traversing-query/core';

import {ESLCarousel} from '../../core/esl-carousel';
import {ESLCarouselPlugin} from '../esl-carousel.plugin';
import {ESLCarouselSlideEvent} from '../../core/esl-carousel.events';

export interface ESLCarouselRelateToConfig {
  /** Target carousel selector */
  target: string;
  /** Proactive mode to relate to the target immediately */
  proactive: boolean;
}

/**
 * Slide Carousel Link plugin mixin to bind carousel positions
 */
@ExportNs('Carousel.RelateTo')
export class ESLCarouselRelateToMixin extends ESLCarouselPlugin<ESLCarouselRelateToConfig> {
  public static override is = 'esl-carousel-relate-to';
  public static override SHORT_OPTION = 'target';

  protected get event(): string {
    return this.config.proactive ? ESLCarouselSlideEvent.BEFORE : ESLCarouselSlideEvent.AFTER;
  }

  /** @returns ESLCarousel target to share state changes */
  @memoize()
  public get $target(): ESLCarousel | null {
    const $target = ESLTraversingQuery.first(this.config.target);
    return ($target instanceof ESLCarousel) ? $target : null;
  }

  protected override onConfigChange(): void {
    // Listener event change is not handled by resubscribe automatically
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

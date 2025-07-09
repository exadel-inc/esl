import {ExportNs} from '../../../esl-utils/environment/export-ns';
import {listen, memoize} from '../../../esl-utils/decorators';
import {ESLTraversingQuery} from '../../../esl-traversing-query/core';

import {ESLCarousel} from '../../core/esl-carousel';
import {ESLCarouselPlugin} from '../esl-carousel.plugin';
import {ESLCarouselSlideEvent} from '../../core/esl-carousel.events';

export interface ESLCarouselRelateToConfig {
  /** Target carousel selector. Set to '' or 'none' to disable */
  target: string;
  /** A proactive mode to relate to the target immediately */
  proactive: boolean;
}

/**
 * Slide Carousel Link plugin mixin to bind carousel positions
 */
@ExportNs('Carousel.RelateTo')
export class ESLCarouselRelateToMixin extends ESLCarouselPlugin<ESLCarouselRelateToConfig> {
  public static override is = 'esl-carousel-relate-to';
  public static override DEFAULT_CONFIG: ESLCarouselRelateToConfig = {
    target: 'none',
    proactive: false
  };
  public static override DEFAULT_CONFIG_KEY = 'target';

  /** @returns event name(s) to listen for carousel state changes */
  protected get event(): string {
    return [this.config.proactive ? ESLCarouselSlideEvent.CHANGE : null, ESLCarouselSlideEvent.AFTER].filter(Boolean).join(' ');
  }

  /** @returns ESLCarousel target to share state changes */
  @memoize()
  public get $target(): ESLCarousel | null {
    const {target} = this.config;
    if (!target || target === 'none') return null;
    const $target = ESLTraversingQuery.first(target, this.$host);
    // Prevent cyclic reference - target should not be the host itself
    if (!($target instanceof ESLCarousel) || $target === this.$host) return null;
    return $target;
  }

  protected override onInit(): void {
    if (!this.$target) return;
    // Sync host carousel to target's current position
    this.$host.goTo(this.$target.activeIndex, {activator: this}).catch(console.debug);
  }

  @listen({inherit: true})
  protected override onConfigChange(): void {
    // Listener event change is not handled by resubscribe automatically
    this.$$off(this._onSlideChange);
    super.onConfigChange();
    memoize.clear(this, '$target');
    this.$$on(this._onSlideChange);
  }

  /** Handles event that fires when the target carousel slides state is changed. */
  @listen({
    event: ($this: ESLCarouselRelateToMixin) => $this.event,
    target: ($this: ESLCarouselRelateToMixin) => $this.$target
  })
  protected _onSlideChange(e: ESLCarouselSlideEvent): void {
    if (!this.$target || e.activator === this) return;
    // Make host carousel follow the target carousel
    this.$host.goTo(e.indexAfter, {activator: this}).catch(console.debug);
  }
}

declare global {
  export interface ESLCarouselNS {
    RelateTo: typeof ESLCarouselRelateToMixin;
  }
}


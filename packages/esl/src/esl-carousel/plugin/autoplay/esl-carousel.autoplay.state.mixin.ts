import {ExportNs} from '../../../esl-utils/environment/export-ns';
import {attr, listen, memoize, ready} from '../../../esl-utils/decorators';
import {ESLMixinElement} from '../../../esl-mixin-element/core';

import {ESLCarouselAutoplayMixin} from './esl-carousel.autoplay.mixin';
import {ESLCarouselAutoplayEvent} from './esl-carousel.autoplay.event';

import type {ESLCarousel} from '../../core/esl-carousel';
import type {ESLCarouselAutoplayHostState} from './esl-carousel.autoplay.types';

/**
 * Read-only autoplay state mixin.
 * Resolves the target carousel, subscribes to autoplay invalidation events and reflects current autoplay state on host.
 */
@ExportNs('Carousel.AutoplayState')
export class ESLCarouselAutoplayStateMixin extends ESLMixinElement {
  public static override is = 'esl-carousel-autoplay-state';
  public static DEFAULT_TARGET = '::parent(.esl-carousel-nav-container)::find(esl-carousel)';

  /** Selector to find target carousel */
  @attr({
    name: 'esl-carousel-autoplay-target',
    defaultValue: ESLCarouselAutoplayStateMixin.DEFAULT_TARGET
  })
  public target: string;

  /** Target carousel instance */
  @memoize()
  public get $carousel(): ESLCarousel | null {
    return this.$$find(this.target) as ESLCarousel | null;
  }

  /** Target autoplay plugin instance */
  public get autoplay(): ESLCarouselAutoplayMixin | null {
    return this.$carousel ? ESLCarouselAutoplayMixin.get(this.$carousel) : null;
  }

  /** Controlled carousel id for a11y */
  public get targetID(): string | null {
    return this.$carousel?.id || null;
  }

  /** Exclusive summary state for the controlled autoplay instance */
  public get state(): ESLCarouselAutoplayHostState {
    return this.autoplay?.state ?? 'unavailable';
  }

  @ready
  public override connectedCallback(): void {
    super.connectedCallback();
    this.syncState();
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    memoize.clear(this, '$carousel');
  }

  /** Synchronize host state markers */
  protected syncState(): void {
    this.$$attr('disabled', !this.autoplay);
    this.$$attr('autoplay-state', this.state);
  }

  /** Handles autoplay state changes on target carousel */
  @listen({
    event: ESLCarouselAutoplayEvent.NAME,
    target: ($this: ESLCarouselAutoplayStateMixin) => $this.$carousel,
    condition: ($this: ESLCarouselAutoplayStateMixin) => !!$this.$carousel
  })
  protected _onStateChange(): void {
    this.syncState();
  }
}

declare global {
  export interface ESLCarouselNS {
    AutoplayState: typeof ESLCarouselAutoplayStateMixin;
  }
}


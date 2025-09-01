import {ESLMixinElement} from '../../../esl-mixin-element/core';
import {attr, boolAttr, listen} from '../../../esl-utils/decorators';
import {afterNextRender} from '../../../esl-utils/async/raf';
import {ESLCarouselAutoplayEvent} from './esl-carousel.autoplay.event';

/**
 * A mixin (custom attribute) element that manages the progress animation for the autoplay functionality
 * of an ESL Carousel. It listens for `ESLCarouselAutoplayEvent` events and updates
 * the animation state and autoplay status accordingly.
 * Uses three markers to represent the autoplay progress:
 * - `animate` attribute - appears on each cycle of active autoplay;
 * drops one frame before the next cycle to activate CSS animation
 * - `autoplay-enabled` attribute - indicates whether the autoplay plugin is enabled
 * - `--esl-autoplay-timeout` CSS variable - indicates the current autoplay cycle duration
 */
export class ESLCarouselAutoplayProgressMixin extends ESLMixinElement {
  public static override is = 'esl-carousel-autoplay-progress';

  /**
   * {@link ESLTraversingQuery} string to find {@link ESLCarousel} instance with autoplay plugin.
   * Searching for the carousel in bounds of the `.esl-carousel-nav-container` element by default.
   */
  @attr({
    name: 'target',
    defaultValue: '::parent(.esl-carousel-nav-container)::find(esl-carousel)'
  })
  public carousel: string;

  /** Attribute to start animation representing autoplay cycle */
  @boolAttr() public animate: boolean;
  /** Autoplay enabled status marker attribute */
  @boolAttr() public autoplayEnabled: boolean;

  protected override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    this.$$on(this._onChange);
  }

  @listen({
    event: ESLCarouselAutoplayEvent.NAME,
    target: ($this: ESLCarouselAutoplayProgressMixin) => $this.carousel
  })
  protected _onChange(e: ESLCarouselAutoplayEvent): void {
    this.autoplayEnabled = e.enabled;
    this.$host.style.setProperty('--esl-autoplay-timeout', `${e.duration}ms`);
    requestAnimationFrame(() => this.animate = false);
    e.active && afterNextRender(() => this.animate = true);
  }
}

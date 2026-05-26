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
 * - `--esl-autoplay-timeout` CSS variable - indicates the remaining autoplay cycle duration
 * - `--esl-autoplay-duration` CSS variable - indicates the full autoplay cycle duration
 * - `--esl-autoplay-progress` CSS variable - indicates completed progress ratio (0..1)
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
  /** Autoplay paused status marker attribute */
  @boolAttr() public autoplayPaused: boolean;
  /** Autoplay blocked status marker attribute */
  @boolAttr() public autoplayBlocked: boolean;

  protected override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    this.$$on(this._onChange);
  }

  @listen({
    event: ESLCarouselAutoplayEvent.NAME,
    target: ($this: ESLCarouselAutoplayProgressMixin) => $this.carousel
  })
  protected _onChange(e: ESLCarouselAutoplayEvent): void {
    const duration = Math.max(e.duration || 0, 0);
    const isProgressState = e.active || e.paused;
    const remaining = isProgressState ? Math.max(e.remaining || 0, 0) : duration;
    const elapsed = isProgressState ? Math.max(duration - remaining, 0) : 0;
    const progress = duration > 0 ? Math.min(elapsed / duration, 1) : 0;

    this.autoplayEnabled = e.enabled;
    this.autoplayPaused = e.paused;
    this.autoplayBlocked = e.blocked;
    this.$host.style.setProperty('--esl-autoplay-timeout', `${remaining}ms`);
    this.$host.style.setProperty('--esl-autoplay-duration', `${duration}ms`);
    this.$host.style.setProperty('--esl-autoplay-progress', `${progress}`);
    requestAnimationFrame(() => this.animate = false);
    e.active && afterNextRender(() => this.animate = true);
  }
}

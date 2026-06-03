import {boolAttr} from '../../../esl-utils/decorators';
import {afterNextRender} from '../../../esl-utils/async/raf';
import {ESLCarouselAutoplayStateMixin} from './esl-carousel.autoplay.state.mixin';

interface ESLCarouselAutoplayProgressSnapshot {
  active: boolean;
  duration: number;
  remaining: number;
  progress: number;
}

/**
 * A mixin (custom attribute) element that manages the progress animation for the autoplay functionality
 * of an ESL Carousel. It extends the autoplay state mixin and adds progress/animation markers.
 * Uses an exclusive autoplay state marker to represent autoplay progress:
 * - `animate` attribute - appears on each cycle of active autoplay;
 * drops one frame before the next cycle to activate CSS animation
 * - `autoplay-state` attribute - indicates the current autoplay runtime state
 * - `--esl-autoplay-timeout` CSS variable - indicates the remaining autoplay cycle duration
 * - `--esl-autoplay-duration` CSS variable - indicates the full autoplay cycle duration
 * - `--esl-autoplay-progress` CSS variable - indicates completed progress ratio (0..1)
 */
export class ESLCarouselAutoplayProgressMixin extends ESLCarouselAutoplayStateMixin {
  public static override is = 'esl-carousel-autoplay-progress';

  /** Attribute to start animation representing autoplay cycle */
  @boolAttr() public animate: boolean;

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.animate = false;
    this.$host.style.removeProperty('--esl-autoplay-timeout');
    this.$host.style.removeProperty('--esl-autoplay-duration');
    this.$host.style.removeProperty('--esl-autoplay-progress');
  }

  protected isBlockedProgress(baseRemaining: number): boolean {
    return !!this.autoplay?.blocked && baseRemaining > 0;
  }

  protected getProgressSnapshot(): ESLCarouselAutoplayProgressSnapshot {
    const autoplay = this.autoplay;
    const duration = Math.max(autoplay?.effectiveDuration || 0, 0);
    const active = autoplay?.active ?? false;
    const paused = autoplay?.paused ?? false;
    const baseRemaining = Math.max(autoplay?.remaining ?? 0, 0);
    const isProgressState = active || paused || this.isBlockedProgress(baseRemaining);
    const remaining = isProgressState ? baseRemaining : duration;
    const elapsed = isProgressState ? Math.max(duration - remaining, 0) : 0;
    const progress = duration > 0 ? Math.min(elapsed / duration, 1) : 0;

    return {active, duration, remaining, progress};
  }

  protected override syncState(): void {
    super.syncState();
    const {active, duration, remaining, progress} = this.getProgressSnapshot();

    this.$host.style.setProperty('--esl-autoplay-timeout', `${remaining}ms`);
    this.$host.style.setProperty('--esl-autoplay-duration', `${duration}ms`);
    this.$host.style.setProperty('--esl-autoplay-progress', `${progress}`);
    requestAnimationFrame(() => this.animate = false);
    active && afterNextRender(() => this.animate = true);
  }
}

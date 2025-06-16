import {promisifyNextRender} from '../../esl-utils/async/promise';
import {CSSClassUtils} from '../../esl-utils/dom/class';
import {ESLCarouselRenderer} from '../core/esl-carousel.renderer';
import {sign} from '../core/esl-carousel.utils';
import {ESLCarouselDirection} from '../core/esl-carousel.types';

import type {ESLCarouselActionParams} from '../core/esl-carousel.types';

@ESLCarouselRenderer.register
export class ESLCSSCarouselRenderer extends ESLCarouselRenderer {
  public static override is = 'css';
  public static override classes: string[] = ['esl-carousel-css-renderer'];

  public static readonly NEXT_SLIDE_TOLERANCE = 0.25;

  public static readonly OFFSET_PROP = '--esl-carousel-offset';
  public static readonly OFFSET_PROP_REL = '--esl-carousel-offset-ratio';

  /** Active index */
  protected currentIndex: number = 0;

  protected get tolerance(): number {
    return this.$carousel.clientWidth * ESLCSSCarouselRenderer.NEXT_SLIDE_TOLERANCE;
  }

  protected get offset(): number {
    const offset = this.$area.style.getPropertyValue(ESLCSSCarouselRenderer.OFFSET_PROP);
    return parseFloat(offset) || 0;
  }
  protected set offset(offset: number) {
    if (offset) {
      const abs = Math.min(1, Math.abs(offset) / this.tolerance);
      this.$area.style.setProperty(ESLCSSCarouselRenderer.OFFSET_PROP, `${offset.toFixed(1)}px`);
      this.$area.style.setProperty(ESLCSSCarouselRenderer.OFFSET_PROP_REL, abs.toFixed(4));
    } else {
      this.$area.style.removeProperty(ESLCSSCarouselRenderer.OFFSET_PROP);
      this.$area.style.removeProperty(ESLCSSCarouselRenderer.OFFSET_PROP_REL);
    }
  }

  /**
   * Processes binding of defined renderer to the carousel {@link ESLCarousel}.
   * Prepare to renderer animation.
   */
  public override onBind(): void {
    this.currentIndex = this.normalizeIndex(Math.max(0, this.$carousel.activeIndex));
    this.setActive(this.currentIndex);
  }

  /**
   * Processes unbinding of defined view from the carousel {@link ESLCarousel}.
   * Clear animation.
   */
  public override onUnbind(): void {
    this.onAfterAnimation();
  }

  /** Processes animation. */
  public override async onAnimate(index: number, direction: ESLCarouselDirection): Promise<void> {
    const {$activeSlide} = this.$carousel;
    if (!$activeSlide) throw new Error('[ESL] Carousel: no active slide');

    await promisifyNextRender();
    this.animating = true;
    this.$area.classList.add(direction === ESLCarouselDirection.NEXT ? 'forward' : 'backward');

    await promisifyNextRender();
    await this.transitionDuration$$;
  }

  /** Post-processing animation action. */
  public override async onAfterAnimate(index: number, direction: ESLCarouselDirection, params: ESLCarouselActionParams): Promise<void> {
    this.currentIndex = index;
    this.onAfterAnimation();
    return super.onAfterAnimate(index, direction, params);
  }

  public override move(offset: number, from: number, params: ESLCarouselActionParams): void {
    if (this.animating) return;
    const {$activeSlide} = this.$carousel;
    if (!$activeSlide) throw new Error('[ESL] Carousel: no active slide');
    if (Math.abs(offset) > $activeSlide.offsetWidth) return;

    const direction = sign(-offset);
    const nextIndex = this.normalizeIndex(this.currentIndex + direction);
    const $nextSlide = this.$carousel.$slides[nextIndex];
    if (!$nextSlide || $nextSlide === $activeSlide) return;

    this.offset = offset;
    this.$carousel.$$attr('shifted', !!offset);
    this.setPreActive(nextIndex, {...params, direction});
  }

  public async commit(offset: number, from: number, params: ESLCarouselActionParams): Promise<void> {
    const $activeSlide = this.$carousel.$activeSlide;
    if (!$activeSlide) throw new Error('[ESL] Carousel: no active slide');

    const dir = sign(-offset);
    const nextIndex = this.currentIndex + sign(-offset);
    const slideWidth = this.$carousel.clientWidth;

    const isBorderSlide = !this.loop && (nextIndex < 0 || nextIndex + this.count > this.size);
    const shouldChangeSlide = Math.abs(offset) >= slideWidth * ESLCSSCarouselRenderer.NEXT_SLIDE_TOLERANCE;

    this.animating = true;
    let direction: ESLCarouselDirection = dir;
    if (!isBorderSlide && shouldChangeSlide) {
      this.offset = -1 * dir * slideWidth;
      this.currentIndex = this.normalizeIndex(nextIndex);
    } else {
      this.offset = 0;
      direction = -direction;
    }

    await this.transitionDuration$$;
    this.setActive(this.currentIndex, {...params, direction});
    this.$carousel.$$attr('shifted', false);
    this.onAfterAnimation();
  }

  protected onAfterAnimation(): void {
    CSSClassUtils.remove(this.$area, 'forward backward');
    this.animating = false;
    this.offset = 0;
  }
}

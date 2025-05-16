import {promisifyNextRender} from '../../esl-utils/async/promise';
import {ESLCarouselRenderer} from '../core/esl-carousel.renderer';
import {CSSClassUtils} from '../../esl-utils/dom/class';
import {ESLCarouselDirection} from '../core/esl-carousel.types';

import type {ESLCarouselActionParams} from '../core/esl-carousel.types';

@ESLCarouselRenderer.register
export class ESLCSSCarouselRenderer extends ESLCarouselRenderer {
  public static override is = 'css';
  public static override classes: string[] = ['esl-carousel-css-renderer'];

  public static readonly NEXT_SLIDE_TOLERANCE = 0.25;

  public static readonly OFFSET_PROP = '--esl-carousel-move-offset';
  public static readonly OFFSET_ABS_PROP = '--esl-carousel-move-abs';

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
      this.$area.style.setProperty(ESLCSSCarouselRenderer.OFFSET_PROP, `${offset}px`);
      this.$area.style.setProperty(ESLCSSCarouselRenderer.OFFSET_ABS_PROP, String(abs));
    } else {
      this.$area.style.removeProperty(ESLCSSCarouselRenderer.OFFSET_PROP);
      this.$area.style.removeProperty(ESLCSSCarouselRenderer.OFFSET_ABS_PROP);
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

  /** Pre-processing animation action. */
  public override async onBeforeAnimate(index: number, direction: ESLCarouselDirection, params: ESLCarouselActionParams): Promise<void> {
    if (this.animating) throw new Error('[ESL] Carousel: already animating');

    const $nextSlide = this.$slides[index];
    const dir = direction === ESLCarouselDirection.NEXT ? 'right' : 'left';
    $nextSlide.classList.add(dir);

    return promisifyNextRender();
  }

  /** Processes animation. */
  public override async onAnimate(index: number, direction: ESLCarouselDirection): Promise<void> {
    this.animating = true;
    const {$activeSlide} = this.$carousel;
    if (!$activeSlide) throw new Error('[ESL] Carousel: no active slide');

    const $nextSlide = this.$carousel.$slides[index];

    const to = direction === ESLCarouselDirection.NEXT ? 'forward' : 'backward';
    const dir = direction === ESLCarouselDirection.NEXT ? 'right' : 'left';

    $activeSlide.classList.add(to);
    $nextSlide.classList.add(to, dir);
    await promisifyNextRender();
    await this.transitionDuration$$;
  }

  /** Post-processing animation action. */
  public override async onAfterAnimate(index: number): Promise<void> {
    this.currentIndex = index;
    this.onAfterAnimation();
  }

  public override move(offset: number): void {
    if (this.animating) return;
    const {$activeSlide} = this.$carousel;
    if (!$activeSlide) throw new Error('[ESL] Carousel: no active slide');
    if (Math.abs(offset) > $activeSlide.offsetWidth) return;

    const nextIndex = this.normalizeIndex(this.currentIndex - Math.sign(offset));
    const $nextSlide = this.$carousel.$slides[nextIndex];
    if (!$nextSlide || $nextSlide === $activeSlide) return;

    this.offset = offset;
    this.$carousel.$$attr('shifted', !!offset);
    this.setPreActive(nextIndex);
    $nextSlide.classList.add(offset < 0 ? 'right' : 'left');
  }

  public async commit(offset: number): Promise<void> {
    const $activeSlide = this.$carousel.$activeSlide;
    if (!$activeSlide) throw new Error('[ESL] Carousel: no active slide');

    const direction = -Math.sign(offset);
    const nextIndex = this.currentIndex + direction;
    const slideWidth = this.$carousel.clientWidth;

    const isBorderSlide = !this.loop && (nextIndex < 0 || nextIndex + this.count > this.size);
    const shouldChangeSlide = Math.abs(offset) >= slideWidth * ESLCSSCarouselRenderer.NEXT_SLIDE_TOLERANCE;

    this.animating = true;
    if (!isBorderSlide && shouldChangeSlide) {
      this.offset = -direction * slideWidth;
      this.currentIndex = this.normalizeIndex(nextIndex);
    } else {
      this.offset = 0;
    }
    await this.transitionDuration$$;
    this.setActive(this.currentIndex, {direction});
    this.$carousel.$$attr('shifted', false);
    this.onAfterAnimation();
  }

  protected onAfterAnimation(): void {
    CSSClassUtils.remove(this.$slides, 'left right forward backward');
    this.transitionDuration = null;
    this.animating = false;
    this.offset = 0;
  }
}

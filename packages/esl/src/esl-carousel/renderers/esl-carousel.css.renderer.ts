import {parseTime} from '../../esl-utils/misc/format';
import {promisifyNextRender, promisifyTimeout} from '../../esl-utils/async/promise';
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
  public static readonly TRANSITION_DURATION_PROP = '--esl-carousel-transition-duration';

  /** Active index */
  protected currentIndex: number = 0;

  protected get offset(): number {
    const offset = this.$area.style.getPropertyValue(ESLCSSCarouselRenderer.OFFSET_PROP);
    return parseFloat(offset) || 0;
  }
  protected set offset(offset: number) {
    if (offset) {
      this.$area.style.setProperty(ESLCSSCarouselRenderer.OFFSET_PROP, `${offset}px`);
    } else {
      this.$area.style.removeProperty(ESLCSSCarouselRenderer.OFFSET_PROP);
    }
  }

  protected get transitionDuration(): number {
    const name = ESLCSSCarouselRenderer.TRANSITION_DURATION_PROP;
    const duration = getComputedStyle(this.$area).getPropertyValue(name);
    return parseTime(duration);
  }
  protected set transitionDuration(value: number | null) {
    if (typeof value === 'number') {
      this.$carousel.style.setProperty(ESLCSSCarouselRenderer.TRANSITION_DURATION_PROP, `${value}ms`);
    } else {
      this.$carousel.style.removeProperty(ESLCSSCarouselRenderer.TRANSITION_DURATION_PROP);
    }
  }

  protected get transitionDuration$$(): Promise<void> {
    return promisifyTimeout(this.transitionDuration);
  }

  /**
   * Processes binding of defined renderer to the carousel {@link ESLCarousel}.
   * Prepare to renderer animation.
   */
  public override onBind(): void {
    this.currentIndex = this.$carousel.activeIndex;
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
    $nextSlide.classList.add('next');

    const dir = direction === ESLCarouselDirection.NEXT ? 'right' : 'left';
    $nextSlide.classList.add(dir);

    // TODO: discuss
    // this.transitionDuration = params.stepDuration;
    return promisifyNextRender();
  }

  /** Processes animation. */
  public override async onAnimate(nextIndex: number, direction: ESLCarouselDirection): Promise<void> {
    this.animating = true;
    const {$activeSlide} = this.$carousel;
    if (!$activeSlide) throw new Error('[ESL] Carousel: no active slide');

    const $nextSlide = this.$carousel.$slides[nextIndex];

    const to = direction === ESLCarouselDirection.NEXT ? 'forward' : 'backward';
    const dir = direction === ESLCarouselDirection.NEXT ? 'right' : 'left';

    $activeSlide.classList.add(to);
    $nextSlide.classList.add('next', to, dir);
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

    const $nextSlide = this.$carousel.$slides[this.normalizeIndex(this.currentIndex - Math.sign(offset))];
    if (!$nextSlide || $nextSlide === $activeSlide) return;

    this.offset = offset;
    $nextSlide.classList.add('next', offset < 0 ? 'right' : 'left');
  }

  public async commit(offset: number): Promise<void> {
    const $activeSlide = this.$carousel.$activeSlide;
    if (!$activeSlide) throw new Error('[ESL] Carousel: no active slide');
    if (!this.loop && this.offset === 0) return;

    const direction = -Math.sign(offset);
    const nextIndex = this.currentIndex + direction;
    const slideWidth = $activeSlide.offsetWidth;

    const isBorderSlide = !this.loop && (nextIndex < 0 || nextIndex + this.count > this.size);
    const shouldChangeSlide = Math.abs(offset) / ESLCSSCarouselRenderer.NEXT_SLIDE_TOLERANCE >= slideWidth;

    if (!isBorderSlide && shouldChangeSlide) {
      this.offset = -direction * slideWidth;
      this.currentIndex = this.normalizeIndex(nextIndex);
    } else {
      this.offset = 0;
    }

    this.animating = true;
    await this.transitionDuration$$;
    this.setActive(this.currentIndex, {direction});
    this.onAfterAnimation();
  }

  protected onAfterAnimation(): void {
    CSSClassUtils.remove(this.$slides, 'next left right forward backward');
    this.transitionDuration = null;
    this.animating = false;
    this.offset = 0;
  }
}

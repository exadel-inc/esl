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

  /** Active index */
  protected currentIndex: number = 0;

  private _areaOffset: number = 0;

  protected set areaOffset(offset: number) {
    this._areaOffset = offset;
    this.$area.style.setProperty('--offsetArea', `${offset}px`);
  }

  protected get areaOffset(): number {
    return this._areaOffset;
  }

  /**
   * Processes binding of defined renderer to the carousel {@link ESLCarousel}.
   * Prepare to renderer animation.
   */
  public override onBind(): void {
    this.currentIndex = this.$carousel.activeIndex;
  }

  /**
   * Processes unbinding of defined view from the carousel {@link ESLCarousel}.
   * Clear animation.
   */
  public override onUnbind(): void {
    this.$carousel.toggleAttribute('animating', false);
  }

  /** Pre-processing animation action. */
  public override async onBeforeAnimate(index: number, direction: ESLCarouselDirection): Promise<void> {
    if (this.$carousel.hasAttribute('animating')) throw new Error('[ESL] Carousel: already animating');

    const $nextSlide = this.$slides[index];
    $nextSlide.classList.add('next');

    const dir = direction === ESLCarouselDirection.NEXT ? 'right' : 'left';
    $nextSlide.classList.add(dir);

    return promisifyNextRender();
  }

  /** Processes animation. */
  public override async onAnimate(nextIndex: number, direction: ESLCarouselDirection, params: ESLCarouselActionParams): Promise<void> {
    this.$carousel.toggleAttribute('animating', true);
    const {$activeSlide} = this.$carousel;
    if (!$activeSlide) throw new Error('[ESL] Carousel: no active slide');

    const $nextSlide = this.$carousel.$slides[nextIndex];

    const to = direction === ESLCarouselDirection.NEXT ? 'forward' : 'backward';
    const dir = direction === ESLCarouselDirection.NEXT ? 'right' : 'left';

    $activeSlide.classList.add(to);
    $nextSlide.classList.add('next', to, dir);

    this.$carousel.style.setProperty('--transition-duration', `${params.stepDuration}ms`);
    return this.promisifyTransition($activeSlide, 'transform', params.stepDuration);
  }

  /** Post-processing animation action. */
  public override async onAfterAnimate(index: number): Promise<void> {
    this.currentIndex = index;
    this.onAfterAnimation();
    return Promise.resolve();
  }

  public override move(offset: number): void {
    if (this.$carousel.hasAttribute('animating')) return;
    const {$activeSlide} = this.$carousel;
    if (!$activeSlide) throw new Error('[ESL] Carousel: no active slide');
    if (Math.abs(offset) > $activeSlide.offsetWidth) return;

    const $nextSlide = this.$carousel.$slides[this.normalizeIndex(this.currentIndex - Math.sign(offset))];
    if (!$nextSlide || $nextSlide === $activeSlide) return;

    this.areaOffset = offset;
    $nextSlide.classList.add('next',  offset < 0 ? 'right' : 'left');
  }


  public async commit(offset: number): Promise<void> {
    const $activeSlide = this.$carousel.$activeSlide;
    if (!$activeSlide) throw new Error('[ESL] Carousel: no active slide');
    if (!this.loop && this.areaOffset === 0) return;

    const direction = -Math.sign(offset);
    const nextIndex = this.currentIndex + direction;
    const slideWidth = $activeSlide.offsetWidth;

    const isBorderSlide = !this.loop && (nextIndex < 0 || nextIndex + this.count > this.size);
    const shouldChangeSlide = Math.abs(offset) / ESLCSSCarouselRenderer.NEXT_SLIDE_TOLERANCE >= slideWidth;

    if (!isBorderSlide && shouldChangeSlide) {
      this.areaOffset = -direction * slideWidth;
      this.currentIndex = this.normalizeIndex(nextIndex);
    } else {
      this.areaOffset = 0;
    }

    CSSClassUtils.add(this.$area, 'moving');
    this.$carousel.toggleAttribute('animating', true);
    this.$carousel.style.setProperty('--transition-duration', '250ms');
    await this.promisifyTransition(this.$area, 'transform');
    this.onAfterCommit(direction);
  }

  protected onAfterCommit(direction: number): void {
    this.setActive(this.currentIndex, {direction});
    this.onAfterAnimation();
    this.areaOffset = 0;
  }

  protected onAfterAnimation(): void {
    this.$carousel.toggleAttribute('animating', false);
    CSSClassUtils.remove(this.$slides, 'next left right forward backward');
    CSSClassUtils.remove(this.$area, 'moving');
  }

  public promisifyTransition($el: Element, property: string, timeout = 250): Promise<void> {
    return new Promise((resolve) => {
      const done = (): void => {
        $el.removeEventListener('transitionend', onTransitionEnd);
        $el.removeEventListener('transitioncancel', onTransitionEnd);
        clearTimeout(fallbackTimeout);
        resolve();
      };

      const onTransitionEnd = (e: TransitionEvent): void => {
        if (e.propertyName === property) done();
      };

      const fallbackTimeout = setTimeout(done, timeout);

      $el.addEventListener('transitionend', onTransitionEnd);
      $el.addEventListener('transitioncancel', onTransitionEnd);
    });
  }
}

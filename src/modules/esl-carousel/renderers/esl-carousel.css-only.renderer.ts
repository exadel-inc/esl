import {promisifyEvent, promisifyNextRender, resolvePromise} from '../../esl-utils/async/promise';
import {ESLCarouselRenderer} from '../core/esl-carousel.renderer';
import type {ESLCarouselDirection} from '../core/nav/esl-carousel.nav.types';

/** @deprecated mode is under development at that moment */
@ESLCarouselRenderer.register
export class ESLSlideCarouselRenderer extends ESLCarouselRenderer {
  public static override is = 'css-only';
  public static override classes: string[] = ['esl-carousel-css-renderer'];

  /** Active index */
  protected currentIndex: number = 0;

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
    // TODO: check transformation
    this.$carousel.toggleAttribute('animate', false);
    this.$carousel.toggleAttribute('direction', false);
    this.$carousel.$slides.forEach((slide) => {
      slide.classList.remove('next');
      slide.classList.remove('prev');
    });
  }

  /** Pre-processing animation action. */
  public async onBeforeAnimate(index: number, direction: ESLCarouselDirection): Promise<void> {
    if (this.$carousel.hasAttribute('animate')) return Promise.reject();

    const {$activeSlide} = this.$carousel;
    if (!$activeSlide) return; // TODO: error

    let $nextSlide = $activeSlide.$nextCyclic;
    let $prevSlide = $activeSlide.$prevCyclic;

    if (direction === 'prev') $prevSlide = this.$carousel.$slides[index];
    if (direction === 'next') $nextSlide = this.$carousel.$slides[index];

    $prevSlide.classList.add('prev');
    $nextSlide.classList.add('next');

    this.$carousel.setAttribute('direction', direction);
    return promisifyNextRender();
  }

  /** Processes animation. */
  public async onAnimate(nextIndex: number, direction: ESLCarouselDirection): Promise<void> {
    this.$carousel.toggleAttribute('animate', true);

    // TODO: !
    return promisifyEvent(this.$carousel.$slidesArea, 'transitionend').catch(resolvePromise);
  }

  /** Post-processing animation action. */
  public async onAfterAnimate(): Promise<void> {
    this.$carousel.toggleAttribute('animate', false);
    this.$carousel.toggleAttribute('direction', false);
    this.$carousel.$slides.forEach((slide) => {
      slide.classList.remove('next');
      slide.classList.remove('prev');
    });

    return Promise.resolve();
  }

  /** Handles the slides transition. */
  public onMove(offset: number): void {
    if (!this.isNonLoopBorders(offset)) return;

    const width = parseFloat(getComputedStyle(this.$carousel.$activeSlide as Element).width);

    if (Math.abs(offset) > width) return;

    const {$activeSlide} = this.$carousel;
    if (!$activeSlide) return; // TODO: error
    const $nextSlide = $activeSlide.$nextCyclic;
    const $prevSlide = $activeSlide.$prevCyclic;

    $prevSlide.classList.add('prev');
    $nextSlide.classList.add('next');

    this.$area.style.transform = `translateX(${-($activeSlide?.offsetLeft || 0) + offset}px)`;
  }

  /** Ends current transition and make permanent all changes performed in the transition. */
  public async commit(offset: number): Promise<void> {
    if (!this.isNonLoopBorders(offset)) return;

    const {$activeSlide} = this.$carousel;
    if (!$activeSlide) return; // TODO: error

    const width = parseFloat(getComputedStyle($activeSlide as Element).width);
    const $nextSlide = $activeSlide.$nextCyclic;
    const $prevSlide = $activeSlide.$prevCyclic;

    this.$carousel.toggleAttribute('animate', true);

    const sign = offset > 0 ? 1 : -1;
    const pos = $activeSlide.offsetLeft + sign * width;
    this.$area.style.transform = `translateX(${-pos}px)`;

    await promisifyEvent(this.$area, 'transitionend').catch(resolvePromise);

    // TODO: fix direction
    const $nextActiveSlide = sign === -1 ? $nextSlide : $prevSlide;
    $activeSlide.active = false;
    $nextActiveSlide.active = true;

    this.$area.style.transform = 'translateX(0px)';
    this.$carousel.toggleAttribute('animate', false);
    $prevSlide.classList.remove('prev');
    $nextSlide.classList.remove('next');

    // TODO: change info
    const direction = offset > 0 ? 'prev' : 'next';
    this.$carousel.$$fire('slide:changed', {
      detail: {direction},
      bubbles: false
    });
  }

  /** @returns marker if the carousel offset matches the loop borders */
  protected isNonLoopBorders(offset: number): boolean {
    if (this.loop) return true;
    const shiftCount = Math.ceil(Math.abs(offset) / this.$area.clientWidth);
    const {activeIndex} = this.$carousel;
    const nextIndex = offset > 0 ?
      activeIndex - shiftCount :
      activeIndex + this.count + shiftCount - 1;
    return !(nextIndex < 0 || nextIndex >= this.size);
  }
}

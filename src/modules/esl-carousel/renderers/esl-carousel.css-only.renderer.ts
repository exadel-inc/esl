import {promisifyEvent, promisifyNextRender, resolvePromise} from '../../esl-utils/async/promise';
import {ESLCarouselRenderer} from '../core/esl-carousel.renderer';
import {ESLCarouselSlideEvent} from '../core/esl-carousel.events';
import {CSSClassUtils} from '../../esl-utils/dom/class';
import type {ESLCarouselDirection} from '../core/nav/esl-carousel.nav.types';

/** @deprecated mode is under development at that moment */
@ESLCarouselRenderer.register
export class ESLCSSCarouselRenderer extends ESLCarouselRenderer {
  public static override is = 'css';
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
    this.$carousel.toggleAttribute('animating', false);
  }

  /** Pre-processing animation action. */
  public override async onBeforeAnimate(index: number, direction: ESLCarouselDirection): Promise<void> {
    if (this.$carousel.hasAttribute('animating')) throw new Error('[ESL] Carousel: already animating');

    const $nextSlide = this.$carousel.$slides[index];
    $nextSlide.classList.add('next');

    const dir = direction === 'next' ? 'right' : 'left';
    $nextSlide.classList.add(dir);

    return promisifyNextRender();
  }

  /** Processes animation. */
  public async onAnimate(index: number, direction: ESLCarouselDirection): Promise<void> {
    this.$carousel.toggleAttribute('animating', true);

    const {$activeSlide} = this.$carousel;
    if (!$activeSlide) throw new Error('[ESL] Carousel: not have active slide');

    const to = direction === 'next' ? 'forward' : 'backward';

    const $nextSlide = this.$carousel.$slides[index];
    $nextSlide.classList.add('next');

    const dir = direction === 'next' ? 'right' : 'left';
    $nextSlide.classList.add(dir);

    $activeSlide.classList.add(to);
    $nextSlide.classList.add(to);

    // TODO: we need to leave some more options to catch this animation. E.g. make user able to use animation instead of transition.
    // It looks like it works (or may works incorrectly) from targeting perspective. We need to observe for transition of specific properties and for slide itself
    // We need to create good promisifyTransition/promisifyAnimation option + Note we have a global bug with non considering transitioncancel and the same problem in default renderer
    return promisifyEvent(this.$carousel.$slidesArea, 'transitionend').catch(resolvePromise);
  }

  /** Post-processing animation action. */
  public override async onAfterAnimate(): Promise<void> {
    this.$carousel.toggleAttribute('animating', false);
    CSSClassUtils.remove(this.$carousel.$slides, 'next left right forward backward');

    return Promise.resolve();
  }

  /** Handles the slides transition. */
  public onMove(offset: number): void {
    const width = parseFloat(getComputedStyle(this.$carousel.$activeSlide as Element).width);

    if (Math.abs(offset) > width) return;

    const {$activeSlide} = this.$carousel;
    if (!$activeSlide) throw new Error('[ESL] Carousel: not have active slide');

    const $nextSlide = offset > 0 ? $activeSlide.$prevCyclic : $activeSlide.$nextCyclic;
    $nextSlide.classList.add('next');

    const dir = offset < 0 ? 'right' : 'left';
    $nextSlide.classList.add(dir);

    this.$area.style.setProperty('--offsetArea', `${offset}px`);
  }

  /** Ends current transition and make permanent all changes performed in the transition. */
  public async commit(offset: number): Promise<void> {
    const {$activeSlide} = this.$carousel;
    if (!$activeSlide) throw new Error('[ESL] Carousel: not have active slide');

    this.$carousel.toggleAttribute('touch-animating', true);

    const width = parseFloat(getComputedStyle($activeSlide as Element).width);
    const isOldSlide = width / 2 > Math.abs(offset);
    const offsetArea = isOldSlide ? 0 : (offset > 0 ? width : -width);
    this.$area.style.setProperty('--offsetArea',  `${offsetArea}px`);

    await promisifyEvent(this.$area, 'transitionend').catch(resolvePromise);

    const $nextSlide = offset > 0 ? $activeSlide.$prevCyclic : $activeSlide.$nextCyclic;
    const $nextActiveSlide = isOldSlide ? $activeSlide : $nextSlide;

    $activeSlide.active = false;
    $nextActiveSlide.active = true;

    CSSClassUtils.remove($nextActiveSlide, 'next left right');

    this.$carousel.toggleAttribute('touch-animating', false);
    this.$area.style.setProperty('--offsetArea',  '0px');

    const activeIndex = $nextActiveSlide.index;
    if (activeIndex !== this.currentIndex) {
      const direction = offset > 0 ? 'prev' : 'next';
      this.$carousel.dispatchEvent(ESLCarouselSlideEvent.create('AFTER', {
        direction,
        current: this.currentIndex,
        related: activeIndex
      }));
    }
  }
}

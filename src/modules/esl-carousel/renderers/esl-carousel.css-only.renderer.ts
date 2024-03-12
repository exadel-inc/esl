import {promisifyEvent, promisifyNextRender, resolvePromise} from '../../esl-utils/async/promise';
import {ESLCarouselRenderer} from '../core/esl-carousel.renderer';
import {ESLCarouselSlideEvent} from '../core/esl-carousel.events';
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
  public async onBeforeAnimate(index: number, direction: ESLCarouselDirection): Promise<void> {
    if (this.$carousel.hasAttribute('animating')) throw new Error('[ESL] Carousel: already animating');

    const {$activeSlide} = this.$carousel;
    if (!$activeSlide) throw new Error('[ESL] Carousel: not have active slide');

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
    return promisifyEvent(this.$carousel.$slidesArea, 'transitionend').catch(resolvePromise);
  }

  /** Post-processing animation action. */
  public async onAfterAnimate(): Promise<void> {
    this.$carousel.toggleAttribute('animating', false);
    this.$carousel.$slides.forEach((slide) => {
      slide.classList.remove('next');
      slide.classList.remove('left');
      slide.classList.remove('right');
      slide.classList.remove('forward');
      slide.classList.remove('backward');
    });

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

    const width = parseFloat(getComputedStyle($activeSlide as Element).width);

    this.$carousel.toggleAttribute('animating', true);

    const offsetArea = offset < 0 ? -width : width;
    this.$area.style.setProperty('--offsetArea',  width / 2 > Math.abs(offset)  ? '0px' : `${offsetArea}px`);

    await promisifyEvent(this.$area, 'transitionend').catch(resolvePromise);

    const $nextSlide = offset > 0 ? $activeSlide.$prevCyclic : $activeSlide.$nextCyclic;
    const $nextActiveSlide = width / 2 > Math.abs(offset) ? $activeSlide : $nextSlide;

    $activeSlide.active = false;
    $nextActiveSlide.active = true;

    $nextActiveSlide.classList.remove('next');
    $nextActiveSlide.classList.remove('left');
    $nextActiveSlide.classList.remove('right');

    this.$carousel.toggleAttribute('animating', false);
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

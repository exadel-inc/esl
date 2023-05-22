import {promisifyEvent, resolvePromise} from '../../../esl-utils/async/promise';
import {promisifyNextRender} from '../../../esl-utils/async/raf';
import {ESLCarouselRenderer} from '../../core/esl-carousel.renderer';

import type {ESLCarouselDirection} from '../../core/nav/esl-carousel.nav.types';

@ESLCarouselRenderer.register
export class ESLSlideCarouselRenderer extends ESLCarouselRenderer {
  public static override is = 'slide';

  /**
   * Processes binding of defined renderer to the carousel {@link ESLCarousel}.
   * Prepare to renderer animation.
   */
  // TODO: check
  public override onBind(): void {
    this.redraw();
  }

  public override redraw(): void {
    const {$slides, $slidesArea} = this.carousel;
    if (!$slidesArea || !$slides.length) return;

    const slideStyles = getComputedStyle($slides[this.carousel.firstIndex]);
    this.slideWidth =  $slidesArea.offsetWidth - parseFloat(slideStyles.marginLeft) - parseFloat(slideStyles.marginRight);
    $slides.forEach((slide) => slide.style.minWidth = this.slideWidth + 'px');
  }

  /**
   * Processes unbinding of defined renderer from the carousel {@link ESLCarousel}.
   * Clear animation.
   */
  public override onUnbind(): void {
    this.clearAnimation();
  }

  public clearAnimation(): void {
    this.carousel.toggleAttribute('animating', false);
    this.carousel.toggleAttribute('direction', false);
    this.carousel.$slides.forEach((slide) => {
      slide.classList.remove('next');
      slide.classList.remove('prev');
    });
  }

  /** Pre-processing animation action. */
  public async onBeforeAnimate(index: number, direction: ESLCarouselDirection): Promise<void> {
    if (this.carousel.hasAttribute('animating')) return Promise.reject();

    const $activeSlide = this.carousel.$activeSlide;
    const $nextSlide = $activeSlide?.$nextCyclic;
    const $prevSlide = $activeSlide?.$prevCyclic;

    $prevSlide?.classList.add('prev');
    $nextSlide?.classList.add('next');

    this.carousel.setAttribute('direction', direction);
    return promisifyNextRender();
  }

  /** Processes animation. */
  public async onAnimate(nextIndex: number, direction: ESLCarouselDirection): Promise<void> {
    this.carousel.toggleAttribute('animating', true);

    // TODO: !
    return promisifyEvent(this.carousel.$slidesArea!, 'transitionend')
      .catch(resolvePromise);
  }

  /** Post-processing animation action. */
  public async onAfterAnimate(): Promise<void> {
    this.carousel.toggleAttribute('animating', false);
    this.carousel.toggleAttribute('direction', false);
    this.carousel.$slides.forEach((slide) => {
      slide.classList.remove('next');
      slide.classList.remove('prev');
    });

    return Promise.resolve();
  }

  /** Handles the slides transition. */
  public onMove(offset: number): void {
    if (!this.isNonLoopBorders(offset)) return;

    const width = parseFloat(getComputedStyle(this.carousel.$activeSlide as Element).width);

    if (Math.abs(offset) > width) return;

    const $activeSlide = this.carousel.$activeSlide;
    const $nextSlide = $activeSlide.$nextCyclic;
    const $prevSlide = $activeSlide.$prevCyclic;

    $prevSlide?.classList.add('prev');
    $nextSlide?.classList.add('next');

    this.carousel.$slidesArea!.style.transform = `translateX(${-($activeSlide?.offsetLeft || 0) + offset}px)`;
  }

  /** Ends current transition and make permanent all changes performed in the transition. */
  public async commit(offset: number): Promise<void> {
    if (!this.isNonLoopBorders(offset)) return;

    const width = parseFloat(getComputedStyle(this.carousel.$activeSlide as Element).width);
    const $activeSlide = this.carousel.$activeSlide;
    const $nextSlide = $activeSlide.$nextCyclic;
    const $prevSlide = $activeSlide.$prevCyclic;

    this.carousel.toggleAttribute('animating', true);

    const sign = offset > 0 ? 1 : -1;
    this.carousel.$slidesArea!.style.transform = `translateX(${-$activeSlide.offsetLeft + sign * width}px)`;

    await promisifyEvent(this.carousel.$slidesArea!, 'transitionend').catch(resolvePromise);

    // TODO: fix direction
    const $nextActiveSlide = sign === -1 ? $nextSlide : $prevSlide;
    $activeSlide.active = false;
    $nextActiveSlide.active = true;

    this.carousel.$slidesArea!.style.transform = 'translateX(0px)';
    this.carousel.toggleAttribute('animating', false);
    $prevSlide?.classList.remove('prev');
    $nextSlide?.classList.remove('next');

    // TODO: change info
    const direction = offset > 0 ? 'prev' : 'next';
    this.carousel.$$fire('slide:changed', {
      detail: {direction},
      bubbles: false
    });
  }

  /** @returns marker if the carousel offset matches the loop borders */
  protected isNonLoopBorders(offset: number): boolean {
    if (this.carousel.loop) return true;
    const shiftCount = Math.ceil(Math.abs(offset) / this.slideWidth);
    const nextIndex = offset > 0 ?
      this.carousel.firstIndex - shiftCount :
      this.carousel.firstIndex + this.carousel.count + shiftCount - 1;
    return !(nextIndex < 0 || nextIndex >= this.carousel.size);
  }
}

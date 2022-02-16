import {promisifyEvent, resolvePromise} from '../../../esl-utils/async/promise';
import {promisifyNextRender} from '../../../esl-utils/async/raf';
import {ESLCarouselView} from './esl-carousel-view';
import type {CarouselDirection} from '../esl-carousel-utils';

export class ESLSlideCarouselView extends ESLCarouselView {
  public static is = 'slide';

  // TODO: check
  public onBind(): void {
    const {$slides, $slidesArea} = this.carousel;
    if (!$slidesArea || !$slides.length) return;

    const slideStyles = getComputedStyle($slides[this.carousel.firstIndex]);
    const slidesAreaStyles = getComputedStyle($slidesArea);

    this.slideWidth = parseFloat(slidesAreaStyles.width) - parseFloat(slideStyles.marginLeft) - parseFloat(slideStyles.marginRight);
    $slides.forEach((slide) => slide.style.minWidth = this.slideWidth + 'px');
  }

  public async onBeforeAnimate(index: number, direction: CarouselDirection): Promise<void> {
    if (this.carousel.hasAttribute('animate')) return Promise.reject();

    const $activeSlide = this.carousel.$activeSlide;
    const $nextSlide = $activeSlide?.$nextCyclic;
    const $prevSlide = $activeSlide?.$prevCyclic;

    $prevSlide?.classList.add('prev');
    $nextSlide?.classList.add('next');

    this.carousel.setAttribute('direction', direction);
    return promisifyNextRender();
  }

  public async onAnimate(nextIndex: number, direction: CarouselDirection): Promise<void> {
    this.carousel.toggleAttribute('animate', true);

    // TODO: !
    return promisifyEvent(this.carousel.$slidesArea!, 'transitionend')
      .catch(resolvePromise);
  }

  public async onAfterAnimate(): Promise<void> {
    this.carousel.toggleAttribute('animate', false);
    this.carousel.toggleAttribute('direction', false);
    this.carousel.$slides.forEach((slide) => {
      slide.classList.remove('next');
      slide.classList.remove('prev');
    });

    return Promise.resolve();
  }

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

  public async commit(offset: number): Promise<void> {
    // TODO: connect with onMove check
    if (!this.isNonLoopBorders(offset)) return;

    const width = parseFloat(getComputedStyle(this.carousel.$activeSlide as Element).width);
    const $activeSlide = this.carousel.$activeSlide;
    const $nextSlide = $activeSlide.$nextCyclic;
    const $prevSlide = $activeSlide.$prevCyclic;

    this.carousel.toggleAttribute('animate', true);

    const sign = offset > 0 ? 1 : -1;
    this.carousel.$slidesArea!.style.transform = `translateX(${-$activeSlide.offsetLeft + sign * width}px)`;

    await promisifyEvent(this.carousel.$slidesArea!, 'transitionend').catch(resolvePromise);

    // TODO: fix direction
    const $nextActiveSlide = sign === -1 ? $nextSlide : $prevSlide;
    $activeSlide.active = false;
    $nextActiveSlide.active = true;

    this.carousel.$slidesArea!.style.transform = 'translateX(0px)';
    this.carousel.toggleAttribute('animate', false);
    $prevSlide?.classList.remove('prev');
    $nextSlide?.classList.remove('next');

    // TODO: change info
    const direction = offset > 0 ? 'next' : 'prev';
    this.carousel.$$fire('slide:changed', {
      detail: {direction}
    });
  }

  protected isNonLoopBorders(offset: number): boolean {
    if (this.carousel.loop) return true;
    const shiftCount = Math.ceil(Math.abs(offset) / this.slideWidth);
    const nextIndex = offset > 0 ?
      this.carousel.firstIndex - shiftCount :
      this.carousel.firstIndex + this.carousel.activeCount + shiftCount - 1;
    return !(nextIndex < 0 || nextIndex >= this.carousel.count);
  }
}

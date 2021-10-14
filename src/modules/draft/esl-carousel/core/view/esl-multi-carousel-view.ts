import {bind} from '../../../../esl-utils/decorators/bind';
import {promisifyEvent, resolvePromise} from '../../../../esl-utils/async/promise';
import {ESLCarouselView, ESLCarouselViewRegistry} from './esl-carousel-view';

import type {ESLCarousel, CarouselDirection} from '../esl-carousel';
import type {ESLCarouselSlide} from '../esl-carousel-slide';


export function repetitiveSequence<T>(callback: () => Promise<T>, count = 1): Promise<T> {
  if (count < 1) return Promise.reject();
  if (count === 1) return callback();
  return repetitiveSequence(callback, count - 1).then(callback);
}

class ESLMultiCarouselView extends ESLCarouselView {

  public constructor(carousel: ESLCarousel) {
    super(carousel);
    this.carousel.$slides.forEach((el, index) => this.computedOrder.set(el, index));
  }

  public bind() {
    this.draw();
  }

  // tslint:disable-next-line:no-empty
  public onMove(offset: number) {
  }

  // tslint:disable-next-line:no-empty
  public commit() {
  }

  public draw() {
    const {$slides, $slidesArea} = this.carousel;
    if (!$slidesArea || !$slides.length) return;

    const slideStyles = getComputedStyle($slides[this.carousel.firstIndex]);
    const currentTrans = slideStyles.transform !== 'none' ? parseFloat(slideStyles.transform.split(',')[4]) : 0;
    const slidesAreaStyles = getComputedStyle($slidesArea);

    const slideWidth = parseFloat(slidesAreaStyles.width) / this.carousel.activeCount
      - parseFloat(slideStyles.marginLeft) - parseFloat(slideStyles.marginRight);
    const computedLeft = this.carousel.firstIndex === 0 ?
      -currentTrans :
      -(parseFloat(slidesAreaStyles.width) / this.carousel.activeCount * this.carousel.firstIndex) - currentTrans;


    $slides.forEach((slide) => {
      slide.style.minWidth = slideWidth + 'px';
      slide.style.left = computedLeft + 'px';
    });
  }

  protected nextIndex: number;
  protected computedOrder = new Map<ESLCarouselSlide, number>();

  protected shiftX: number = 0;
  protected left: number = 0;
  // TODO
  protected activeIndex: number = 0;


  public onAnimate(nextIndex: number, direction: CarouselDirection) {
    let count = 0;
    if (direction === 'prev') {
      count = (this.carousel.firstIndex - nextIndex + this.carousel.count) % this.carousel.count;
    } else if (direction === 'next') {
      count = (this.carousel.count - this.carousel.firstIndex + nextIndex) % this.carousel.count;
    }
    this.nextIndex = nextIndex;
    const animateSlide = () =>
      this.onBeforeStepAnimate(this.nextIndex, direction)
        .then(() => this.onStepAnimate(this.nextIndex, direction))
        .then(() => this.onAfterStepAnimate());

    return repetitiveSequence(animateSlide, count);
  }

  protected async onStepAnimate(nextIndex: number, direction: CarouselDirection): Promise<void> {
    this.nextIndex = direction === 'next' ?
      (nextIndex + 1 + this.carousel.count) % this.carousel.count :
      (nextIndex - 1 + this.carousel.count) % this.carousel.count;

    // TODO: slidesArea
    this.shiftX = direction === 'next' ? this.shiftX - 260 : this.shiftX + 260;

    this.carousel.$slidesArea!.style.transform = `translateX(${this.shiftX}px)`;

    // TODO: ! and take 1000 from styles
    return promisifyEvent(this.carousel.$slidesArea!, 'transitionend')
      .catch(resolvePromise);
  }

  protected async onBeforeStepAnimate(nextIndex: number, direction: CarouselDirection): Promise<void> {

    this._processNextTransition(nextIndex, direction);

    this._processPrevTransition(nextIndex, direction);

    this.carousel.toggleAttribute('animate', true);
    return Promise.resolve();
  }

  protected async onAfterStepAnimate(): Promise<void> {
    this.carousel.toggleAttribute('animate', false);
    return Promise.resolve();
  }

  protected _processNextTransition(nextIndex: number, direction: CarouselDirection) {
    const nextSlideOrder = this.computedOrder.get(this.carousel.$slides[nextIndex]);
    // slide that should be active has 0 index
    if (direction === 'next' && nextSlideOrder === 0) {

      // for (const slide of this.computedOrder.keys()) {
      //     // TODO !
      //     const nextOrder = (this.computedOrder.get(slide)! - 1 + this.carousel.count) % this.carousel.count;
      //     this.computedOrder.set(slide, nextOrder);
      //     slide.style.order = String(nextOrder);
      //     if (nextOrder === 0) this.activeIndex = this.carousel.$slides.findIndex((el) => el === slide);
      //   }
      //
      //   // TODO: liven transform
      //   // this.shiftX = this.shiftX + 260;
      //   // this.carousel.$slidesArea!.style.transform = `translateX(${this.shiftX}px)`;
      //


      // slide that should be active has 0 index
      let prevSlide = this.carousel.getPrevSlide(this.carousel.firstIndex);
      let prevSlideOrder = this.computedOrder.get(prevSlide);

      const $slides = Array.from(this.carousel.$slides);
      $slides.reverse();
      const slideOrder = this.computedOrder.get($slides[0]);

      $slides.forEach((slide, index) => {
        if (index !== this.carousel.count - 1) {
          prevSlide = this.carousel.getPrevSlide(slide);
          prevSlideOrder = this.computedOrder.get(prevSlide);
          this.computedOrder.set(slide, prevSlideOrder!);
          slide.style.order = String(prevSlideOrder);
        } else {
          this.computedOrder.set(slide, slideOrder!);
          slide.style.order = String(slideOrder);
        }
      });

      // TODO: calculate and check slidesArea
      this.left = this.left + 260;
      this.carousel.$slidesArea!.style.left = this.left + 'px';
    }
  }

  protected _processPrevTransition(nextIndex: number, direction: CarouselDirection) {
    // slide that should be active has 0 index
    const prevSlide = this.carousel.getPrevSlide(this.carousel.firstIndex);
    const prevSlideOrder = this.computedOrder.get(prevSlide);

    if (direction === 'prev' && prevSlideOrder === this.carousel.count - 1) {
      // TODO: calculate and check slidesArea

      let i = prevSlide.index;
      let j = 0;
      let index;
      while (j !== this.carousel.count - 1) {
        index = this.carousel.normalizeIndex(i++);
        const $slide = this.carousel.$slides[index];
        this.computedOrder.set($slide, j);
        $slide.style.order = String(j);
        j++;
      }

      // $slides.forEach((slide, index) => {
      //   if (index !== this.carousel.count - 1) {
      //     prevSlide = this.carousel.getPrevSlide(slide);
      //     prevSlideOrder = this.computedOrder.get(prevSlide);
      //     this.computedOrder.set(slide, prevSlideOrder!);
      //     slide.style.order = String(prevSlideOrder);
      //   } else {
      //     this.computedOrder.set(slide, slideOrder!);
      //     slide.style.order = String(slideOrder);
      //   }
      // });

      this.left = this.left - 260;
      this.carousel.$slidesArea!.style.left = this.left + 'px';
    }
  }


  public unbind() {
    this.carousel.$slides.forEach((el) => {
      el.style.transform = 'none';
      el.style.left = 'none';
    });
  }

  // TODO: remove after animation is ready
  // eslint-disable-next-line sonarjs/cognitive-complexity
  public moveTo(nextIndex: number, direction: string) {
    const slideIndex = direction === 'right' ? this.carousel.activeIndexes[0] : this.carousel.firstIndex;
    const slideStyles = getComputedStyle(this.carousel.$slides[slideIndex]);
    const slideWidth = parseFloat(slideStyles.width) +
      parseFloat(slideStyles.marginLeft) +
      parseFloat(slideStyles.marginRight);
    const areaWidth = slideWidth * this.carousel.$slides.length;

    const transitionDuration = parseFloat(slideStyles.transitionDuration) * 1000; // ms
    const currentLeft = parseFloat(slideStyles.left);
    const currentTrans = parseFloat(slideStyles.transform.split(',')[4]) || 0;

    if (this.carousel.firstIndex === nextIndex) {
      return 0;
    }

    let shiftCount = 0;
    if (direction === 'left') {
      shiftCount = (this.carousel.firstIndex - nextIndex + this.carousel.count) % this.carousel.count;
    } else if (direction === 'right') {
      shiftCount = (this.carousel.count - this.carousel.firstIndex + nextIndex) % this.carousel.count;
    }
    const direct = direction === 'left' ? -1 : 1;
    const trans = currentTrans - (shiftCount * slideWidth) * direct;

    const nextActiveIndexes: number[] = [];
    for (let i = 0; i < this.carousel.activeCount; ++i) {
      nextActiveIndexes.push((nextIndex + i + this.carousel.count) % this.carousel.count);
    }

    const intersectionIndexes = nextActiveIndexes.filter(
      (index: number) => this.carousel.activeIndexes.includes(index)
    );

    let left = 0;
    const animatedCount = shiftCount < this.carousel.activeCount ? this.carousel.activeCount : shiftCount;
    for (let i = 0; i < animatedCount; ++i) {
      const computedIndex = (nextIndex + i + this.carousel.count) % this.carousel.count;
      const minActive = Math.min(...this.carousel.activeIndexes);
      // make next active slides be in one line
      if (computedIndex >= this.carousel.firstIndex && direction === 'left') {
        left = currentLeft - areaWidth;
      } else if (computedIndex <= minActive && direction === 'right') {
        left = currentLeft + areaWidth;
      } else {
        left = currentLeft;
      }

      // exclude slides that are active now and have to be active then
      if (!intersectionIndexes.includes(computedIndex)) {
        this.carousel.$slides[computedIndex].style.left = left + 'px';
      }

      // handle slides that are active now and have to be active then
      if (intersectionIndexes.includes(computedIndex)) {
        const orderIndex = nextActiveIndexes.indexOf(computedIndex);
        const time = (direction === 'right') ?
          (transitionDuration / this.carousel.activeCount) * orderIndex :
          (transitionDuration / this.carousel.activeCount) * (this.carousel.activeCount - orderIndex - 1);
        const copyLeft = left;
        setTimeout(() => {
          this.carousel.$slides[computedIndex].style.left = copyLeft + 'px';
        }, time);
      }

    }

    this.carousel.$slides.forEach((slide) => {
      // exclude slides that are active now and have to be active then

      slide.style.transform = `translateX(${trans}px)`;

      // handle slides that are active now and have to be active then
      const sIndex = slide.index;
      if (intersectionIndexes.includes(sIndex)) {
        const orderIndex = nextActiveIndexes.indexOf(sIndex);
        const time = (direction === 'right') ?
          (transitionDuration / this.carousel.activeCount) * orderIndex :
          (transitionDuration / this.carousel.activeCount) * (this.carousel.activeCount - orderIndex - 1);
        setTimeout(() => {
          this.carousel.$slides[sIndex].style.transform = `translateX(${trans}px)`;
        }, time);
      }
    });

    this.carousel.setAttribute('data-is-animated', 'true');

    setTimeout(() => {
      this.carousel.removeAttribute('data-is-animated');
    }, transitionDuration);

  }
}

ESLCarouselViewRegistry.instance.registerView('multiple', ESLMultiCarouselView);

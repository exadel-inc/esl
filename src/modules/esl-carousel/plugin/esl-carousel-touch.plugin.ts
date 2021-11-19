import {ExportNs} from '../../esl-utils/environment/export-ns';
import {DeviceDetector} from '../../esl-utils/environment/device-detector';
import {EventUtils} from '../../esl-utils/dom/events';
import {ESLCarouselPlugin} from './esl-carousel-plugin';

import type {Point} from '../../esl-utils/dom/events';
import {bind} from '../../esl-utils/decorators/bind';

/**
 * Slide Carousel Touch plugin
 */
@ExportNs('CarouselPlugins.Touch')
export class ESLCarouselTouchPlugin extends ESLCarouselPlugin {
  public static is = 'esl-carousel-touch-plugin';

  private isTouchStarted = false;
  private startPoint: Point = {x: 0, y: 0};
  private movePoint: Point = {x: 0, y: 0};
  protected currentIndex: number;

  public bind() {
    const events = DeviceDetector.TOUCH_EVENTS;

    this.carousel.addEventListener(events.START, this.onTouchStart);
    this.carousel.addEventListener(events.MOVE, this.onTouchMove);
    this.carousel.addEventListener(events.END, this.onTouchEnd);
    this.carousel.addEventListener('transitionend', this._onTransitionEnd);
  }

  public unbind() {
    const events = DeviceDetector.TOUCH_EVENTS;

    this.carousel.removeEventListener(events.START, this.onTouchStart);
    this.carousel.removeEventListener(events.MOVE, this.onTouchMove);
    this.carousel.removeEventListener(events.END, this.onTouchEnd);
    this.carousel.removeEventListener('transitionend', this._onTransitionEnd);

  }

  onTouchStart = (event: TouchEvent | PointerEvent) => {
    // TODO: precondition for focused element ?
    if ((event instanceof TouchEvent && event.touches.length !== 1) ||
      (event instanceof PointerEvent && event.pointerType !== 'touch')) {
      this.isTouchStarted = false;
      return;
    }
    this.isTouchStarted = true;
    this.startPoint = EventUtils.normalizeTouchPoint(event);
    this.carousel.$slides.forEach((el) => el.toggleAttribute('visible', true));
  };

  onTouchMove = (event: TouchEvent | PointerEvent) => {
    if (!this.isTouchStarted) return;
    const point = EventUtils.normalizeTouchPoint(event);
    // const prevPoint = this.isMoved ? this.movePoint : this.startPoint;
    this.movePoint = point;
    const shiftX = point.x - this.startPoint.x;

    const width = parseFloat(getComputedStyle(this.carousel.$slides[0]).width);
    const count = Math.floor(Math.abs(shiftX) / width);

    let offset = shiftX;
    if (count > 0) {
      offset = shiftX < 0 ? shiftX + count * width : shiftX + count * width;
    }

    if (count > 0) {
      this.currentIndex = this.carousel.normalizeIndex(this.carousel.firstIndex + count);
      this._setOrderFrom(this.currentIndex);
    }

    // this.carousel.toggleAttribute('animate', true);
    // this.carousel.goTo(nextIndex, direction);
    this.carousel.$slidesArea!.style.transform = `translateX(${offset}px)`;
  };

  protected _setOrderFrom(index: number) {
    if (index < 0 || index > this.carousel.count) return;

    let $slide = this.carousel.$slides[index];
    for (let order = 0; order < this.carousel.count; order++) {
      if (order === 0) this.currentIndex = $slide.index;
      $slide.style.order = String(order);
      $slide = this.carousel.getNextSlide($slide);
    }
  }


  onTouchEnd = (event: TouchEvent | PointerEvent) => {
    if (!this.isTouchStarted) return;
    this.carousel.$slides.forEach((el) => el._setActive(false));
    for (let i = 0; i < this.carousel.activeCount; i++) {
      this.carousel.slideAt(this.currentIndex + i)._setActive(true);
    }
    this.carousel.toggleAttribute('animate');
    this.carousel.$slidesArea!.style.transform = 'translateX(0px)';
    this.isTouchStarted = false;
  };

  @bind
  protected _onTransitionEnd(e?: TransitionEvent) {
    if (!e || e.propertyName === 'transform') {
      this.carousel.toggleAttribute('animate', false);
      this.carousel.$slides.forEach((el) => el.toggleAttribute('visible', false));
    }
  }
}

declare global {
  export interface ESLCarouselPlugins {
    Touch: typeof ESLCarouselTouchPlugin;
  }
  export interface HTMLElementTagNameMap {
    'esl-carousel-touch-plugin': ESLCarouselTouchPlugin;
  }
}

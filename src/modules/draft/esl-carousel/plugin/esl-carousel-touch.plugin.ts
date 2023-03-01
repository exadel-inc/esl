import {ExportNs} from '../../../esl-utils/environment/export-ns';
import {DeviceDetector} from '../../../esl-utils/environment/device-detector';
import {getTouchPoint} from '../../../esl-utils/dom/events';
import {ESLCarouselPlugin} from './esl-carousel-plugin';

import type {Point} from '../../../esl-utils/dom/events';

/**
 * Slide Carousel Touch plugin
 */
@ExportNs('CarouselPlugins.Touch')
export class ESLCarouselTouchPlugin extends ESLCarouselPlugin {
  public static override is = 'esl-carousel-touch-plugin';

  private isTouchStarted = false;
  private startPoint: Point = {x: 0, y: 0};

  public override bind() {
    const events = DeviceDetector.TOUCH_EVENTS;

    this.carousel.addEventListener(events.START, this.onTouchStart);
    this.carousel.addEventListener(events.MOVE, this.onTouchMove);
    this.carousel.addEventListener(events.END, this.onTouchEnd);
  }

  public override unbind() {
    const events = DeviceDetector.TOUCH_EVENTS;

    this.carousel.removeEventListener(events.START, this.onTouchStart);
    this.carousel.removeEventListener(events.MOVE, this.onTouchMove);
    this.carousel.removeEventListener(events.END, this.onTouchEnd);
  }

  onTouchStart = (event: TouchEvent | PointerEvent) => {
    // TODO: precondition for focused element ?
    if ((event instanceof TouchEvent && event.touches.length !== 1) ||
      (event instanceof PointerEvent && event.pointerType !== 'touch')) {
      this.isTouchStarted = false;
      return;
    }
    this.isTouchStarted = true;
    this.startPoint = getTouchPoint(event);
  };

  onTouchMove = (event: TouchEvent | PointerEvent) => {
    if (!this.isTouchStarted) return;
    // const point = EventUtils.normalizeTouchPoint(event);
    // const offset = {
    // 	x: point.x - this.startPoint.x,
    // 	y: point.y - this.startPoint.y
    // };
  };

  onTouchEnd = (event: TouchEvent | PointerEvent) => {
    if (!this.isTouchStarted) return;
    const point = getTouchPoint(event);
    const offset = {
      x: point.x - this.startPoint.x,
      y: point.y - this.startPoint.y
    };
    this.isTouchStarted = false;

    // TODO: temporary, update according final implementation
    if (Math.abs(offset.x) < Math.abs(offset.y)) return; // Direction
    if (Math.abs(offset.x) < 100) return; // Tolerance

    // Swipe gesture example
    if (offset.x < 0) {
      this.carousel.next();
    } else {
      this.carousel.prev();
    }
    event.preventDefault();
    event.stopPropagation();
  };
}

declare global {
  export interface ESLCarouselPlugins {
    Touch: typeof ESLCarouselTouchPlugin;
  }
  export interface HTMLElementTagNameMap {
    'esl-carousel-touch-plugin': ESLCarouselTouchPlugin;
  }
}

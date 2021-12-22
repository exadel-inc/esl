import {ExportNs} from '../../esl-utils/environment/export-ns';
import {EventUtils} from '../../esl-utils/dom/events';
import {bind} from '../../esl-utils/decorators/bind';
import {ESLCarouselPlugin} from './esl-carousel-plugin';

import type {Point} from '../../esl-utils/dom/events';

/**
 * Slide Carousel Touch plugin
 */
@ExportNs('CarouselPlugins.Touch')
export class ESLCarouselTouchPlugin extends ESLCarouselPlugin {
  public static is = 'esl-carousel-touch-plugin';

  protected startPoint: Point = {x: 0, y: 0};
  protected isTouchStarted = false;

  public bind() {
    const $area: HTMLElement = this.carousel.$slidesArea!;
    window.MouseEvent && $area.addEventListener('mousedown', this.onPointerDown);
    window.TouchEvent && $area.addEventListener('touchstart', this.onPointerDown);
  }

  public unbind() {
    this.carousel.$slidesArea!.removeEventListener('mousedown', this.onPointerDown);
    this.carousel.$slidesArea!.removeEventListener('mousemove', this.onPointerMove);
    this.carousel.$slidesArea!.removeEventListener('mouseup', this.onPointerUp);
    this.carousel.$slidesArea!.removeEventListener('touchstart', this.onPointerDown);
    this.carousel.$slidesArea!.removeEventListener('touchmove', this.onPointerMove);
    this.carousel.$slidesArea!.removeEventListener('touchend', this.onPointerUp);
  }

  @bind
  protected onPointerDown(event: TouchEvent | PointerEvent | MouseEvent) {
    if (this.carousel.hasAttribute('animate')) return;

    // TODO: precondition for focused element ?
    if ((event instanceof TouchEvent && event.touches.length !== 1) ||
      (event instanceof PointerEvent && event.pointerType !== 'touch')) {
      this.isTouchStarted = false;
      return;
    }

    this.isTouchStarted = true;
    this.startPoint = EventUtils.normalizeTouchPoint(event);

    EventUtils.isMouseEvent(event) && window.addEventListener('mousemove', this.onPointerMove);
    EventUtils.isTouchEvent(event) && window.addEventListener('touchmove', this.onPointerMove, {passive: false});
    EventUtils.isMouseEvent(event) && window.addEventListener('mouseup', this.onPointerUp);
    EventUtils.isTouchEvent(event) && window.addEventListener('touchend', this.onPointerUp, {passive: false});
  }

  @bind
  protected onPointerMove(event: TouchEvent | PointerEvent | MouseEvent) {
    if (!this.isTouchStarted) return;

    const point = EventUtils.normalizeTouchPoint(event);
    const shiftX = point.x - this.startPoint.x;
    this.carousel.view?.onMove(shiftX);
  }

  @bind
  protected onPointerUp(event: TouchEvent | PointerEvent | MouseEvent) {
    if (!this.isTouchStarted) return;
    const point = EventUtils.normalizeTouchPoint(event);
    const shiftX = point.x - this.startPoint.x;
    this.carousel.view?.commit(shiftX > 0 ? 'next' : 'prev');
    this.isTouchStarted = false;
    // Unbind drag listeners
    if (EventUtils.isMouseEvent(event)) {
      window.removeEventListener('mousemove', this.onPointerMove);
      window.removeEventListener('mouseup', this.onPointerUp);
    }
    if (EventUtils.isTouchEvent(event)) {
      window.removeEventListener('touchmove', this.onPointerMove);
      window.removeEventListener('touchend', this.onPointerUp);
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

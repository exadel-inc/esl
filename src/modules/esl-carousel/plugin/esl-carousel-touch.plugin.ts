import {ExportNs} from '../../esl-utils/environment/export-ns';
import {isMouseEvent, isTouchEvent, getTouchPoint} from '../../esl-utils/dom/events';
import {bind} from '../../esl-utils/decorators/bind';

import {ESLCarouselPlugin} from '../core/esl-carousel-plugin';

import type {Point} from '../../esl-utils/dom/events';

/**
 * Slide Carousel Touch plugin
 */
@ExportNs('CarouselPlugins.Touch')
export class ESLCarouselTouchPlugin extends ESLCarouselPlugin {
  public static is = 'esl-carousel-touch-plugin';

  /** Point to start from. */
  protected startPoint: Point = {x: 0, y: 0};
  /** Marker whether touch event is started. */
  protected isTouchStarted = false;

  public bind(): void {
    const $area: HTMLElement = this.carousel.$slidesArea!;
    window.MouseEvent && $area.addEventListener('mousedown', this.onPointerDown);
    window.TouchEvent && $area.addEventListener('touchstart', this.onPointerDown);
  }

  public unbind(): void {
    this.carousel.$slidesArea!.removeEventListener('mousedown', this.onPointerDown);
    this.carousel.$slidesArea!.removeEventListener('mousemove', this.onPointerMove);
    this.carousel.$slidesArea!.removeEventListener('mouseup', this.onPointerUp);
    this.carousel.$slidesArea!.removeEventListener('touchstart', this.onPointerDown);
    this.carousel.$slidesArea!.removeEventListener('touchmove', this.onPointerMove);
    this.carousel.$slidesArea!.removeEventListener('touchend', this.onPointerUp);
  }

  /** @returns marker whether the event should be ignored. */
  protected isIgnoredEvent(event: TouchEvent | PointerEvent | MouseEvent): boolean | undefined {
    // Multi-touch gesture
    if (isTouchEvent(event) && event.touches.length !== 1) return true;
    // Non-primary mouse button initiate drug event
    if (isMouseEvent(event) && event.button !== 0) return true;
    // TODO: form events focus handler
  }

  /** Processes `mousedown` and `touchstart` events. */
  @bind
  protected onPointerDown(event: TouchEvent | PointerEvent | MouseEvent): void {
    if (this.carousel.hasAttribute('animate')) return;

    this.isTouchStarted = !this.isIgnoredEvent(event);
    if (!this.isTouchStarted) return;

    this.startPoint = getTouchPoint(event);

    isMouseEvent(event) && window.addEventListener('mousemove', this.onPointerMove);
    isTouchEvent(event) && window.addEventListener('touchmove', this.onPointerMove, {passive: false});
    isMouseEvent(event) && window.addEventListener('mouseup', this.onPointerUp);
    isTouchEvent(event) && window.addEventListener('touchend', this.onPointerUp, {passive: false});
  }

  /** Processes `mousemove` and `touchmove` events. */
  @bind
  protected onPointerMove(event: TouchEvent | PointerEvent | MouseEvent): void {
    if (!this.isTouchStarted) return;

    const point = getTouchPoint(event);
    const offset = point.x - this.startPoint.x;

    // ignore single click
    offset !== 0 && this.carousel.view?.onMove(offset);
  }

  /** Processes `mouseup` and `touchend` events. */
  @bind
  protected onPointerUp(event: TouchEvent | PointerEvent | MouseEvent): void {
    if (!this.isTouchStarted) return;
    const point = getTouchPoint(event);
    const offset = point.x - this.startPoint.x;
    // ignore single click
    offset !== 0 && this.carousel?.view.commit(offset);
    this.isTouchStarted = false;
    // Unbind drag listeners
    if (isMouseEvent(event)) {
      window.removeEventListener('mousemove', this.onPointerMove);
      window.removeEventListener('mouseup', this.onPointerUp);
    }
    if (isTouchEvent(event)) {
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

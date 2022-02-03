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

  protected isIgnoredEvent(event: TouchEvent | PointerEvent | MouseEvent): boolean | undefined {
    // Multi-touch gesture
    if (EventUtils.isTouchEvent(event) && event.touches.length !== 1) return true;
    // Non-primary mouse button initiate drug event
    if (EventUtils.isMouseEvent(event) && event.button !== 0) return true;
    // TODO: form events focus handler
  }

  @bind
  protected onPointerDown(event: TouchEvent | PointerEvent | MouseEvent): void {
    if (this.carousel.hasAttribute('animate')) return;

    this.isTouchStarted = !this.isIgnoredEvent(event);
    if (!this.isTouchStarted) return;

    this.startPoint = EventUtils.normalizeTouchPoint(event);

    EventUtils.isMouseEvent(event) && window.addEventListener('mousemove', this.onPointerMove);
    EventUtils.isTouchEvent(event) && window.addEventListener('touchmove', this.onPointerMove, {passive: false});
    EventUtils.isMouseEvent(event) && window.addEventListener('mouseup', this.onPointerUp);
    EventUtils.isTouchEvent(event) && window.addEventListener('touchend', this.onPointerUp, {passive: false});
  }

  @bind
  protected onPointerMove(event: TouchEvent | PointerEvent | MouseEvent): void {
    if (!this.isTouchStarted) return;

    const point = EventUtils.normalizeTouchPoint(event);
    const offset = point.x - this.startPoint.x;

    this._checkNonLoop(offset) && this.carousel.view?.onMove(offset);
  }

  @bind
  protected onPointerUp(event: TouchEvent | PointerEvent | MouseEvent): void {
    if (!this.isTouchStarted) return;
    const point = EventUtils.normalizeTouchPoint(event);
    const offset = point.x - this.startPoint.x;
    // ignore single click
    offset !== 0 && this._checkNonLoop(offset) && this.carousel.view?.commit(offset);
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

  /**
   *
   * */
  protected _checkNonLoop(offset: number): boolean {
    if (!this.carousel.loop && this.carousel.firstIndex + this.carousel.activeCount === this.carousel.count && offset < 0) return false;
    if (!this.carousel.loop && this.carousel.firstIndex === 0 && offset > 0) return false;
    return true;
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

import {ExportNs} from '../../../esl-utils/environment/export-ns';
import {attr, prop, listen} from '../../../esl-utils/decorators';
import {getTouchPoint, isMouseEvent, isTouchEvent} from '../../../esl-utils/dom';
import {ESLMediaQuery} from '../../../esl-media-query/core';

import {ESLCarouselPlugin} from '../esl-carousel.plugin';

import type {Point} from '../../../esl-utils/dom/events';


/**
 * {@link ESLCarousel} Touch handler mixin
 *
 * Usage:
 * ```
 * <esl-carousel esl-carousel-touch="all"></esl-carousel>
 *
 * <esl-carousel esl-carousel-touch="@mobile"></esl-carousel>
 * ```
 */
@ExportNs('Carousel.Touch')
export class ESLCarouselTouchMixin extends ESLCarouselPlugin {
  public static override is = 'esl-carousel-touch';

  /** Min distance in pixels to activate drugging mode */
  @prop(5) public tolerance: number;

  /** {@link ESLMediaQuery} condition to have touch support active */
  @attr({name: ESLCarouselTouchMixin.is}) public media: string;

  /** Point to start from */
  protected startPoint: Point = {x: 0, y: 0};
  /** Marker whether touch event is started */
  protected isTouchStarted = false;

  /** @returns marker whether the event should be ignored. */
  protected isIgnoredEvent(event: TouchEvent | PointerEvent | MouseEvent): boolean | undefined {
    // No nav required
    if (this.$host.size <= this.$host.config.count) return true;
    // Check for media condition
    if (!ESLMediaQuery.for(this.media).matches) return true;
    // Multi-touch gesture
    if (isTouchEvent(event) && event.touches.length !== 1) return true;
    // Non-primary mouse button initiate drug event
    if (isMouseEvent(event) && event.button !== 0) return true;
    // Check for form target
    return !!(event.target as HTMLElement).closest('input, textarea, [editable]');
  }

  /** Handles `mousedown` / `touchstart` event to manage thumb drag start and scroll clicks */
  @listen('mousedown touchstart')
  protected _onPointerDown(event: MouseEvent | TouchEvent): void {
    if (this.isTouchStarted || !this.$host.renderer || this.$host.animating) return;

    this.isTouchStarted = !this.isIgnoredEvent(event);
    if (!this.isTouchStarted) return;

    this.startPoint = getTouchPoint(event);

    isMouseEvent(event) && this.$$on({event: 'mousemove', target: window}, this._onPointerMove);
    isMouseEvent(event) && this.$$on({event: 'mouseup', target: window}, this._onPointerUp);
    isTouchEvent(event) && this.$$on({event: 'touchmove', target: window}, this._onPointerMove);
    isTouchEvent(event) && this.$$on({event: 'touchend', target: window}, this._onPointerUp);
  }

  /** Processes `mousemove` and `touchmove` events. */
  protected _onPointerMove(event: TouchEvent | PointerEvent | MouseEvent): void {
    if (!this.isTouchStarted) return;
    const point = getTouchPoint(event);
    const offset = point.x - this.startPoint.x;

    if (!this.$host.hasAttribute('dragging')) {
      if (Math.abs(offset) < this.tolerance) return;
      this.$$attr('dragging', true);
    }

    event.preventDefault();
    // ignore single click
    offset !== 0 && this.$host.renderer.onMove(offset);
  }

  /** Processes `mouseup` and `touchend` events. */
  protected _onPointerUp(event: TouchEvent | PointerEvent | MouseEvent): void {
    // Unbinds drag listeners
    this.$$off(this._onPointerMove);
    this.$$off(this._onPointerUp);

    this.isTouchStarted = false;

    if (this.$$attr('dragging', false) !== null) {
      event.preventDefault();
      const point = getTouchPoint(event);
      const offset = point.x - this.startPoint.x;
      // ignore single click
      offset !== 0 && this.$host.renderer.commit(offset);
    }
  }
}

declare global {
  export interface ESLCarouselNS {
    Touch: typeof ESLCarouselTouchMixin;
  }
}

import {ExportNs} from '../../../esl-utils/environment/export-ns';
import {ESLMixinElement} from '../../../esl-mixin-element/core';
import {attr, listen} from '../../../esl-utils/decorators';
import {getTouchPoint, isMouseEvent, isTouchEvent} from '../../../esl-utils/dom';
import {ESLMediaQuery} from '../../../esl-media-query/core';

import {ESLCarousel} from '../../core/esl-carousel';

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
export class ESLCarouselTouchPlugin extends ESLMixinElement {
  public static override is = 'esl-carousel-touch';

  /** Carousel target */
  public override $host: ESLCarousel;

  @attr({name: ESLCarouselTouchPlugin.is}) public media: string;

  /** Point to start from. */
  protected startPoint: Point = {x: 0, y: 0};
  /** Marker whether touch event is started */
  protected isTouchStarted = false;

  public override async connectedCallback(): Promise<void> {
    const {$host} = this;
    await ESLCarousel.registered;
    if (($host as unknown) instanceof ESLCarousel) {
      super.connectedCallback();
    } else {
      console.error('[ESL]: %o is not correct target for %o', $host, ESLCarouselTouchPlugin.is);
    }
  }

  /** @returns marker whether the event should be ignored. */
  protected isIgnoredEvent(event: TouchEvent | PointerEvent | MouseEvent): boolean | undefined {
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
    if (this.isTouchStarted || this.$host.animating) return;

    this.isTouchStarted = !this.isIgnoredEvent(event);
    this.$$attr('dragging', this.isTouchStarted);
    if (!this.isTouchStarted) return;

    this.$$attr('dragging', true);
    this.startPoint = getTouchPoint(event);

    isMouseEvent(event) && this.$$on({event: 'mousemove', target: window}, this._onPointerMove);
    isMouseEvent(event) && this.$$on({event: 'mouseup', target: window}, this._onPointerUp);
    isTouchEvent(event) && this.$$on({event: 'touchmove', target: window}, this._onPointerMove);
    isTouchEvent(event) && this.$$on({event: 'touchend', target: window}, this._onPointerUp);
  }

  /** Processes `mousemove` and `touchmove` events. */
  protected _onPointerMove(event: TouchEvent | PointerEvent | MouseEvent): void {
    if (!this.isTouchStarted || !this.$host.view) return;

    const point = getTouchPoint(event);
    const offset = point.x - this.startPoint.x;

    // ignore single click
    offset !== 0 && this.$host.view.onMove(offset);
  }

  /** Processes `mouseup` and `touchend` events. */
  protected _onPointerUp(event: TouchEvent | PointerEvent | MouseEvent): void {
    if (!this.isTouchStarted || !this.$host.view) return;

    const point = getTouchPoint(event);
    const offset = point.x - this.startPoint.x;

    // ignore single click
    offset !== 0 && this.$host.view.commit(offset);
    this.isTouchStarted = false;
    this.$$attr('dragging', false);
    // Unbinds drag listeners
    this.$$off(this._onPointerMove);
    this.$$off(this._onPointerUp);
  }
}

declare global {
  export interface ESLCarouselNS {
    Touch: typeof ESLCarouselTouchPlugin;
  }
  export interface HTMLElementTagNameMap {
    'esl-carousel-touch-plugin': ESLCarouselTouchPlugin;
  }
}

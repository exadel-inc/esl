import {ExportNs} from '../../../esl-utils/environment/export-ns';
import {attr, prop, listen, memoize} from '../../../esl-utils/decorators';
import {
  ESLSwipeGestureEvent,
  ESLSwipeGestureTarget,
  getTouchPoint,
  isMouseEvent,
  isTouchEvent
} from '../../../esl-utils/dom';
import {ESLMediaRuleList} from '../../../esl-media-query/core';

import {ESLCarouselPlugin} from '../esl-carousel.plugin';

import type {Point} from '../../../esl-utils/dom';

export type TouchType = 'drag' | 'swipe' | 'none';

const toTouchType = (value: string): TouchType => {
  value = value.toLowerCase();
  if (value === ESLCarouselTouchMixin.DRAG_TYPE || value === ESLCarouselTouchMixin.SWIPE_TYPE) return value;
  return 'none';
};

/**
 * {@link ESLCarousel} Touch handler mixin
 *
 * Usage:
 * ```
 * <esl-carousel esl-carousel-touch></esl-carousel>
 *
 * <esl-carousel esl-carousel-touch="@XS => swipe | @+SM => drag"></esl-carousel>
 * ```
 */
@ExportNs('Carousel.Touch')
export class ESLCarouselTouchMixin extends ESLCarouselPlugin {
  public static override is = 'esl-carousel-touch';
  public static readonly DRAG_TYPE = 'drag';
  public static readonly SWIPE_TYPE = 'swipe';

  /** Min distance in pixels to activate dragging mode */
  @prop(5) public tolerance: number;

  /** Condition to have drag and swipe support active. Supports {@link ESLMediaRuleList} */
  @attr({name: ESLCarouselTouchMixin.is, defaultValue: 'drag'}) public type: string;

  /** Defines type of swipe */
  @attr({name: 'esl-carousel-swipe-mode', defaultValue: 'group'}) public swipeType: 'group' | 'slide';

  /** @returns rule {@link ESLMediaRuleList} for touch types */
  @memoize()
  public get typeRule(): ESLMediaRuleList<TouchType> {
    return ESLMediaRuleList.parse(this.type, toTouchType);
  }

  /** Point to start from */
  protected startPoint: Point = {x: 0, y: 0};
  /** Marker whether touch event is started */
  protected isTouchStarted = false;

  /** @returns marker whether the event should be ignored. */
  protected isIgnoredEvent(event: TouchEvent | PointerEvent | MouseEvent): boolean | undefined {
    // No nav required
    if (this.$host.size <= this.$host.config.count) return true;
    // Multi-touch gesture
    if (isTouchEvent(event) && event.touches.length !== 1) return true;
    // Non-primary mouse button initiate drug event
    if (isMouseEvent(event) && event.button !== 0) return true;
    // Check for form target
    return !!(event.target as HTMLElement).closest('input, textarea, [editable]');
  }

  /** Handles `mousedown` / `touchstart` event to manage thumb drag start and scroll clicks */
  @listen({
    event: 'mousedown touchstart',
    condition: (that: ESLCarouselTouchMixin) => that.typeRule.value === ESLCarouselTouchMixin.DRAG_TYPE
  })
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
    const offset = this.$host.config.vertical ? point.y - this.startPoint.y : point.x - this.startPoint.x;

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
      const offset = this.$host.config.vertical ? point.y - this.startPoint.y : point.x - this.startPoint.x;
      // ignore single click
      offset !== 0 && this.$host.renderer.commit(offset);
    }
  }

  /** Handles `swipe` event */
  @listen({
    event: ESLSwipeGestureEvent.type,
    target: ESLSwipeGestureTarget.for,
    condition: (that: ESLCarouselTouchMixin)=> that.typeRule.value === ESLCarouselTouchMixin.SWIPE_TYPE
  })
  protected _onSwipe(e: ESLSwipeGestureEvent): void {
    if (!this.$host || this.$host.animating) return;
    if (this.$host.config.vertical !== e.isVertical) return;
    const direction = e.direction === 'left' || e.direction === 'up' ? 'next' : 'prev';
    this.$host?.goTo(`${this.swipeType}:${direction}`);
  }

  @listen({event: 'change', target: (that: ESLCarouselTouchMixin) => that.typeRule})
  protected _onTypeChanged(): void {
    this.$$off(this._onPointerDown);
    this.$$off(this._onSwipe);
    this.$$on(this._onPointerDown);
    this.$$on(this._onSwipe);
  }
}

declare global {
  export interface ESLCarouselNS {
    Touch: typeof ESLCarouselTouchMixin;
  }
}

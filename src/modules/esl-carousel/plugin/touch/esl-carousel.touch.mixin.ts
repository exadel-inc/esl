import {ExportNs} from '../../../esl-utils/environment/export-ns';
import {attr, prop, listen, memoize} from '../../../esl-utils/decorators';
import {getTouchPoint, isMouseEvent, isTouchEvent} from '../../../esl-utils/dom/events';
import {getParentScrollOffsets, isOffsetChanged} from '../../../esl-utils/dom/scroll';
import {buildEnumParser} from '../../../esl-utils/misc/enum';
import {ESLMediaRuleList} from '../../../esl-media-query/core';

import {ESLCarouselPlugin} from '../esl-carousel.plugin';

import type {Point} from '../../../esl-utils/dom/point';
import type {ElementScrollOffset} from '../../../esl-utils/dom/scroll';

export type TouchType = 'drag' | 'swipe' | 'none';
const toTouchType: (str: string) => TouchType = buildEnumParser('none', 'drag', 'swipe');

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
  @prop(10) public tolerance: number;

  /** Condition to have drag and swipe support active. Supports {@link ESLMediaRuleList} */
  @attr({name: ESLCarouselTouchMixin.is}) public type: string;

  /** Defines type of swipe */
  @attr({name: 'esl-carousel-swipe-mode', defaultValue: 'group'}) public swipeType: 'group' | 'slide';
  /** Defines distance tolerance to swipe */
  @attr({name: 'esl-carousel-swipe-distance', defaultValue: 20, parser: parseInt}) public swipeDistance: number;
  /** Defines timeout tolerance to swipe */
  @attr({name: 'esl-carousel-swipe-timeout', defaultValue: 700, parser: parseInt}) public swipeTimeout: number;

  /** Coordinate of touch start event */
  protected startPoint: Point = {x: 0, y: 0};
  /** Timestamp of touch start event */
  protected startTimestamp = 0;
  /** Initial scroll offsets, filled on touch action start */
  protected startScrollOffsets: ElementScrollOffset[];

  /** @returns rule {@link ESLMediaRuleList} for touch types */
  @memoize()
  public get typeRule(): ESLMediaRuleList<TouchType> {
    return ESLMediaRuleList.parse(this.type || ESLCarouselTouchMixin.DRAG_TYPE, toTouchType);
  }

  /** @returns whether the swipe mode is active */
  public get isSwipeMode(): boolean {
    return this.typeRule.value === ESLCarouselTouchMixin.SWIPE_TYPE;
  }
  /** @returns whether the drag mode is active */
  public get isDragMode(): boolean {
    return this.typeRule.value === ESLCarouselTouchMixin.DRAG_TYPE;
  }

  /** @returns whether the plugin is disabled (due to carousel state or plugin config) */
  public get isDisabled(): boolean {
    // Plugin is disabled
    if (!this.isDragMode && !this.isSwipeMode) return true;
    // Carousel is not ready
    if (!this.$host.renderer || this.$host.animating) return true;
    // No nav required
    return this.$host.size <= this.$host.config.count;
  }

  protected override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (name === ESLCarouselTouchMixin.is) memoize.clear(this, 'typeRule');
  }

  /** @returns if the initial event should be ignored */
  protected isStartPrevented(event: TouchEvent | PointerEvent | MouseEvent): boolean | undefined {
    // Multi-touch gesture
    if (isTouchEvent(event) && event.touches.length !== 1) return true;
    // Non-primary mouse button initiate drug event
    if (isMouseEvent(event) && event.button !== 0) return true;
    // Check for form targets
    return !!(event.target as HTMLElement).closest('input, textarea, [editable]');
  }

  /** @returns if the event should prevent touch action */
  protected isTouchActionPrevented(event: TouchEvent | PointerEvent | MouseEvent): boolean {
    // Prevents draggable state if the content is scrolled
    if (isOffsetChanged(this.startScrollOffsets)) return true;
    // Prevents draggable state if the text is selected
    if (document.getSelection()?.isCollapsed === false) return true;
    // Prevents draggable state if the offset is not reached tolerance or the swipe timeout
    return this.isSwipeMode && event.timeStamp - this.startTimestamp > this.swipeTimeout;
  }

  /** @returns offset between start point and passed event point */
  protected getOffset(event: TouchEvent | PointerEvent | MouseEvent): number {
    const point = getTouchPoint(event);
    return this.$host.config.vertical ? point.y - this.startPoint.y : point.x - this.startPoint.x;
  }

  /** Handles `mousedown` / `touchstart` event to manage thumb drag start and scroll clicks */
  @listen('mousedown touchstart')
  protected _onPointerDown(event: MouseEvent | TouchEvent): void {
    if (this.isDisabled) return;
    if (this.isStartPrevented(event)) return;

    this.startPoint = getTouchPoint(event);
    this.startTimestamp = event.timeStamp;
    this.startScrollOffsets = getParentScrollOffsets(event.target as Element, this.$host);

    isMouseEvent(event) && this.$$on({event: 'mousemove', target: window}, this._onPointerMove);
    isMouseEvent(event) && this.$$on({event: 'mouseup', target: window}, this._onPointerUp);
    isTouchEvent(event) && this.$$on({event: 'touchmove', target: window}, this._onPointerMove);
    isTouchEvent(event) && this.$$on({event: 'touchend', target: window}, this._onPointerUp);
  }

  /** Processes `mousemove` and `touchmove` events. */
  protected _onPointerMove(event: TouchEvent | PointerEvent | MouseEvent): void {
    const offset = this.getOffset(event);

    if (!this.$host.hasAttribute('dragging')) {
      // Stop tracking if prevented before dragging started
      if (this.isTouchActionPrevented(event)) return this._onPointerUp(event);
      // Does not start dragging mode if offset have not reached tolerance
      if (Math.abs(offset) < this.tolerance) return;
      this.$$attr('dragging', true);
    }
    event.preventDefault();

    if (this.isDragMode) this.$host.renderer.onMove(offset);
  }

  /** Processes `mouseup` and `touchend` events. */
  protected _onPointerUp(event: TouchEvent | PointerEvent | MouseEvent): void {
    // Unbinds drag listeners
    this.$$off(this._onPointerMove);
    this.$$off(this._onPointerUp);

    if (this.$$attr('dragging', false) === null) return;
    event.preventDefault();

    const offset = this.getOffset(event);
    // ignore single click
    if (offset === 0) return;
    // Commit drag offset
    if (this.isDragMode) this.$host.renderer.commit(offset);
    // Swipe final check
    if (this.isSwipeMode && !this.isTouchActionPrevented(event)) {
      const target = `${this.swipeType}:${offset < 0 ? 'next' : 'prev'}`;
      if (this.$host.canNavigate(target)) this.$host.goTo(target);
    }
  }
}

declare global {
  export interface ESLCarouselNS {
    Touch: typeof ESLCarouselTouchMixin;
  }
}

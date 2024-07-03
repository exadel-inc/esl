import {ExportNs} from '../../../esl-utils/environment/export-ns';
import {attr, prop, listen, memoize} from '../../../esl-utils/decorators';
import {getParentScrollOffsets, isOffsetChanged} from '../../../esl-utils/dom/scroll';
import {buildEnumParser} from '../../../esl-utils/misc/enum';
import {ESLEventUtils} from '../../../esl-event-listener/core';
import {ESLMediaRuleList} from '../../../esl-media-query/core';

import {ESLCarouselPlugin} from '../esl-carousel.plugin';

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
  @attr({name: 'esl-carousel-swipe-timeout', defaultValue: 400, parser: parseInt}) public swipeTimeout: number;

  /** Start pointer event to detect action */
  protected startEvent?: PointerEvent;
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

  /** @returns whether the drugging is prevented by external conditions (scroll, selection) */
  public get isPrevented(): boolean {
    // Prevents draggable state if the content is scrolled
    if (isOffsetChanged(this.startScrollOffsets)) return true;
    // Prevents draggable state if the text is selected
    return document.getSelection()?.isCollapsed === false;
  }

  protected override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (name === ESLCarouselTouchMixin.is) memoize.clear(this, 'typeRule');
  }

  /** @returns offset between start point and passed event point */
  protected getOffset(event: PointerEvent): number {
    if (event.type === 'pointercancel') return 0;
    const property = this.$host.config.vertical ? 'clientY' : 'clientX';
    return this.startEvent ? (event[property] - this.startEvent[property]) : 0;
  }

  /** @returns if the passed event leads to swipe action */
  protected isSwipeAccepted(event: PointerEvent): boolean {
    if (!this.startEvent) return false;
    // Ignore swipe if timeout threshold exceeded
    if (event.timeStamp - this.startEvent.timeStamp > this.swipeTimeout) return false;
    // Ignore swipe if offset is not enough
    return Math.abs(this.getOffset(event)) > this.swipeDistance;
  }

  /** Handles `mousedown` / `touchstart` event to manage thumb drag start and scroll clicks */
  @listen('pointerdown')
  protected _onPointerDown(event: PointerEvent): void {
    if (this.isDisabled) return;

    this.startEvent = event;
    this.startScrollOffsets = getParentScrollOffsets(event.target as Element, this.$host);

    this.$$on({group: 'pointer'});
  }

  /** Processes `mousemove` and `touchmove` events. */
  @listen({auto: false, event: 'pointermove', group: 'pointer'})
  protected _onPointerMove(event: PointerEvent): void {
    const offset = this.getOffset(event);

    if (!this.$host.hasAttribute('dragging')) {
      // Stop tracking if prevented before dragging started
      if (this.isPrevented) return this._onPointerUp(event);
      // Does not start dragging mode if offset have not reached tolerance
      if (Math.abs(offset) < this.tolerance) return;
      this.$$attr('dragging', true);
    }

    this.$host.setPointerCapture(event.pointerId);

    if (this.isDragMode) this.$host.renderer.onMove(offset);
  }

  /** Processes `mouseup` and `touchend` events. */
  @listen({auto: false, event: 'pointerup pointercancel', group: 'pointer'})
  protected _onPointerUp(event: PointerEvent): void {
    // Unbinds drag listeners
    this.$$off({group: 'pointer'});

    if (this.$host.hasPointerCapture(event.pointerId)) {
      this.$host.releasePointerCapture(event.pointerId);
    }

    if (this.$$attr('dragging', false) === null) return;

    const offset = this.getOffset(event);
    // Commit drag offset (should be commited to 0 if the event is canceled)
    if (this.isDragMode) this.$host.renderer.commit(offset);
    // Swipe final check
    if (this.isSwipeMode && offset && !this.isPrevented && this.isSwipeAccepted(event)) {
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

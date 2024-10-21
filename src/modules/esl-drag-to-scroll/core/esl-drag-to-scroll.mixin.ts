import {ESLMixinElement} from '../../esl-mixin-element/core';
import {listen, memoize} from '../../esl-utils/decorators';
import {evaluate} from '../../esl-utils/misc/format';
import {ExportNs} from '../../esl-utils/environment/export-ns';

import type {Point} from '../../esl-utils/dom/point';

/**
 * ESLDragToScrollConfig - configuration options for the ESLDragToScrollMixin
 */
export interface ESLDragToScrollConfig {
  /** Determines the scrolling axis. Options are 'x', 'y', or 'both' (default) */
  axis: 'x' | 'y' | 'both';
  /** Class name to apply during dragging. Defaults to 'dragging' */
  cls: string;
  /** Min distance in pixels to activate dragging mode. Defaults to 10 */
  tolerance: number;
  /** Prevent dragging if text is selected or not. Defaults to true */
  selection: boolean;
}

/**
 * ESLDragToScrollMixin - mixin to enable drag-to-scroll functionality for any scrollable container element
 * @author Anna Barmina, Alexey Stsefanovich (ala'n)
 *
 * Use example:
 * ```
 * <div class="esl-scrollable-content" esl-drag-to-scroll>
 *   <!-- Content here -->
 * </div>
 * ```
 */
@ExportNs('DragToScrollMixin')
export class ESLDragToScrollMixin extends ESLMixinElement {
  public static override is = 'esl-drag-to-scroll';

  /** Default configuration object */
  public static DEFAULT_CONFIG: ESLDragToScrollConfig = {
    axis: 'both',
    cls: 'dragging',
    tolerance: 10,
    selection: true
  };

  /** Initial pointer event when dragging starts */
  private startEvent: PointerEvent;

  private startScrollLeft: number = 0;
  private startScrollTop: number = 0;

  private _isDragging: boolean = false;

  /** Flag indicating whether dragging is in progress */
  public get isDragging(): boolean {
    return this._isDragging;
  }
  private set isDragging(value: boolean) {
    this._isDragging = value;
    this.$$cls(this.config.cls, value);
  }

  /**
   * Mixin configuration (merged with default)
   * @see ESLDragToScrollConfig
   */
  @memoize()
  public get config(): ESLDragToScrollConfig {
    const config = evaluate(this.$$attr(ESLDragToScrollMixin.is)!, {});
    return {...ESLDragToScrollMixin.DEFAULT_CONFIG, ...config};
  }
  public set config(value: ESLDragToScrollConfig | string) {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    this.$$attr(ESLDragToScrollMixin.is, serialized);
  }

  /** Flag indicating whether text is selected */
  public get hasSelection(): boolean {
    const selection = document.getSelection();
    if (!selection || !this.config.selection) return false;
    // Prevents draggable state if the text is selected
    return !selection.isCollapsed && this.$host.contains(selection.anchorNode);
  }

  protected override attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    memoize.clear(this, 'config');
  }

  /** @returns the offset of the pointer event relative to the start event */
  public getEventOffset(event: PointerEvent): Point {
    if (!this.startEvent || event.type === 'pointercancel') return {x: 0, y: 0};
    const x = this.startEvent.clientX - event.clientX;
    const y = this.startEvent.clientY - event.clientY;
    return {x, y};
  }

  /** Scrolls the host element by the specified offset */
  public scrollBy(offset: Point): void {
    if (this.config.axis === 'x' || this.config.axis === 'both') {
      this.$host.scrollLeft = this.startScrollLeft + offset.x;
    }

    if (this.config.axis === 'y' || this.config.axis === 'both') {
      this.$host.scrollTop = this.startScrollTop + offset.y;
    }
  }

  /** Handles the pointerdown event to start dragging */
  @listen('pointerdown')
  private onPointerDown(event: PointerEvent): void {
    this.startEvent = event;
    this.startScrollLeft = this.$host.scrollLeft;
    this.startScrollTop = this.$host.scrollTop;

    this.$$on({group: 'pointer'});
  }

  /** Handles the pointermove event to perform scrolling while dragging */
  @listen({auto: false, event: 'pointermove', group: 'pointer'})
  private onPointerMove(event: PointerEvent): void {
    const offset = this.getEventOffset(event);

    if (!this.isDragging) {
      // Stop tracking if there was a selection before dragging started
      if (this.hasSelection) return this.onPointerUp(event);
      // Does not start dragging mode if offset have not reached tolerance
      if (Math.abs(Math.max(Math.abs(offset.x), Math.abs(offset.y))) < this.config.tolerance) return;
      this.isDragging = true;
    }

    this.$host.setPointerCapture(event.pointerId);
    this.scrollBy(offset);
  }

  /** Handles the pointerup and pointercancel events to stop dragging */
  @listen({auto: false, event: 'pointerup pointercancel', group: 'pointer'})
  private onPointerUp(event: PointerEvent): void {
    this.$$off({group: 'pointer'});
    if (this.$host.hasPointerCapture(event.pointerId)) {
      this.$host.releasePointerCapture(event.pointerId);
    }
    this.scrollBy(this.getEventOffset(event));
    // Delay be able to prevent side events (click, etc.)
    setTimeout(() => this.isDragging = false);
  }

  @listen('click')
  private onClick(event: MouseEvent): void {
    if (this.isDragging) event.preventDefault();
  }
}

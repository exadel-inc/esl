import {ESLBaseElement} from '../../esl-base-element/core';
import {ExportNs} from '../../esl-utils/environment/export-ns';
import {isElement} from '../../esl-utils/dom/api';
import {isRelativeNode} from '../../esl-utils/dom/traversing';
import {isRTL, normalizeScrollLeft} from '../../esl-utils/dom/rtl';
import {getTouchPoint, getOffsetPoint} from '../../esl-utils/dom/events';
import {bind, ready, attr, boolAttr, listen} from '../../esl-utils/decorators';
import {rafDecorator} from '../../esl-utils/async/raf';
import {ESLTraversingQuery} from '../../esl-traversing-query/core';

/**
 * ESLScrollbar is a reusable web component that replaces the browser's default scrollbar with
 * a custom scrollbar implementation.
 *
 * @author Yuliya Adamskaya
 */
@ExportNs('Scrollbar')
export class ESLScrollbar extends ESLBaseElement {
  public static override is = 'esl-scrollbar';
  public static observedAttributes = ['target', 'horizontal'];

  /** Horizontal scroll orientation marker */
  @boolAttr() public horizontal: boolean;
  /** Disable continuous scroll when the mouse pressed on scrollbar */
  @boolAttr() public noContinuousScroll: boolean;

  /** Target element {@link ESLTraversingQuery} selector. Parent element by default */
  @attr({defaultValue: '::parent'}) public target: string;
  /** Custom class for thumb element. 'scrollbar-thumb' by default */
  @attr({defaultValue: 'scrollbar-thumb'}) public thumbClass: string;
  /** Custom class for track element area. 'scrollbar-track' by default */
  @attr({defaultValue: 'scrollbar-track'}) public trackClass: string;

  /** @readonly Dragging state marker */
  @boolAttr({readonly: true}) public dragging: boolean;
  /** @readonly Inactive state marker */
  @boolAttr({readonly: true}) public inactive: boolean;

  /** @readonly Indicates that the scroll is at the beginning */
  @boolAttr({readonly: true}) public atStart: boolean;
  /** @readonly Indicates that the scroll is at the end */
  @boolAttr({readonly: true}) public atEnd: boolean;

  protected $scrollbarThumb: HTMLElement;
  protected $scrollbarTrack: HTMLElement;

  protected _$target: HTMLElement | null;
  protected _pointerPosition: number;
  protected _initialPosition: number;
  protected _initialMousePosition: number;

  protected _deferredDrag = rafDecorator((e) => this._onPointerDrag(e));
  protected _deferredRefresh = rafDecorator(() => this.refresh());
  protected _scrollTimer: number = 0;
  protected _resizeObserver = new ResizeObserver(this._deferredRefresh);
  protected _mutationObserver = new MutationObserver((rec) => this.updateContentObserve(rec));

  @ready
  protected override connectedCallback(): void {
    super.connectedCallback();
    this.render();
    this.findTarget();
  }

  @ready
  protected override disconnectedCallback(): void {
    this.unbindTargetEvents();
    this._scrollTimer && window.clearTimeout(this._scrollTimer);
  }

  protected override attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    if (!this.connected || oldVal === newVal) return;
    if (attrName === 'target') this.findTarget();
    if (attrName === 'horizontal') this.refresh();
  }

  protected findTarget(): void {
    this.$target = this.target ?
      ESLTraversingQuery.first(this.target, this) as HTMLElement :
      null;
  }

  /** Target element to observe and scroll */
  public get $target(): HTMLElement | null {
    return this._$target || null;
  }

  public set $target(content: HTMLElement | null) {
    this.unbindTargetEvents();
    this._$target = content;
    this.bindTargetEvents();
    this._deferredRefresh();
  }

  protected render(): void {
    this.innerHTML = '';
    this.$scrollbarTrack = document.createElement('div');
    this.$scrollbarTrack.className = this.trackClass;
    this.$scrollbarThumb = document.createElement('div');
    this.$scrollbarThumb.className = this.thumbClass;

    this.$scrollbarTrack.appendChild(this.$scrollbarThumb);
    this.appendChild(this.$scrollbarTrack);
  }

  protected bindTargetEvents(): void {
    if (!this.$target) return;
    // Container resize/scroll observers/listeners
    if (document.documentElement === this.$target) {
      this.$$on({event: 'scroll resize', target: window}, this._onScrollOrResize);
    } else {
      this.$$on({event: 'scroll', target: this.$target}, this._onScrollOrResize);
      this._resizeObserver.observe(this.$target);
    }
    // Subscribes to the child elements resizes
    this._mutationObserver.observe(this.$target, {childList: true});
    Array.from(this.$target.children).forEach((el) => this._resizeObserver.observe(el));
  }

  /** Resubscribes resize observer on child elements when container content changes */
  protected updateContentObserve(recs: MutationRecord[] = []): void {
    if (!this.$target) return;
    const contentChanges = recs.filter((rec) => rec.type === 'childList');
    contentChanges.forEach((rec) => {
      Array.from(rec.addedNodes).filter(isElement).forEach((el: Element) => this._resizeObserver.observe(el));
      Array.from(rec.removedNodes).filter(isElement).forEach((el: Element) => this._resizeObserver.unobserve(el));
    });
    if (contentChanges.length) this._deferredRefresh();
  }

  protected unbindTargetEvents(): void {
    if (!this.$target) return;
    this.$$off(this._onScrollOrResize);
    if (document.documentElement !== this.$target) {
      this._resizeObserver.disconnect();
      this._mutationObserver.disconnect();
    }
  }

  /** @readonly Scrollable distance size value (px) */
  public get scrollableSize(): number {
    if (!this.$target) return 0;
    return this.horizontal ?
      this.$target.scrollWidth - this.$target.clientWidth :
      this.$target.scrollHeight - this.$target.clientHeight;
  }

  /** @readonly Track size value (px) */
  public get trackOffset(): number {
    return this.horizontal ? this.$scrollbarTrack.offsetWidth : this.$scrollbarTrack.offsetHeight;
  }

  /** @readonly Thumb size value (px) */
  public get thumbOffset(): number {
    return this.horizontal ? this.$scrollbarThumb.offsetWidth : this.$scrollbarThumb.offsetHeight;
  }

  /** @readonly Relative thumb size value (between 0.0 and 1.0) */
  public get thumbSize(): number {
    // behave as native scroll
    if (!this.$target || !this.$target.scrollWidth || !this.$target.scrollHeight) return 1;
    const areaSize = this.horizontal ? this.$target.clientWidth : this.$target.clientHeight;
    const scrollSize = this.horizontal ? this.$target.scrollWidth : this.$target.scrollHeight;
    return Math.min((areaSize + 1) / scrollSize, 1);
  }

  /** Relative position value (between 0.0 and 1.0) */
  public get position(): number {
    if (!this.$target) return 0;
    const size = this.scrollableSize;
    if (size <= 0) return 0;
    const offset = this.horizontal ? normalizeScrollLeft(this.$target) : this.$target.scrollTop;
    if (offset < 1) return 0;
    if (offset >= size - 1) return 1;
    return offset / size;
  }

  public set position(position: number) {
    this.scrollTargetTo(this.scrollableSize * this.normalizePosition(position));
    this.refresh();
  }

  /** Normalizes position value (between 0.0 and 1.0) */
  protected normalizePosition(position: number): number {
    const relativePosition = Math.min(1, Math.max(0, position));
    if (!isRTL(this.$target) || !this.horizontal) return relativePosition;
    return relativePosition - 1;
  }

  /** Scrolls target element to passed position */
  protected scrollTargetTo(pos: number): void {
    if (!this.$target) return;
    this.$target.scrollTo({
      [this.horizontal ? 'left' : 'top']: pos,
      behavior: this.dragging ? 'auto' : 'smooth'
    });
  }

  /** Updates thumb size and position */
  public update(): void {
    if (!this.$scrollbarThumb || !this.$scrollbarTrack) return;
    const thumbSize = this.trackOffset * this.thumbSize;
    const thumbPosition = (this.trackOffset - thumbSize) * this.position;
    const style = {
      [this.horizontal ? 'left' : 'top']: `${thumbPosition}px`,
      [this.horizontal ? 'width' : 'height']: `${thumbSize}px`
    };
    Object.assign(this.$scrollbarThumb.style, style);
  }

  /** Updates auxiliary markers */
  public updateMarkers(): void {
    const {position, thumbSize} =  this;
    this.toggleAttribute('at-start', thumbSize < 1 && position <= 0);
    this.toggleAttribute('at-end', thumbSize < 1 && position >= 1);
    this.toggleAttribute('inactive', thumbSize >= 1);
  }

  /** Refreshes scroll state and position */
  public refresh(): void {
    this.update();
    this.updateMarkers();
    this.$$fire('esl:change:scroll', {bubbles: false});
  }

  /** Returns position from PointerEvent coordinates (not normalized) */
  public toPosition(event: PointerEvent): number {
    const {horizontal, thumbOffset, trackOffset} = this;
    const point = getTouchPoint(event);
    const offset = getOffsetPoint(this.$scrollbarTrack);
    const pointPosition = horizontal ? point.x - offset.x : point.y - offset.y;
    const freeTrackArea = trackOffset - thumbOffset; // size of free track px
    const clickPositionNoOffset = pointPosition - thumbOffset / 2;
    return clickPositionNoOffset / freeTrackArea;
  }

  // Event listeners
  /** Handles `pointerdown` event to manage thumb drag start and scroll clicks */
  @listen('pointerdown')
  protected _onPointerDown(event: PointerEvent): void {
    this._initialPosition = this.position;
    this._pointerPosition = this.toPosition(event);
    this._initialMousePosition = this.horizontal ? event.pageX - window.scrollX : event.pageY - window.scrollY;

    if (event.target === this.$scrollbarThumb) {
      this._onThumbPointerDown(event); // Drag start handler
    } else {
      this._onPointerDownTick(true); // Continuous scroll and click handler
    }

    this.$$on(this._onPointerUp);
  }

  /** Handles a scroll click / continuous scroll*/
  @bind
  protected _onPointerDownTick(first: boolean): void {
    this._scrollTimer && window.clearTimeout(this._scrollTimer);

    const position = this.position;
    const allowedOffset = (first ? 1 : 1.5) * this.thumbSize;
    this.position = Math.min(position + allowedOffset, Math.max(position - allowedOffset, this._pointerPosition));

    if (this.position === this._pointerPosition || this.noContinuousScroll) return;
    this._scrollTimer = window.setTimeout(this._onPointerDownTick, 400);
  }

  /** Handles thumb drag start */
  @bind
  protected _onThumbPointerDown(event: PointerEvent): void {
    this.toggleAttribute('dragging', true);
    this.$target?.style.setProperty('scroll-behavior', 'auto');
    // Attaches drag listeners
    this.$$on(this._onBodyClick);
    this.$$on(this._onPointerMove);
  }

  /** Sets position on drag */
  protected _onPointerDrag(event: PointerEvent): void {
    const point = getTouchPoint(event);
    const mousePosition = this.horizontal ? point.x - window.scrollX : point.y - window.scrollY;
    const positionChange = mousePosition - this._initialMousePosition;
    const scrollableAreaHeight = this.trackOffset - this.thumbOffset;
    const absChange = scrollableAreaHeight ? (positionChange / scrollableAreaHeight) : 0;
    this.position = this._initialPosition + absChange;
  }

  /** `pointermove` document handler for thumb drag event. Active only if drag action is active */
  @listen({event: 'pointermove', auto: false})
  protected _onPointerMove(event: PointerEvent): void {
    if (!this.dragging) return;
    // Request position update
    this._deferredDrag(event);
    this.setPointerCapture(event.pointerId);
  }

  /** `pointerup` / `pointercancel` short-time document handler for drag end action */
  @listen({event: 'pointerup pointercancel', target: window, auto: false})
  protected _onPointerUp(event: PointerEvent): void {
    this._scrollTimer && window.clearTimeout(this._scrollTimer);
    this.toggleAttribute('dragging', false);
    this.$target?.style.removeProperty('scroll-behavior');

    // Unbinds drag listeners
    this.$$off(this._onPointerMove);
    this.$$off(this._onPointerUp);

    if (this.hasPointerCapture(event.pointerId)) this.releasePointerCapture(event.pointerId);
  }

  /** Body `click` short-time handler to prevent clicks event on thumb drag. Handles capture phase */
  @listen({auto: false, event: 'click', target: window, once: true, capture: true})
  protected _onBodyClick(event: MouseEvent): void {
    event.stopImmediatePropagation();
  }

  /**
   * Handler for refresh event
   * @param event - instance of 'esl:refresh' event.
   */
  @listen({
    event: (el: ESLScrollbar) => el.REFRESH_EVENT,
    target: window
  })
  protected _onRefresh(event: Event): void {
    if (!isElement(event.target)) return;
    if (!isRelativeNode(event.target.parentNode, this.$target)) return;
    this._deferredRefresh();
  }

  /**
   * Handler for scroll and resize events
   * @param event - instance of 'resize' or 'scroll' event
   */
  protected _onScrollOrResize(event: Event): void {
    if (event.type === 'scroll' && this.dragging) return;
    this._deferredRefresh();
  }
}

declare global {
  export interface ESLLibrary {
    Scrollbar: typeof ESLScrollbar;
  }
  export interface HTMLElementTagNameMap {
    'esl-scrollbar': ESLScrollbar;
  }
}

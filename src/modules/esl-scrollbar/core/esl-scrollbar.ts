import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLBaseElement, attr, boolAttr} from '../../esl-base-element/core';
import {bind} from '../../esl-utils/decorators/bind';
import {ready} from '../../esl-utils/decorators/ready';
import {rafDecorator} from '../../esl-utils/async/raf';
import {EventUtils} from '../../esl-utils/dom/events';
import {isRelativeNode} from '../../esl-utils/dom/traversing';
import {TraversingQuery} from '../../esl-traversing-query/core';
import {RTLUtils} from '../../esl-utils/dom/rtl';

/**
 * ESLScrollbar is a reusable web component that replaces the browser's default scrollbar with
 * a custom scrollbar implementation.
 *
 * @author Yuliya Adamskaya
 */
@ExportNs('Scrollbar')
export class ESLScrollbar extends ESLBaseElement {
  public static is = 'esl-scrollbar';

  /** Horizontal scroll orientation marker */
  @boolAttr() public horizontal: boolean;
  /** Disable continuous scroll when the mouse pressed on scrollbar */
  @boolAttr() public noLongScroll: boolean;

  /** Target element {@link TraversingQuery} selector. Parent element by default */
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
  protected _targetPosition: number;
  protected _initialPosition: number;
  protected _initialMousePosition: number;

  protected deferredRefresh = rafDecorator(() => this.refresh());
  protected _scrollTimer: number = 0;
  protected _resizeObserver = new ResizeObserver(this.deferredRefresh);
  protected _mutationObserver = new MutationObserver((rec) => this.updateContentObserve(rec));

  static get observedAttributes() {
    return ['target', 'horizontal'];
  }

  @ready
  protected connectedCallback() {
    super.connectedCallback();
    this.findTarget();
    this.render();
    this.bindEvents();
  }

  @ready
  protected disconnectedCallback() {
    this.unbindEvents();
    this._scrollTimer && window.clearTimeout(this._scrollTimer);
  }

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
    if (!this.connected && oldVal === newVal) return;
    if (attrName === 'target') this.findTarget();
    if (attrName === 'horizontal') this.refresh();
  }

  protected findTarget() {
    this.$target = this.target ?
      TraversingQuery.first(this.target, this) as HTMLElement :
      null;
  }

  /** Target element to observe and scroll */
  public get $target() {
    return this._$target || null;
  }

  public set $target(content: HTMLElement | null) {
    this.unbindTargetEvents();
    this._$target = content;
    this.bindTargetEvents();
    this.deferredRefresh();
  }

  protected render() {
    this.innerHTML = '';
    this.$scrollbarTrack = document.createElement('div');
    this.$scrollbarTrack.className = this.trackClass;
    this.$scrollbarThumb = document.createElement('div');
    this.$scrollbarThumb.className = this.thumbClass;

    this.$scrollbarTrack.appendChild(this.$scrollbarThumb);
    this.appendChild(this.$scrollbarTrack);
  }

  protected bindEvents() {
    window.MouseEvent && this.addEventListener('mousedown', this._onPointerDown);
    window.TouchEvent && this.addEventListener('touchstart', this._onPointerDown);
    window.addEventListener('esl:refresh', this._onRefresh);
  }

  protected bindTargetEvents() {
    if (!this.$target) return;
    if (document.documentElement === this.$target) {
      window.addEventListener('resize', this._onRefresh, {passive: true});
      window.addEventListener('scroll', this._onRefresh, {passive: true});
    } else {
      this._resizeObserver.observe(this.$target);
      this._mutationObserver.observe(this.$target, {childList: true});
      Array.from(this.$target.children).forEach((el) => this._resizeObserver.observe(el));
      this.$target.addEventListener('scroll', this._onRefresh, {passive: true});
    }
  }

  protected updateContentObserve(recs: MutationRecord[] = []) {
    if (!this.$target) return;
    const contentChanges = recs.filter((rec) => rec.type === 'childList');
    contentChanges.forEach((rec) => {
      Array.from(rec.addedNodes)
        .filter((el) => el instanceof Element)
        .forEach((el: Element) => this._resizeObserver.observe(el));
      Array.from(rec.removedNodes)
        .filter((el) => el instanceof Element)
        .forEach((el: Element) => this._resizeObserver.unobserve(el));
    });
    if (contentChanges.length) this.deferredRefresh();
  }

  protected unbindEvents() {
    window.MouseEvent && this.removeEventListener('mousedown', this._onPointerDown);
    window.TouchEvent && this.removeEventListener('touchstart', this._onPointerDown);
    this.unbindTargetEvents();
    window.removeEventListener('esl:refresh', this._onRefresh);
  }

  protected unbindTargetEvents() {
    if (!this.$target) return;
    if (document.documentElement === this.$target) {
      window.removeEventListener('resize', this._onRefresh);
      window.removeEventListener('scroll', this._onRefresh);
    } else {
      this._resizeObserver.disconnect();
      this._mutationObserver.disconnect();
      this.$target.removeEventListener('scroll', this._onRefresh);
    }
  }

  /** @readonly Scrollable distance size value (px) */
  public get scrollableSize() {
    if (!this.$target) return 0;
    return this.horizontal ?
      this.$target.scrollWidth - this.$target.clientWidth :
      this.$target.scrollHeight - this.$target.clientHeight;
  }

  /** @readonly Track size value (px) */
  public get trackOffset() {
    return this.horizontal ? this.$scrollbarTrack.offsetWidth : this.$scrollbarTrack.offsetHeight;
  }

  /** @readonly Thumb size value (px) */
  public get thumbOffset() {
    return this.horizontal ? this.$scrollbarThumb.offsetWidth : this.$scrollbarThumb.offsetHeight;
  }

  /** @readonly Relative thumb size value (between 0.0 and 1.0) */
  public get thumbSize() {
    // behave as native scroll
    if (!this.$target || !this.$target.scrollWidth || !this.$target.scrollHeight) return 1;
    const areaSize = this.horizontal ? this.$target.clientWidth : this.$target.clientHeight;
    const scrollSize = this.horizontal ? this.$target.scrollWidth : this.$target.scrollHeight;
    return Math.min((areaSize + 1) / scrollSize, 1);
  }

  /** Relative position value (between 0.0 and 1.0) */
  public get position() {
    if (!this.$target) return 0;
    const scrollOffset = this.horizontal ? RTLUtils.normalizeScrollLeft(this.$target) : this.$target.scrollTop;
    return this.scrollableSize ? (scrollOffset / this.scrollableSize) : 0;
  }

  public set position(position) {
    this.scrollTargetTo(this.scrollableSize * this.normalizePosition(position));
    this.update();
  }

  /** Normalizes position value (between 0.0 and 1.0) */
  protected normalizePosition(position: number) {
    const relativePosition = Math.min(1, Math.max(0, position));
    if (this.$target && !RTLUtils.isRtl(this.$target)) return relativePosition;
    return RTLUtils.scrollType === 'negative' ? (relativePosition - 1) : (1 - relativePosition);
  }

  /** Scrolls target element to passed position */
  protected scrollTargetTo(pos: number) {
    if (!this.$target) return;
    this.$target.scrollTo({
      [this.horizontal ? 'left' : 'top']: pos,
      behavior: this.dragging ? 'auto' : 'smooth'
    });
  }

  /** Updates thumb size and position */
  public update() {
    this.$$fire('change:scroll', {bubbles: false});
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
  public updateMarkers() {
    const {position, thumbSize} =  this;
    this.toggleAttribute('at-start', thumbSize < 1 && position <= 0);
    this.toggleAttribute('at-end', thumbSize < 1 && position >= 1);
    this.toggleAttribute('inactive', thumbSize >= 1);
  }

  /** Refreshes scroll state and position */
  public refresh() {
    this.update();
    this.updateMarkers();
  }

  /** Returns position from MouseEvent coordinates */
  public toPosition(event: MouseEvent) {
    const clickCoordinates = EventUtils.normalizeCoordinates(event, this.$scrollbarTrack);
    const clickPosition = this.horizontal ? clickCoordinates.x : clickCoordinates.y;
    const freeTrackArea = this.trackOffset - this.thumbOffset; // size of free track px
    const clickPositionNoOffset = clickPosition - this.thumbOffset / 2;
    return Math.max(0, Math.min(1, clickPositionNoOffset / freeTrackArea));
  }

  // Event listeners
  /** `mousedown` event to track thumb drag start */
  @bind
  protected _onPointerDown(event: MouseEvent) {
    this._initialPosition = this.position;
    const point = EventUtils.normalizeTouchPoint(event);
    this._initialMousePosition = this.horizontal ? point.x : point.y;

    if (event.target === this.$scrollbarThumb) {
      this.toggleAttribute('dragging', true);
      this.$target?.style.setProperty('scroll-behavior', 'auto');
      // Attach drag listeners
      window.addEventListener('click', this._onBodyClick, {capture: true});
      EventUtils.isMouseEvent(event) && window.addEventListener('mousemove', this._onPointerMove);
      EventUtils.isTouchEvent(event) && window.addEventListener('touchmove', this._onPointerMove, {passive: false});
    } else {
      // Long scroll handler
      this._targetPosition = this.toPosition(event);
      this._onLongScrollTick(true);
    }
    EventUtils.isMouseEvent(event) && window.addEventListener('mouseup', this._onPointerUp);
    EventUtils.isTouchEvent(event) && window.addEventListener('touchend', this._onPointerUp, {passive: false});

    // Prevents default text selection, etc.
    event.preventDefault();
  }

  @bind
  protected _onLongScrollTick(first: boolean) {
    this._scrollTimer && window.clearTimeout(this._scrollTimer);

    const position = this.position;
    const allowedOffset = (first ? 1 : 1.5) * this.thumbSize;
    this.position = Math.min(position + allowedOffset, Math.max(position - allowedOffset, this._targetPosition));

    if (this.position === this._targetPosition || this.noLongScroll) return;
    this._scrollTimer = window.setTimeout(this._onLongScrollTick, 400);
  }

  /** Sets position on drug */
  protected _dragToCoordinate(mousePosition: number) {
    const positionChange = mousePosition - this._initialMousePosition;
    const scrollableAreaHeight = this.trackOffset - this.thumbOffset;
    const absChange = scrollableAreaHeight ? (positionChange / scrollableAreaHeight) : 0;
    this.position = this._initialPosition + absChange;

    this.updateMarkers();
  }
  protected _deferredDragToCoordinate = rafDecorator(this._dragToCoordinate);

  /** `mousemove` document handler for thumb drag event. Active only if drag action is active */
  @bind
  protected _onPointerMove(event: MouseEvent | TouchEvent) {
    if (!this.dragging) return;

    const point = EventUtils.normalizeTouchPoint(event);
    this._deferredDragToCoordinate(this.horizontal ? point.x : point.y); // Request position update

    // Prevents default text selection, etc.
    event.preventDefault();
    event.stopPropagation();
  }

  /** `mouseup` short-time document handler for drag end action */
  @bind
  protected _onPointerUp(event: MouseEvent | TouchEvent) {
    this._scrollTimer && window.clearTimeout(this._scrollTimer);
    this.toggleAttribute('dragging', false);
    this.$target?.style.removeProperty('scroll-behavior');

    // Unbind drag listeners
    if (EventUtils.isMouseEvent(event)) {
      window.removeEventListener('mousemove', this._onPointerMove);
      window.removeEventListener('mouseup', this._onPointerMove);
    }
    if (EventUtils.isTouchEvent(event)) {
      window.removeEventListener('touchmove', this._onPointerMove);
      window.removeEventListener('touchend', this._onPointerMove);
    }
  }

  /** Body `click` short-time handler to prevent clicks event on thumb drag. Handles capture phase */
  @bind
  protected _onBodyClick(event: MouseEvent) {
    event.stopImmediatePropagation();

    window.removeEventListener('click', this._onBodyClick, {capture: true});
  }

  /**
   * Handler for refresh events to update the scroll.
   * @param event - instance of 'resize' or 'scroll' or 'esl:refresh' event.
   */
  @bind
  protected _onRefresh(event: Event) {
    const target = event.target as HTMLElement;
    if (event.type === 'scroll' && this.dragging) return;
    if (event.type === 'esl:refresh' && !isRelativeNode(target.parentNode, this.$target)) return;
    this.deferredRefresh();
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

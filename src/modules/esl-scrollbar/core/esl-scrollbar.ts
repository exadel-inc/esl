/**
 * ESL Scrollbar
 * @version 1.0.0-alpha
 * @author Yuliya Adamskaya
 */
import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLBaseElement, attr, boolAttr} from '../../esl-base-element/core';
import {bind} from '../../esl-utils/decorators/bind';
import {ready} from '../../esl-utils/decorators/ready';
import {rafDecorator} from '../../esl-utils/async/raf';
import {EventUtils} from '../../esl-utils/dom/events';
import {TraversingUtils} from '../../esl-utils/dom/traversing';
import {TraversingQuery} from '../../esl-traversing-query/core';

@ExportNs('Scrollbar')
export class ESLScrollbar extends ESLBaseElement {
  public static is = 'esl-scrollbar';

  @boolAttr() public horizontal: boolean;

  @attr({defaultValue: '::parent'}) public target: string;
  @attr({defaultValue: 'scrollbar-thumb'}) public thumbClass: string;
  @attr({defaultValue: 'scrollbar-track'}) public trackClass: string;

  @boolAttr() protected dragging: boolean;
  @boolAttr({readonly: true}) public inactive: boolean;

  protected $scrollbarThumb: HTMLElement;
  protected $scrollbarTrack: HTMLElement;
  protected $scrollableContent: HTMLElement | null;

  protected _initialMousePosition: number;
  protected _initialPosition: number;

  protected deferredRefresh = rafDecorator(() => this.refresh());
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
  }

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
    if (!this.connected && oldVal === newVal) return;
    if (attrName === 'target') this.findTarget();
    if (attrName === 'horizontal') this.refresh();
  }

  protected findTarget() {
    this.targetElement = this.target ?
      TraversingQuery.first(this.target, this) as HTMLElement :
      null;
  }

  public get targetElement() {
    return this.$scrollableContent || null;
  }

  public set targetElement(content: HTMLElement | null) {
    this.unbindTargetEvents();
    this.$scrollableContent = content;
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
    this.addEventListener('click', this._onClick);
    this.$scrollbarThumb.addEventListener('mousedown', this._onMouseDown);
    window.addEventListener('esl:refresh', this._onRefresh);
  }

  protected bindTargetEvents() {
    if (!this.$scrollableContent) return;
    if (document.documentElement === this.$scrollableContent) {
      window.addEventListener('resize', this._onRefresh, {passive: true});
      window.addEventListener('scroll', this._onRefresh, {passive: true});
    } else {
      this._resizeObserver.observe(this.$scrollableContent);
      this._mutationObserver.observe(this.$scrollableContent, {childList: true});
      Array.from(this.$scrollableContent.children).forEach((el) => this._resizeObserver.observe(el));
      this.$scrollableContent.addEventListener('scroll', this._onRefresh, {passive: true});
    }
  }

  protected updateContentObserve(recs: MutationRecord[] = []) {
    if (!this.$scrollableContent) return;
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
    this.removeEventListener('click', this._onClick);
    this.$scrollbarThumb.removeEventListener('mousedown', this._onMouseDown);
    this.unbindTargetEvents();
    window.removeEventListener('esl:refresh', this._onRefresh);
  }

  protected unbindTargetEvents() {
    if (!this.$scrollableContent) return;
    if (document.documentElement === this.$scrollableContent) {
      window.removeEventListener('resize', this._onRefresh);
      window.removeEventListener('scroll', this._onRefresh);
    } else {
      this._resizeObserver.disconnect();
      this._mutationObserver.disconnect();
      this.$scrollableContent.removeEventListener('scroll', this._onRefresh);
    }
  }

  public get scrollableSize() {
    if (!this.targetElement) return 0;
    return this.horizontal ?
      this.targetElement.scrollWidth - this.targetElement.clientWidth :
      this.targetElement.scrollHeight - this.targetElement.clientHeight;
  }

  public get trackOffset() {
    return this.horizontal ? this.$scrollbarTrack.offsetWidth : this.$scrollbarTrack.offsetHeight;
  }

  public get thumbOffset() {
    return this.horizontal ? this.$scrollbarThumb.offsetWidth : this.$scrollbarThumb.offsetHeight;
  }

  public get thumbSize() {
    // behave as native scroll
    if (!this.targetElement || !this.targetElement.scrollWidth || !this.targetElement.scrollHeight) return 1;
    const areaSize = this.horizontal ? this.targetElement.clientWidth : this.targetElement.clientHeight;
    const scrollSize = this.horizontal ? this.targetElement.scrollWidth : this.targetElement.scrollHeight;
    return Math.min((areaSize + 1) / scrollSize, 1);
  }

  public get position() {
    if (!this.targetElement) return 0;
    const scrollOffset = this.horizontal ? this.targetElement.scrollLeft : this.targetElement.scrollTop;
    return this.scrollableSize ? (scrollOffset / this.scrollableSize) : 0;
  }

  public set position(position) {
    const normalizedPosition = Math.min(1, Math.max(0, position));
    this.scrollTargetTo(this.scrollableSize * normalizedPosition);
    this.update();
  }

  /**
   * Scroll target element to passed position
   */
  protected scrollTargetTo(pos: number) {
    if (!this.targetElement) return;
    this.targetElement.scrollTo({
      [this.horizontal ? 'left' : 'top']: pos,
      behavior: this.dragging ? 'auto' : 'smooth'
    });
  }

  /**
   * Update thumb size and position
   */
  public update() {
    if (!this.$scrollbarThumb || !this.$scrollbarTrack) return;
    const thumbSize = this.trackOffset * this.thumbSize;
    const thumbPosition = (this.trackOffset - thumbSize) * this.position;
    const style = {
      [this.horizontal ? 'left' : 'top']: `${thumbPosition}px`,
      [this.horizontal ? 'width' : 'height']: `${thumbSize}px`
    };
    Object.assign(this.$scrollbarThumb.style, style);
  }

  /**
   * Update auxiliary markers
   */
  public updateMarkers() {
    this.toggleAttribute('inactive', this.thumbSize >= 1);
  }

  /**
   * Refresh scroll state and position
   */
  public refresh() {
    this.update();
    this.updateMarkers();
  }

  // Event listeners
  /**
   * Mousedown event to track thumb drag start.
   */
  @bind
  protected _onMouseDown(event: MouseEvent) {
    this.dragging = true;
    this._initialPosition = this.position;
    this._initialMousePosition = this.horizontal ? event.clientX : event.clientY;

    // Attach drag listeners
    window.addEventListener('mousemove', this._onMouseMove);
    window.addEventListener('mouseup', this._onMouseUp);
    window.addEventListener('click', this._onBodyClick, {capture: true});

    // Prevents default text selection, etc.
    event.preventDefault();
  }

  /**
   * Set position on drug
   */
  protected _dragToCoordinate(mousePosition: number) {
    const positionChange = mousePosition - this._initialMousePosition;
    const scrollableAreaHeight = this.trackOffset - this.thumbOffset;
    const absChange = scrollableAreaHeight ? (positionChange / scrollableAreaHeight) : 0;
    this.position = this._initialPosition + absChange;
  }
  protected _deferredDragToCoordinate = rafDecorator(this._dragToCoordinate);

  /**
   * Mousemove document handler for thumb drag event. Active only if drag action is active.
   */
  @bind
  protected _onMouseMove(event: MouseEvent) {
    if (!this.dragging) return;

    // Request position update
    this._deferredDragToCoordinate(this.horizontal ? event.clientX : event.clientY);

    // Prevents default text selection, etc.
    event.preventDefault();
    event.stopPropagation();
  }

  /**
   * Mouse up short time document handler to handle drag end
   */
  @bind
  protected _onMouseUp() {
    this.dragging = false;

    // Unbind drag listeners
    window.removeEventListener('mousemove', this._onMouseMove);
    window.removeEventListener('mouseup', this._onMouseUp);
  }

  /**
   * Body click short time handler to prevent clicks event on thumb drag. Handles capture phase.
   */
  @bind
  protected _onBodyClick(event: MouseEvent) {
    event.stopImmediatePropagation();

    window.removeEventListener('click', this._onBodyClick, {capture: true});
  }

  /**
   * Handler for track clicks. Move scroll to selected position.
   */
  @bind
  protected _onClick(event: MouseEvent) {
    if (event.target !== this.$scrollbarTrack && event.target !== this) return;
    const clickCoordinates = EventUtils.normalizeCoordinates(event, this.$scrollbarTrack);
    const clickPosition = this.horizontal ? clickCoordinates.x : clickCoordinates.y;

    const freeTrackArea = this.trackOffset - this.thumbOffset; // px
    const clickPositionNoOffset = clickPosition - this.thumbOffset / 2;
    const newPosition = clickPositionNoOffset / freeTrackArea;  // abs % to track

    this.position = Math.min(this.position + this.thumbSize,
      Math.max(this.position - this.thumbSize, newPosition));
  }

  /**
   * Handler for refresh events to update the scroll.
   * @param event - instance of 'resize' or 'scroll' or 'esl:refresh' event.
   */
  @bind
  protected _onRefresh(event: Event) {
    const target = event.target as HTMLElement;
    if (event.type === 'scroll' && this.dragging) return;
    if (event.type === 'esl:refresh' && !TraversingUtils.isRelative(target.parentNode, this.targetElement)) return;
    this.deferredRefresh();
  }
}

export default ESLScrollbar;

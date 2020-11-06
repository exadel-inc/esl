/**
 * ESL Scrollbar
 * @version 1.2.0
 * @author Yuliya Adamskaya
 */
import {ExportNs} from '../../esl-utils/enviroment/export-ns';
import {ESLBaseElement, attr, boolAttr} from '../../esl-base-element/all';
import {rafDecorator} from '../../esl-utils/async/raf';
import {normalizeCoordinates} from '../../esl-utils/dom/events';
import {TraversingUtils} from '../../esl-utils/dom/traversing';
import {TraversingQuery} from '../../esl-traversing-query/core';

const observableTarget = (target: HTMLElement) => document.documentElement === target ? window : target;

@ExportNs('Scrollbar')
export class ESLScrollbar extends ESLBaseElement {
  public static is = 'esl-scrollbar';
  public static eventNs = 'esl:scrollbar';

  protected $scrollbarThumb: HTMLElement;
  protected $scrollbarTrack: HTMLElement;
  protected $scrollableContent: HTMLElement | null;

  protected _initialMousePosition: number;
  protected _initialPosition: number;

  @boolAttr() public horizontal: boolean;

  @attr({defaultValue: '::parent'}) public target: string;
  @attr({defaultValue: 'scrollbar-thumb'}) public thumbClass: string;
  @attr({defaultValue: 'scrollbar-track'}) public trackClass: string;

  @boolAttr() protected dragging: boolean;
  @boolAttr({readonly: true}) public inactive: boolean;

  static get observedAttributes() {
    return ['target'];
  }

  protected connectedCallback() {
    super.connectedCallback();

    this.findTarget();

    this.render();
    this.refresh();

    this.bindEvents();
  }

  protected disconnectedCallback() {
    this.unbindEvents();
  }

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
    if (!this.connected && oldVal === newVal) return;
    if (attrName === 'target') {
      this.findTarget();
    }
  }

  protected findTarget() {
    if (!this.target) return;
    this.targetElement = TraversingQuery.first(this.target, this) as HTMLElement;
  }

  public get targetElement() {
    return this.$scrollableContent || null;
  }

  public set targetElement(content: HTMLElement | null) {
    if (this.$scrollableContent) {
      observableTarget(this.$scrollableContent).removeEventListener('scroll', this.onScroll);
    }
    this.$scrollableContent = content;
    if (this.$scrollableContent) {
      observableTarget(this.$scrollableContent).addEventListener('scroll', this.onScroll, {passive: true});
    }
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
    this.addEventListener('click', this.onClick);
    this.$scrollbarThumb.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('resize', this.onResize, {passive: true});
    window.addEventListener('esl:refresh', this.onRefresh);
  }

  protected unbindEvents() {
    this.removeEventListener('click', this.onClick);
    this.$scrollbarThumb.removeEventListener('mousedown', this.onMouseDown);

    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('esl:refresh', this.onRefresh);

    this.targetElement && this.targetElement.removeEventListener('scroll', this.onScroll);
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
    return this.horizontal ?
      this.targetElement.clientWidth / this.targetElement.scrollWidth :
      this.targetElement.clientHeight / this.targetElement.scrollHeight;
  }

  public get position() {
    if (!this.targetElement) return 0;
    const scrollOffset = this.horizontal ? this.targetElement.scrollLeft : this.targetElement.scrollTop;
    return this.scrollableSize ? (scrollOffset / this.scrollableSize) : 0;
  }

  public set position(position) {
    if (!this.targetElement) return;
    const normalizedPosition = Math.min(1, Math.max(0, position));
    const targetPosition = this.scrollableSize * normalizedPosition;
    if (this.dragging) { // Mousemove event
      this.targetElement[this.horizontal ? 'scrollLeft' : 'scrollTop'] = targetPosition;
    } else { // Click event
      this.targetElement.scrollTo({
        [this.horizontal ? 'left' : 'top']: targetPosition,
        behavior: 'smooth',
      });
    }
    this.update();
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
    this.toggleAttribute('inactive', this.thumbSize === 1);
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
  protected onMouseDown = (event: MouseEvent) => {
    this.dragging = true;
    this._initialPosition = this.position;
    this._initialMousePosition = this.horizontal ? event.clientX : event.clientY;

    // Attach drag listeners
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('click', this.onBodyClick, {capture: true});

    // Prevents default text selection, etc.
    event.preventDefault();
  };

  /**
   * Mousemove document handler for thumb drag event. Active only if drag action is active.
   */
  protected onMouseMove = rafDecorator((event: MouseEvent) => {
    if (!this.dragging) return;

    const positionChange = (this.horizontal ? event.clientX : event.clientY) - this._initialMousePosition;
    const scrollableAreaHeight = this.trackOffset - this.thumbOffset;
    const absChange = scrollableAreaHeight ? (positionChange / scrollableAreaHeight) : 0;
    this.position = this._initialPosition + absChange;

    // Prevents default text selection, etc.
    event.preventDefault();
    event.stopPropagation();
  });

  /**
   * Mouse up short time document handler to handle drag end
   */
  protected onMouseUp = () => {
    this.dragging = false;

    // Unbind drag listeners
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
  };

  /**
   * Body click short time handler to prevent clicks event on thumb drag. Handles capture phase.
   */
  protected onBodyClick = (event: MouseEvent) => {
    event.stopImmediatePropagation();

    window.removeEventListener('click', this.onBodyClick, {capture: true});
  };

  /**
   * Handler for track clicks. Move scroll to selected position.
   */
  protected onClick = (event: MouseEvent) => {
    if (event.target !== this.$scrollbarTrack) return;
    const clickCoordinates = normalizeCoordinates(event, this.$scrollbarTrack);
    const clickPosition = this.horizontal ? clickCoordinates.x : clickCoordinates.y;

    const freeTrackArea = this.trackOffset - this.thumbOffset; // px
    const clickPositionNoOffset = clickPosition - this.thumbOffset / 2;
    const newPosition = clickPositionNoOffset / freeTrackArea;  // abs % to track

    this.position = Math.min(this.position + this.thumbSize,
      Math.max(this.position - this.thumbSize, newPosition));
  };

  /**
   * Handler to redraw scroll on element native scroll events
   */
  protected onScroll = rafDecorator(() => {
    if (!this.dragging) this.update();
  });

  /**
   * Handler for document resize events to redraw scroll.
   */
  protected onResize = rafDecorator(() => this.refresh());

  /**
   * Handler for document refresh events to update the scroll.
   */
  protected onRefresh = (event: Event) => {
    const target = event.target as HTMLElement;
    if (TraversingUtils.isRelative(target.parentNode, this.targetElement)) {
      this.refresh();
    }
  };
}

export default ESLScrollbar;

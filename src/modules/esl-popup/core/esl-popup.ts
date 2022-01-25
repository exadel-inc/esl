import {range} from '../../esl-utils/misc/array';
import {ExportNs} from '../../esl-utils/environment/export-ns';
import {attr, boolAttr, jsonAttr} from '../../esl-base-element/core';
import {bind} from '../../esl-utils/decorators/bind';
import {memoize} from '../../esl-utils/decorators/memoize';
import {ready} from '../../esl-utils/decorators/ready';
import {prop} from '../../esl-utils/decorators/prop';
import {TraversingQuery} from '../../esl-traversing-query/core';
import {afterNextRender, rafDecorator} from '../../esl-utils/async/raf';
import {ESLToggleable} from '../../esl-toggleable/core';
import {Rect} from '../../esl-utils/dom/rect';
import {RTLUtils} from '../../esl-utils/dom/rtl';
import {getListScrollParents} from '../../esl-utils/dom/scroll';
import {getWindowRect} from '../../esl-utils/dom/window';
import {parseNumber} from '../../esl-utils/misc/format';
import {calcPopupPosition, isMajorAxisHorizontal} from './esl-popup-position';

import type {ToggleableActionParams} from '../../esl-toggleable/core';
import type {PositionType, IntersectionRatioRect} from './esl-popup-position';

const INTERSECTION_LIMIT_FOR_ADJACENT_AXIS = 0.7;
const DEFAULT_OFFSET_ARROW = 50;
const scrollOptions = {passive: true} as EventListenerOptions;

const parsePercent = (value: string | number, nanValue: number = 0): number => {
  const rawValue = parseNumber(value, nanValue);
  return Math.max(0, Math.min(rawValue !== undefined ? rawValue : nanValue, 100));
};

export interface PopupActionParams extends ToggleableActionParams {
  /** popup position relative to trigger */
  position?: PositionType;
  /** popup behavior if it does not fit in the window */
  behavior?: string;
  /** Disable hiding the popup depending on the visibility of the activator */
  disableActivatorObservation?: boolean;
  /** Margins on the edges of the arrow. */
  marginArrow?: string;
  /** offset of the arrow as a percentage of the popup edge (0% - at the left edge, 100% - at the right edge, for RTL it is vice versa) */
  offsetArrow?: string;
  /** offset in pixels from trigger element */
  offsetTrigger?: number;
  /** offset in pixels from the edges of the container (or window if the container is not defined) */
  offsetContainer?: number;
  /** Target to container element to define bounds of popups visibility */
  container?: string;
}

export interface ActivatorObserver {
  unsubscribers?: (() => void)[];
  observer?: IntersectionObserver;
}

@ExportNs('Popup')
export class ESLPopup extends ESLToggleable {
  public static is = 'esl-popup';

  public $arrow: HTMLElement | null;

  protected _offsetTrigger: number;
  protected _offsetContainer: number;
  protected _deferredUpdatePosition = rafDecorator(() => this._updatePosition());
  protected _activatorObserver: ActivatorObserver;
  protected _intersectionRatio: IntersectionRatioRect = {};
  protected _updateLoopID: number;

  /**
   * Popup position relative to the trigger.
   * Currently supported: 'top', 'bottom', 'left', 'right' position types ('top' by default)
   */
  @attr({defaultValue: 'top'}) public position: PositionType;

  /** Popup behavior if it does not fit in the window ('fit' by default) */
  @attr({defaultValue: 'fit'}) public behavior: string;

  /** Disable hiding the popup depending on the visibility of the activator */
  @boolAttr() public disableActivatorObservation: boolean;
  /**
   * Margins on the edges of the arrow.
   * This is the value in pixels that will be between the edge of the popup and
   * the arrow at extreme positions of the arrow (when offsetArrow is set to 0 or 100)
   */
  @attr({defaultValue: '5'}) public marginArrow: string;

  /**
   * Offset of the arrow as a percentage of the popup edge
   * (0% - at the left edge,
   *  100% - at the right edge,
   *  for RTL it is vice versa) */
  @attr({defaultValue: `${DEFAULT_OFFSET_ARROW}`}) public offsetArrow: string;

  /** Target to container element {@link TraversingQuery} to define bounds of popups visibility (window by default) */
  @attr() public container: string;

  /** Default params to merge into passed action params */
  @jsonAttr<PopupActionParams>({defaultValue: {
    offsetTrigger: 3,
    offsetContainer: 15
  }})
  public defaultParams: PopupActionParams;

  @prop() public closeOnEsc = true;
  @prop() public closeOnOutsideAction = true;

  /** Container element that define bounds of popups visibility */
  @memoize()
  protected get $container(): HTMLElement | null {
    return this.container ? TraversingQuery.first(this.container, this) as HTMLElement : null;
  }

  @ready
  public connectedCallback(): void {
    super.connectedCallback();
    this.$arrow = this.querySelector('span.esl-popup-arrow');
  }

  /** Checks that the position along the horizontal axis */
  @memoize()
  protected get _isMajorAxisHorizontal(): boolean {
    return isMajorAxisHorizontal(this.position);
  }

  /** Checks that the position along the vertical axis */
  @memoize()
  protected get _isMajorAxisVertical(): boolean {
    return !isMajorAxisHorizontal(this.position);
  }

  /** Get offsets arrow ratio */
  @memoize()
  protected get _offsetArrowRatio(): number {
    const ratio = parsePercent(this.offsetArrow, DEFAULT_OFFSET_ARROW) / 100;
    return RTLUtils.isRtl(this) ? 1 - ratio : ratio;
  }

  /**
   * Actions to execute on show popup.
   * Inner state and 'open' attribute are not affected and updated before `onShow` execution.
   * Adds CSS classes, update a11y and fire esl:refresh event by default.
   */
  public onShow(params: PopupActionParams): void {
    super.onShow(params);

    if (params.position) {
      this.position = params.position;
    }
    if (params.behavior) {
      this.behavior = params.behavior;
    }
    if (params.disableActivatorObservation) {
      this.disableActivatorObservation = params.disableActivatorObservation;
    }
    if (params.marginArrow) {
      this.marginArrow = params.marginArrow;
    }
    if (params.offsetArrow) {
      this.offsetArrow = params.offsetArrow;
    }
    if (params.container) {
      this.container = params.container;
    }
    this._offsetTrigger = params.offsetTrigger || 0;
    this._offsetContainer = params.offsetContainer || 0;

    this.style.visibility = 'hidden'; // eliminates the blinking of the popup at the previous position

    afterNextRender(() => this.afterOnShow()); // running as a separate task solves the problem with incorrect positioning on the first showing
  }

  /**
   * Actions to execute on hide popup.
   * Inner state and 'open' attribute are not affected and updated before `onShow` execution.
   * Removes CSS classes and updates a11y by default.
   */
  public onHide(params: PopupActionParams): void {
    this.beforeOnHide();
    super.onHide(params);

    this._stopUpdateLoop();
    this.activator && this._removeActivatorObserver(this.activator);

    // clear all memoize data
    memoize.clear(this, '_isMajorAxisHorizontal');
    memoize.clear(this, '_isMajorAxisVertical');
    memoize.clear(this, '_offsetArrowRatio');
    memoize.clear(this, '$container');
  }

  /**
   * Actions to execute after showing of popup.
   */
  protected afterOnShow(): void {
    this._updatePosition();
    this.style.visibility = 'visible';
    this.activator && this._addActivatorObserver(this.activator);
    this._startUpdateLoop();
  }

  /**
   * Actions to execute before hiding of popup.
   */
  protected beforeOnHide(): void {}

  /**
   * Checks activator intersection for adjacent axis.
   * Hides the popup if the intersection ratio exceeds the limit.
   */
  protected _checkIntersectionForAdjacentAxis(isAdjacentAxis: boolean, intersectionRatio: number): void {
    if (isAdjacentAxis && intersectionRatio < INTERSECTION_LIMIT_FOR_ADJACENT_AXIS) {
      this.hide();
    }
  }

  /** Actions to execute on activator intersection event. */
  @bind
  protected onActivatorIntersection(entries: IntersectionObserverEntry[], observer: IntersectionObserver): void {
    const entry = entries[0];
    this._intersectionRatio = {};
    if (!entry.isIntersecting) {
      this.hide();
      return;
    }

    if (entry.intersectionRect.y !== entry.boundingClientRect.y) {
      this._intersectionRatio.top = entry.intersectionRect.height / entry.boundingClientRect.height;
      this._checkIntersectionForAdjacentAxis(this._isMajorAxisHorizontal, this._intersectionRatio.top);
    }
    if (entry.intersectionRect.bottom !== entry.boundingClientRect.bottom) {
      this._intersectionRatio.bottom = entry.intersectionRect.height / entry.boundingClientRect.height;
      this._checkIntersectionForAdjacentAxis(this._isMajorAxisHorizontal, this._intersectionRatio.bottom);
    }
    if (entry.intersectionRect.x !== entry.boundingClientRect.x) {
      this._intersectionRatio.left = entry.intersectionRect.width / entry.boundingClientRect.width;
      this._checkIntersectionForAdjacentAxis(this._isMajorAxisVertical, this._intersectionRatio.left);
    }
    if (entry.intersectionRect.right !== entry.boundingClientRect.right) {
      this._intersectionRatio.right = entry.intersectionRect.width / entry.boundingClientRect.width;
      this._checkIntersectionForAdjacentAxis(this._isMajorAxisVertical, this._intersectionRatio.right);
    }
  }

  /** Actions to execute on activator scroll event. */
  @bind
  protected onActivatorScroll(e: Event): void {
    if (this._updateLoopID) return;
    this._updatePosition();
  }

  /** Creates listeners and observers to observe activator after showing popup */
  protected _addActivatorObserver(target: HTMLElement): void {
    const scrollParents = getListScrollParents(target);

    this._activatorObserver = {
      unsubscribers: scrollParents.map(($root) => {
        $root.addEventListener('scroll', this.onActivatorScroll, scrollOptions);
        return (): void => {
          $root && $root.removeEventListener('scroll', this.onActivatorScroll, scrollOptions);
        };
      })
    };

    if (!this.disableActivatorObservation) {
      const options = {
        rootMargin: '0px',
        threshold: range(9, (x) => x / 8)
      } as IntersectionObserverInit;

      const observer = new IntersectionObserver(this.onActivatorIntersection, options);
      observer.observe(target);

      this._activatorObserver.observer = observer;
    }

    window.addEventListener('resize', this._deferredUpdatePosition);
    window.addEventListener('scroll', this.onActivatorScroll, scrollOptions);
    document.body.addEventListener('transitionstart', this._startUpdateLoop);
  }

  /** Removes activator listeners and observers after hiding popup */
  protected _removeActivatorObserver(target: HTMLElement): void {
    window.removeEventListener('resize', this._deferredUpdatePosition);
    window.removeEventListener('scroll', this.onActivatorScroll, scrollOptions);
    this._activatorObserver.observer?.disconnect();
    this._activatorObserver.observer = undefined;
    this._activatorObserver.unsubscribers?.forEach((cb) => cb());
    this._activatorObserver.unsubscribers = [];

    document.body.removeEventListener('transitionstart', this._startUpdateLoop);
  }

  /**
   * Starts loop for update position of popup.
   * The loop ends when the position and size of the activator have not changed
   * for the last 2 frames of the animation.
   */
  @bind
  protected _startUpdateLoop(): void {
    if (this._updateLoopID) return;

    let same = 0;
    let lastRect = new Rect();
    const updateLoop = (): void => {
      if (!this.activator) {
        this._stopUpdateLoop();
        return;
      }

      const newRect = Rect.from(this.activator.getBoundingClientRect());
      if (!Rect.isEqual(lastRect, newRect)) {
        same = 0;
        lastRect = newRect;
      }

      if (same++ > 2) {
        this._stopUpdateLoop();
        return;
      }
      this._updatePosition();
      this._updateLoopID = requestAnimationFrame(updateLoop);
    };

    this._updateLoopID = requestAnimationFrame(updateLoop);
  }

  /**
   * Stops loop for update position of popup.
   * Also cancels the animation frame request.
   */
  @bind
  protected _stopUpdateLoop(): void {
    if (!this._updateLoopID) return;
    cancelAnimationFrame(this._updateLoopID);
    this._updateLoopID = 0;
  }

  /** Updates position of popup and its arrow */
  protected _updatePosition(): void {
    if (!this.activator) return;

    const triggerRect = this.activator.getBoundingClientRect();
    const popupRect = this.getBoundingClientRect();
    const arrowRect = this.$arrow ? this.$arrow.getBoundingClientRect() : new Rect();
    const trigger = new Rect(triggerRect.left, triggerRect.top + window.pageYOffset, triggerRect.width, triggerRect.height);
    const innerMargin = this._offsetTrigger + arrowRect.width / 2;
    const containerRect = this.$container ? Rect.from(this.$container.getBoundingClientRect()) : getWindowRect();

    const config = {
      position: this.position,
      behavior: this.behavior,
      marginArrow: +this.marginArrow,
      offsetArrowRatio: this._offsetArrowRatio,
      intersectionRatio: this._intersectionRatio,
      arrow: arrowRect,
      element: popupRect,
      trigger,
      inner: Rect.from(trigger).grow(innerMargin),
      outer: containerRect.shrink(this._offsetContainer)
    };

    const {placedAt, popup, arrow} = calcPopupPosition(config);

    this.setAttribute('placed-at', placedAt);
    // set popup position
    this.style.left = `${popup.x}px`;
    this.style.top = `${popup.y}px`;
    // set arrow position
    if (this.$arrow) {
      this.$arrow.style.left = this._isMajorAxisVertical ? `${arrow.x}px` : '';
      this.$arrow.style.top = this._isMajorAxisHorizontal ? `${arrow.y}px` : '';
    }
  }
}

declare global {
  export interface ESLLibrary {
    Popup: typeof ESLPopup;
  }
  export interface HTMLElementTagNameMap {
    'esl-popup': ESLPopup;
  }
}

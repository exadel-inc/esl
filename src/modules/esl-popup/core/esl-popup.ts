import {range} from '../../esl-utils/misc/array';
import {ExportNs} from '../../esl-utils/environment/export-ns';
import {attr, boolAttr, jsonAttr} from '../../esl-base-element/core';
import {bind} from '../../esl-utils/decorators/bind';
import {ready} from '../../esl-utils/decorators/ready';
import {prop} from '../../esl-utils/decorators/prop';
import {rafDecorator} from '../../esl-utils/async/raf';
import {ESLToggleable} from '../../esl-toggleable/core';
import {Rect} from '../../esl-utils/dom/rect';
import {RTLUtils} from '../../esl-utils/dom/rtl';
import {getListScrollParents} from '../../esl-utils/dom/scroll';
import {getWindowRect} from '../../esl-utils/dom/window';
import {parseNumber} from '../../esl-utils/misc/format';
import {calcPopupPosition} from './esl-popup-position';

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
  /** offset in pixels from the edges of the window */
  offsetWindow?: number;
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
  protected _offsetWindow: number;
  protected _deferredUpdatePosition = rafDecorator(() => this._updatePosition());
  protected _activatorObserver: ActivatorObserver;
  protected _intersectionRatio: IntersectionRatioRect = {};
  protected _updateLoopID: number;

  /**
   * Popup position relative to the trigger.
   * Currently supported: 'top', 'bottom', 'left', 'right' position types ('top' by default)
   */
  @attr({defaultValue: 'top'}) public position: PositionType;

  /** Disable hiding the popup depending on the visibility of the activator */
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

  /** Default params to merge into passed action params */
  @jsonAttr<PopupActionParams>({defaultValue: {
    offsetTrigger: 3,
    offsetWindow: 15
  }})
  public defaultParams: PopupActionParams;

  @prop() public closeOnEsc = true;
  @prop() public closeOnOutsideAction = true;

  @ready
  public connectedCallback() {
    super.connectedCallback();
    this.$arrow = this.querySelector('span.esl-popup-arrow');
  }

  /** Is position along horizontal axis? */
  protected get _isPositioningAlongHorizontal() {
    return ['left', 'right'].includes(this.position);
  }

  /** Is position along vertical axis? */
  protected get _isPositioningAlongVertical() {
    return ['top', 'bottom'].includes(this.position);
  }

  /** Get offsets arrow ratio */
  protected get _offsetArrowRatio(): number {
    const ratio = parsePercent(this.offsetArrow, DEFAULT_OFFSET_ARROW) / 100;
    return RTLUtils.isRtl(this) ? 1 - ratio : ratio;
  }

  /**
   * Actions to execute on show popup.
   * Inner state and 'open' attribute are not affected and updated before `onShow` execution.
   * Adds CSS classes, update a11y and fire esl:refresh event by default.
   */
  public onShow(params: PopupActionParams) {
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
    this._offsetTrigger = params.offsetTrigger || 0;
    this._offsetWindow = params.offsetWindow || 0;

    this.style.visibility = 'hidden'; // eliminates the blinking of the popup at the previous position
    setTimeout(() => {
      // running as a separate task solves the problem with incorrect positioning on the first showing
      this._updatePosition();
      this.style.visibility = 'visible';
      this.activator && this._addActivatorObserver(this.activator);
      this._startUpdateLoop();
    });
  }

  /**
   * Actions to execute on hide popup.
   * Inner state and 'open' attribute are not affected and updated before `onShow` execution.
   * Removes CSS classes and update a11y by default.
   */
  public onHide(params: PopupActionParams) {
    super.onHide(params);

    this._stopUpdateLoop();
    this.activator && this._removeActivatorObserver(this.activator);
  }

  /**
   * Checks activator intersection for adjacent axis.
   * Hides the popup if the intersection ratio exceeds the limit.
   */
  protected _checkIntersectionForAdjacentAxis(isAdjacentAxis: boolean, intersectionRatio: number) {
    if (isAdjacentAxis && intersectionRatio < INTERSECTION_LIMIT_FOR_ADJACENT_AXIS) {
      this.hide();
    }
  }

  /** Actions to execute on activator intersection event. */
  @bind
  protected onActivatorIntersection(entries: IntersectionObserverEntry[], observer: IntersectionObserver) {
    const entry = entries[0];
    this._intersectionRatio = {};
    if (!entry.isIntersecting) {
      this.hide();
      return;
    }

    if (entry.intersectionRect.y !== entry.boundingClientRect.y) {
      this._intersectionRatio.top = entry.intersectionRect.height / entry.boundingClientRect.height;
      this._checkIntersectionForAdjacentAxis(this._isPositioningAlongHorizontal, this._intersectionRatio.top);
    }
    if (entry.intersectionRect.bottom !== entry.boundingClientRect.bottom) {
      this._intersectionRatio.bottom = entry.intersectionRect.height / entry.boundingClientRect.height;
      this._checkIntersectionForAdjacentAxis(this._isPositioningAlongHorizontal, this._intersectionRatio.bottom);
    }
    if (entry.intersectionRect.x !== entry.boundingClientRect.x) {
      this._intersectionRatio.left = entry.intersectionRect.width / entry.boundingClientRect.width;
      this._checkIntersectionForAdjacentAxis(this._isPositioningAlongVertical, this._intersectionRatio.left);
    }
    if (entry.intersectionRect.right !== entry.boundingClientRect.right) {
      this._intersectionRatio.right = entry.intersectionRect.width / entry.boundingClientRect.width;
      this._checkIntersectionForAdjacentAxis(this._isPositioningAlongVertical, this._intersectionRatio.right);
    }
  }

  /** Actions to execute on activator scroll event. */
  @bind
  protected onActivatorScroll(e: Event) {
    if (this._updateLoopID) return;
    this._updatePosition();
  }

  /** Creates listeners and observers to observe activator after showing popup */
  protected _addActivatorObserver(target: HTMLElement) {
    const scrollParents = getListScrollParents(target);

    this._activatorObserver = {
      unsubscribers: scrollParents.map(($root) => {
        $root.addEventListener('scroll', this.onActivatorScroll, scrollOptions);
        return () => {
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
  protected _removeActivatorObserver(target: HTMLElement) {
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
  protected _startUpdateLoop() {
    if (this._updateLoopID) return;

    let same = 0;
    let lastRect = new Rect();
    const updateLoop = () => {
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
  protected _stopUpdateLoop() {
    if (!this._updateLoopID) return;
    cancelAnimationFrame(this._updateLoopID);
    this._updateLoopID = 0;
  }

  /** Updates position of popup and its arrow */
  protected _updatePosition() {
    if (!this.activator) return;

    const triggerRect = this.activator.getBoundingClientRect();
    const popupRect = this.getBoundingClientRect();
    const arrowRect = this.$arrow ? this.$arrow.getBoundingClientRect() : new Rect();
    const trigger = new Rect(triggerRect.left, triggerRect.top + window.pageYOffset, triggerRect.width, triggerRect.height);
    const innerMargin = this._offsetTrigger + arrowRect.width / 2;

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
      outer: getWindowRect().shrink(this._offsetWindow)
    };

    const {placedAt, popup, arrow} = calcPopupPosition(config);

    this.setAttribute('placed-at', placedAt);
    // set popup position
    this.style.left = `${popup.x}px`;
    this.style.top = `${popup.y}px`;
    // set arrow position
    if (this.$arrow) {
      this.$arrow.style.left = ['top', 'bottom'].includes(placedAt) ? `${arrow.x}px` : '';
      this.$arrow.style.top = ['left', 'right'].includes(placedAt) ? `${arrow.y}px` : '';
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

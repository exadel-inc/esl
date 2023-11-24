import {range} from '../../esl-utils/misc/array';
import {ExportNs} from '../../esl-utils/environment/export-ns';
import {bind, memoize, ready, attr, boolAttr, jsonAttr, listen, decorate} from '../../esl-utils/decorators';
import {ESLTraversingQuery} from '../../esl-traversing-query/core';
import {afterNextRender, rafDecorator} from '../../esl-utils/async/raf';
import {ESLToggleable} from '../../esl-toggleable/core';
import {Rect} from '../../esl-utils/dom/rect';
import {isRTL} from '../../esl-utils/dom/rtl';
import {getListScrollParents} from '../../esl-utils/dom/scroll';
import {getWindowRect} from '../../esl-utils/dom/window';
import {parseBoolean, parseNumber, toBooleanAttribute} from '../../esl-utils/misc/format';
import {copy} from '../../esl-utils/misc/object';
import {ESLIntersectionTarget, ESLIntersectionEvent} from '../../esl-event-listener/core/targets/intersection.target';
import {calcPopupPosition, isMajorAxisHorizontal} from './esl-popup-position';
import {ESLPopupPlaceholder} from './esl-popup-placeholder';

import type {ESLToggleableActionParams} from '../../esl-toggleable/core';
import type {PositionType, IntersectionRatioRect} from './esl-popup-position';

const INTERSECTION_LIMIT_FOR_ADJACENT_AXIS = 0.7;
const DEFAULT_OFFSET_ARROW = 50;

const parsePercent = (value: string | number, nanValue: number = 0): number => {
  const rawValue = parseNumber(value, nanValue);
  return Math.max(0, Math.min(rawValue !== undefined ? rawValue : nanValue, 100));
};

export interface PopupActionParams extends ESLToggleableActionParams {
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
  /**
   * offset in pixels from the edges of the container (or window if the container is not defined)
   *  value as a number for equals x and y offsets
   *  value as an array for different x and y offsets
   */
  offsetContainer?: number | [number, number];
  /** margin around the element that is used as the viewport for checking the visibility of the popup activator */
  intersectionMargin?: string;
  /** Target to container element to define bounds of popups visibility */
  container?: string;
  /** Container element that defines bounds of popups visibility (is not taken into account if the container attr is set on popup) */
  containerEl?: HTMLElement;
}

@ExportNs('Popup')
export class ESLPopup extends ESLToggleable {
  public static override is = 'esl-popup';

  /** Default params to pass into the popup on show/hide actions */
  public static override DEFAULT_PARAMS: PopupActionParams = {
    offsetTrigger: 3,
    offsetContainer: 15,
    intersectionMargin: '0px'
  };

  /** Classname of popups arrow element */
  @attr({defaultValue: 'esl-popup-arrow'}) public arrowClass: string;

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

  /** Target to container element {@link ESLTraversingQuery} to define bounds of popups visibility (window by default) */
  @attr() public container: string;

  /** Default show/hide params for current ESLAlert instance */
  @jsonAttr<PopupActionParams>()
  public override defaultParams: PopupActionParams;

  @attr({parser: parseBoolean, serializer: toBooleanAttribute, defaultValue: true})
  public override closeOnEsc: boolean;
  @attr({parser: parseBoolean, serializer: toBooleanAttribute, defaultValue: true})
  public override closeOnOutsideAction: boolean;

  public $placeholder: ESLPopupPlaceholder | null;

  protected _containerEl?: HTMLElement;
  protected _offsetTrigger: number;
  protected _offsetContainer: number | [number, number];
  protected _intersectionMargin: string;
  protected _intersectionRatio: IntersectionRatioRect = {};
  protected _updateLoopID: number;

  /** Arrow element */
  @memoize()
  public get $arrow(): HTMLElement | null {
    return this.querySelector(`.${this.arrowClass}`) || this.appendArrow();
  }

  /** Container element that define bounds of popups visibility */
  @memoize()
  protected get $container(): HTMLElement | undefined {
    return this.container ? ESLTraversingQuery.first(this.container, this) as HTMLElement : this._containerEl;
  }

  /** Get the size and position of the container */
  protected get containerRect(): Rect {
    const {$container} = this;
    if (!$container) return getWindowRect();
    const containerRect = $container.getBoundingClientRect();
    return new Rect(containerRect.left, containerRect.top + window.pageYOffset, containerRect.width, containerRect.height);
  }

  @ready
  protected override connectedCallback(): void {
    super.connectedCallback();
    this.moveToBody();
  }

  protected override disconnectedCallback(): void {
    super.disconnectedCallback();
    memoize.clear(this, '$arrow');
  }

  /** Get offsets arrow ratio */
  @memoize()
  protected get _offsetArrowRatio(): number {
    const ratio = parsePercent(this.offsetArrow, DEFAULT_OFFSET_ARROW) / 100;
    return isRTL(this) ? 1 - ratio : ratio;
  }

  /** Moves popup into document.body */
  protected moveToBody(): void {
    const {parentNode, $placeholder} = this;
    if (!parentNode || parentNode === document.body) return;

    // to be safe and prevent leaks
    $placeholder && $placeholder.parentNode?.removeChild($placeholder);

    // replace this with placeholder element
    this.$placeholder = ESLPopupPlaceholder.from(this);
    parentNode.replaceChild(this.$placeholder, this);
    document.body.appendChild(this);
  }

  /** Appends arrow to Popup */
  public appendArrow(): HTMLElement {
    const $arrow = document.createElement('span');
    $arrow.className = this.arrowClass;
    this.appendChild($arrow);
    memoize.clear(this, '$arrow');
    return $arrow;
  }

  /** Runs additional actions on show popup request */
  protected override onBeforeShow(params: ESLToggleableActionParams): boolean | void {
    this.activator = params.activator;
    if (this.open) {
      this.afterOnHide();
      this.afterOnShow();
    }

    if (!params.force && this.open) return false;
  }

  /**
   * Actions to execute on show popup.
   * Inner state and 'open' attribute are not affected and updated before `onShow` execution.
   * Adds CSS classes, update a11y and fire esl:refresh event by default.
   */
  protected override onShow(params: PopupActionParams): void {
    super.onShow(params);

    // TODO: change flow to use merged params unless attribute state is used in CSS
    Object.assign(this, copy({
      position: params.position,
      behavior: params.behavior,
      container: params.container,
      marginArrow: params.marginArrow,
      offsetArrow: params.offsetArrow,
      disableActivatorObservation: params.disableActivatorObservation
    }, (key, val): boolean => !!val));

    this._containerEl = params.containerEl;
    this._offsetTrigger = params.offsetTrigger || 0;
    this._offsetContainer = params.offsetContainer || 0;
    this._intersectionMargin = params.intersectionMargin || '0px';

    this.style.visibility = 'hidden'; // eliminates the blinking of the popup at the previous position

    afterNextRender(() => this.afterOnShow()); // running as a separate task solves the problem with incorrect positioning on the first showing
  }

  /**
   * Actions to execute on hide popup.
   * Inner state and 'open' attribute are not affected and updated before `onShow` execution.
   * Removes CSS classes and updates a11y by default.
   */
  protected override onHide(params: PopupActionParams): void {
    this.beforeOnHide();
    super.onHide(params);
    this.afterOnHide();
  }

  /**
   * Actions to execute after showing of popup.
   */
  protected afterOnShow(): void {
    this._updatePosition();
    this.style.visibility = 'visible';

    this.$$on(this._onActivatorScroll);
    this.$$on(this._onActivatorIntersection);
    this.$$on(this._onTransitionStart);
    this.$$on(this._onResize);

    this._startUpdateLoop();
  }

  /**
   * Actions to execute before hiding of popup.
   */
  protected beforeOnHide(): void {}

  /**
   * Actions to execute after hiding of popup.
   */
  protected afterOnHide(): void {
    this._stopUpdateLoop();

    this.$$off(this._onActivatorScroll);
    this.$$off(this._onActivatorIntersection);
    this.$$off(this._onTransitionStart);
    this.$$off(this._onResize);

    memoize.clear(this, ['_offsetArrowRatio', '$container']);
  }

  protected get scrollTargets(): EventTarget[] {
    if (this.activator) {
      return (getListScrollParents(this.activator) as EventTarget[]).concat([window]);
    }
    return [window];
  }

  protected get intersectionOptions(): IntersectionObserverInit {
    return {
      rootMargin: this._intersectionMargin,
      threshold: range(9, (x) => x / 8)
    };
  }

  /** Actions to execute on activator intersection event. */
  @listen({
    auto: false,
    event: ESLIntersectionEvent.type,
    target: ($popup: ESLPopup) => $popup.activator ? ESLIntersectionTarget.for($popup.activator, $popup.intersectionOptions) : [],
    condition: ($popup: ESLPopup) => !$popup.disableActivatorObservation
  })
  protected _onActivatorIntersection(event: ESLIntersectionEvent): void {
    this._intersectionRatio = {};
    if (!event.isIntersecting) {
      this.hide();
      return;
    }

    const isHorizontal = isMajorAxisHorizontal(this.position);
    const checkIntersection = (isMajorAxis: boolean, intersectionRatio: number): void => {
      if (isMajorAxis && intersectionRatio < INTERSECTION_LIMIT_FOR_ADJACENT_AXIS) this.hide();
    };
    if (event.intersectionRect.y !== event.boundingClientRect.y) {
      this._intersectionRatio.top = event.intersectionRect.height / event.boundingClientRect.height;
      checkIntersection(isHorizontal, this._intersectionRatio.top);
    }
    if (event.intersectionRect.bottom !== event.boundingClientRect.bottom) {
      this._intersectionRatio.bottom = event.intersectionRect.height / event.boundingClientRect.height;
      checkIntersection(isHorizontal, this._intersectionRatio.bottom);
    }
    if (event.intersectionRect.x !== event.boundingClientRect.x) {
      this._intersectionRatio.left = event.intersectionRect.width / event.boundingClientRect.width;
      checkIntersection(!isHorizontal, this._intersectionRatio.left);
    }
    if (event.intersectionRect.right !== event.boundingClientRect.right) {
      this._intersectionRatio.right = event.intersectionRect.width / event.boundingClientRect.width;
      checkIntersection(!isHorizontal, this._intersectionRatio.right);
    }
  }

  /** Actions to execute on activator scroll event. */
  @listen({auto: false, event: 'scroll', target: ($popup: ESLPopup) => $popup.scrollTargets})
  protected _onActivatorScroll(e: Event): void {
    if (this._updateLoopID) return;
    this._updatePosition();
  }

  @listen({auto: false, event: 'transitionstart', target: document.body})
  protected _onTransitionStart(): void {
    this._startUpdateLoop();
  }

  @listen({auto: false, event: 'resize', target: window})
  @decorate(rafDecorator)
  protected _onResize(): void {
    this._updatePosition();
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
      if (!this.activator) return this._stopUpdateLoop();

      const newRect = Rect.from(this.activator.getBoundingClientRect());
      if (!Rect.isEqual(lastRect, newRect)) {
        same = 0;
        lastRect = newRect;
      }

      if (same++ > 2) return this._stopUpdateLoop();

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
    const {containerRect} = this;

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
      outer: (typeof this._offsetContainer === 'number') ?
        containerRect.shrink(this._offsetContainer) :
        containerRect.shrink(...this._offsetContainer)
    };

    const {placedAt, popup, arrow} = calcPopupPosition(config);

    this.setAttribute('placed-at', placedAt);
    // set popup position
    this.style.left = `${popup.x}px`;
    this.style.top = `${popup.y}px`;
    // set arrow position
    if (this.$arrow) {
      const isHorizontal = isMajorAxisHorizontal(this.position);
      this.$arrow.style.left = isHorizontal ? '' : `${arrow.x}px`;
      this.$arrow.style.top = isHorizontal ? `${arrow.y}px` : '';
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

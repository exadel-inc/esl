import {range} from '../../esl-utils/misc/array';
import {ExportNs} from '../../esl-utils/environment/export-ns';
import {bind, memoize, ready, attr, boolAttr, jsonAttr, listen, decorate} from '../../esl-utils/decorators';
import {ESLTraversingQuery} from '../../esl-traversing-query/core';
import {afterNextRender, rafDecorator} from '../../esl-utils/async/raf';
import {ESLToggleable} from '../../esl-toggleable/core';
import {Rect} from '../../esl-utils/dom/rect';
import {isRTL} from '../../esl-utils/dom/rtl';
import {getListScrollParents} from '../../esl-utils/dom/scroll';
import {getViewportRect} from '../../esl-utils/dom/window';
import {parseBoolean, parseNumber, toBooleanAttribute} from '../../esl-utils/misc/format';
import {copyDefinedKeys} from '../../esl-utils/misc/object';
import {ESLIntersectionTarget, ESLIntersectionEvent} from '../../esl-event-listener/core/targets/intersection.target';
import {calcPopupPosition, isOnHorizontalAxis} from './esl-popup-position';
import {ESLPopupPlaceholder} from './esl-popup-placeholder';

import type {ESLToggleableActionParams} from '../../esl-toggleable/core';
import type {PositionType, IntersectionRatioRect} from './esl-popup-position';

const INTERSECTION_LIMIT_FOR_ADJACENT_AXIS = 0.7;
const DEFAULT_OFFSET_ARROW = 50;

export interface ESLPopupActionParams extends ESLToggleableActionParams {
  /** popup position relative to trigger */
  position?: PositionType;
  /** popup behavior if it does not fit in the window */
  behavior?: string;
  /** Disable hiding the popup depending on the visibility of the activator */
  disableActivatorObservation?: boolean;
  /** Margins on the edges of the arrow. */
  marginArrow?: number;
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
  /** Autofocus on popup/activator */
  autofocus?: boolean;

  /** Extra class to add to popup on activation */
  extraClass?: string;
  /** Extra styles to add to popup on activation */
  extraStyle?: string;
}

/** @deprecated alias, use {@link ESLPopupActionParams} instead, will be removed in v5.0.0 */
export type PopupActionParams = ESLPopupActionParams;

@ExportNs('Popup')
export class ESLPopup extends ESLToggleable {
  public static override is = 'esl-popup';

  /** Default params to pass into the popup on show/hide actions */
  public static override DEFAULT_PARAMS: ESLPopupActionParams = {
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
  @attr({defaultValue: 5, parser: parseInt}) public marginArrow: number;

  /**
   * Offset of the arrow as a percentage of the popup edge
   * (0% - at the left edge,
   *  100% - at the right edge,
   *  for RTL it is vice versa) */
  @attr({defaultValue: `${DEFAULT_OFFSET_ARROW}`}) public offsetArrow: string;

  /** Target to container element {@link ESLTraversingQuery} to define bounds of popups visibility (window by default) */
  @attr() public container: string;

  /** Default show/hide params for current ESLPopup instance */
  @jsonAttr<ESLPopupActionParams>()
  public override defaultParams: ESLPopupActionParams;

  @attr({parser: parseBoolean, serializer: toBooleanAttribute, defaultValue: true})
  public override closeOnEsc: boolean;
  @attr({parser: parseBoolean, serializer: toBooleanAttribute, defaultValue: true})
  public override closeOnOutsideAction: boolean;

  public $placeholder: ESLPopupPlaceholder | null;

  protected _extraClass?: string;
  protected _extraStyle?: string;

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
    if (!this.$container) return getViewportRect();
    return Rect.from(this.$container).shift(window.scrollX, window.scrollY);
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
  protected get offsetArrowRatio(): number {
    const offset = parseNumber(this.offsetArrow, DEFAULT_OFFSET_ARROW) || DEFAULT_OFFSET_ARROW;
    const offsetNormalized = Math.max(0, Math.min(offset, 100));
    const ratio = offsetNormalized / 100;
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
  protected appendArrow(): HTMLElement {
    const $arrow = document.createElement('span');
    $arrow.className = this.arrowClass;
    this.appendChild($arrow);
    memoize.clear(this, '$arrow');
    return $arrow;
  }

  /** Runs additional actions on show popup request */
  protected override shouldShow(params: ESLToggleableActionParams): boolean {
    if (params.activator !== this.activator) return true;
    return super.shouldShow(params);
  }

  /**
   * Actions to execute on show popup.
   * Inner state and 'open' attribute are not affected and updated before `onShow` execution.
   * Adds CSS classes, update a11y and fire esl:refresh event by default.
   */
  protected override onShow(params: ESLPopupActionParams): void {
    const wasOpened = this.open;
    if (wasOpened) {
      this.beforeOnHide(params);
      this.afterOnHide(params);
    }

    super.onShow(params);

    // TODO: change flow to use merged params unless attribute state is used in CSS
    Object.assign(this, copyDefinedKeys({
      position: params.position,
      behavior: params.behavior,
      container: params.container,
      marginArrow: params.marginArrow,
      offsetArrow: params.offsetArrow,
      disableActivatorObservation: params.disableActivatorObservation
    }));

    this._extraClass = params.extraClass;
    this._extraStyle = params.extraStyle;
    this._containerEl = params.containerEl;
    this._offsetTrigger = params.offsetTrigger || 0;
    this._offsetContainer = params.offsetContainer || 0;
    this._intersectionMargin = params.intersectionMargin || '0px';

    this.style.visibility = 'hidden'; // eliminates the blinking of the popup at the previous position

    // running as a separate task solves the problem with incorrect positioning on the first showing
    if (wasOpened) this.afterOnShow(params);
    else afterNextRender(() => this.afterOnShow(params));

    // Autofocus logic
    afterNextRender(() => params.autofocus && this.focus({preventScroll: true}));
  }

  /**
   * Actions to execute on hide popup.
   * Inner state and 'open' attribute are not affected and updated before `onShow` execution.
   * Removes CSS classes and updates a11y by default.
   */
  protected override onHide(params: ESLPopupActionParams): void {
    this.beforeOnHide(params);
    super.onHide(params);
    this.afterOnHide(params);
    params.autofocus && this.activator?.focus({preventScroll: true});
  }

  /**
   * Actions to execute after showing of popup.
   */
  protected afterOnShow(params: ESLPopupActionParams): void {
    this._updatePosition();

    this.style.visibility = 'visible';
    this.style.cssText += this._extraStyle || '';
    this.$$cls(this._extraClass || '', true);

    this.$$on(this._onActivatorScroll);
    this.$$on(this._onActivatorIntersection);
    this.$$on(this._onTransitionStart);
    this.$$on(this._onResize);

    this._startUpdateLoop();
  }

  /**
   * Actions to execute before hiding of popup.
   */
  protected beforeOnHide(params: ESLPopupActionParams): void {}

  /**
   * Actions to execute after hiding of popup.
   */
  protected afterOnHide(params: ESLPopupActionParams): void {
    this._stopUpdateLoop();

    this.$$attr('style', '');
    this.$$cls(this._extraClass || '', false);

    this.$$off(this._onActivatorScroll);
    this.$$off(this._onActivatorIntersection);
    this.$$off(this._onTransitionStart);
    this.$$off(this._onResize);

    memoize.clear(this, ['offsetArrowRatio', '$container']);
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

    const isHorizontal = isOnHorizontalAxis(this.position);
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

    const popupRect = Rect.from(this);
    const arrowRect = this.$arrow ? Rect.from(this.$arrow) : new Rect();
    const triggerRect = Rect.from(this.activator).shift(window.scrollX, window.scrollY);
    const {containerRect} = this;

    const innerMargin = this._offsetTrigger + arrowRect.width / 2;

    const config = {
      position: this.position,
      behavior: this.behavior,
      marginArrow: this.marginArrow,
      offsetArrowRatio: this.offsetArrowRatio,
      intersectionRatio: this._intersectionRatio,
      arrow: arrowRect,
      element: popupRect,
      trigger: triggerRect,
      inner: triggerRect.grow(innerMargin),
      outer: (typeof this._offsetContainer === 'number') ?
        containerRect.shrink(this._offsetContainer) :
        containerRect.shrink(...this._offsetContainer),
      isRTL: isRTL(this)
    };

    const {placedAt, popup, arrow} = calcPopupPosition(config);

    this.setAttribute('placed-at', placedAt);
    // set popup position
    this.style.left = `${popup.x}px`;
    this.style.top = `${popup.y}px`;
    if (!this.$arrow) return;
    // set arrow position
    const isHorizontal = isOnHorizontalAxis(this.position);
    this.$arrow.style.left = isHorizontal ? '' : `${arrow.x}px`;
    this.$arrow.style.top = isHorizontal ? `${arrow.y}px` : '';
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

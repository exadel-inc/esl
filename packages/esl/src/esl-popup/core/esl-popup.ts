import {range} from '../../esl-utils/misc/array';
import {ExportNs} from '../../esl-utils/environment/export-ns';
import {bind, memoize, ready, attr, boolAttr, jsonAttr, listen, decorate} from '../../esl-utils/decorators';
import {ESLTraversingQuery} from '../../esl-traversing-query/core';
import {afterNextRender, rafDecorator} from '../../esl-utils/async/raf';
import {ESLToggleable} from '../../esl-toggleable/core';
import {isElement, isRelativeNode, isRTL, Rect, getListScrollParents, getViewportRect} from '../../esl-utils/dom';
import {parseBoolean, toBooleanAttribute} from '../../esl-utils/misc/format';
import {copy} from '../../esl-utils/misc/object/copy';
import {ESLIntersectionTarget, ESLIntersectionEvent} from '../../esl-event-listener/core/targets/intersection.target';
import {calcPopupPosition, isOnHorizontalAxis} from './esl-popup-position';
import {ESLPopupPlaceholder} from './esl-popup-placeholder';
import {ESL_POPUP_CONFIG_KEYS} from './esl-popup-types';

import type {ESLToggleableActionParams, ESLA11yType} from '../../esl-toggleable/core';
import type {PopupPositionConfig, PositionType, PositionOriginType, IntersectionRatioRect, PlacementType, AlignmentType} from './esl-popup-position';
import type {ESLPopupActionParams, ProxiedParams} from './esl-popup-types';

const INTERSECTION_LIMIT_FOR_ADJACENT_AXIS = 0.7;

@ExportNs('Popup')
export class ESLPopup extends ESLToggleable {
  public static override is = 'esl-popup';

  /** Default params to pass into the popup on show/hide actions */
  public static override DEFAULT_PARAMS: ESLPopupActionParams = {
    offsetContainer: 15,
    intersectionMargin: '0px'
  };

  /** List of config keys */
  public static CONFIG_KEYS: string[] = ESL_POPUP_CONFIG_KEYS as string[];

  /** Classname of popups arrow element */
  @attr({defaultValue: 'esl-popup-arrow'}) public arrowClass: string;

  /**
   * Popup position relative to the trigger.
   * Currently supported: 'top', 'bottom', 'left', 'right' position types ('top' by default)
   *                      in combination with alignment 'start' and 'end' (e.g. 'top end', 'right start' etc.)
   */
  @attr({defaultValue: 'top'}) public position: PositionType;

  /** From which side of the trigger starts the positioning of the popup: 'inner', 'outer' ('outer' by default) */
  @attr({defaultValue: 'outer'}) public positionOrigin: PositionOriginType;

  /** Popup behavior if it does not fit in the window ('fit' by default) */
  @attr({defaultValue: 'fit'}) public behavior: string;

  /** Disable hiding the popup depending on the visibility of the activator */
  @boolAttr() public disableActivatorObservation: boolean;

  /** Alignment of the popup relative to the tether: 'start', 'end' */
  @attr() public alignmentTether: AlignmentType;

  /** Safe margins on the edges of the popup. */
  @attr({defaultValue: 5, parser: parseInt}) public marginTether: number;

  /** Offset of the tether relative to the position on the trigger */
  @attr({defaultValue: 0, parser: parseInt}) public offsetPlacement: number;

  /** offset in pixels from the trigger element */
  @attr({defaultValue: 3, parser: parseInt}) public offsetTrigger: number;

  /** Target to container element {@link ESLTraversingQuery} to define bounds of popups visibility (window by default) */
  @attr() public container: string;

  /** Default show/hide params for current ESLPopup instance */
  @jsonAttr<ESLPopupActionParams>()
  public override defaultParams: ESLPopupActionParams;

  @attr({parser: parseBoolean, serializer: toBooleanAttribute, defaultValue: true})
  public override closeOnEsc: boolean;
  @attr({parser: parseBoolean, serializer: toBooleanAttribute, defaultValue: true})
  public override closeOnOutsideAction: boolean;

  @attr({defaultValue: 'popup'})
  public override a11y: ESLA11yType;

  public $placeholder: ESLPopupPlaceholder | null;

  @memoize()
  public get config(): ProxiedParams {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const $popup = this;
    return new Proxy<ProxiedParams>({} as ProxiedParams, {
      get<T extends keyof ESLPopupActionParams>(target: ESLPopupActionParams, p: T | symbol): ESLPopupActionParams[T] {
        return Reflect.get($popup._params, p) ?? Reflect.get($popup, p);
      },
      set: (): boolean => false,
      deleteProperty: (): boolean => false,
      has<T extends keyof ESLPopupActionParams>(target: ESLPopupActionParams, p: T | symbol): boolean {
        return Reflect.has($popup._params, p) || Reflect.has($popup, p);
      },
      ownKeys(target: ESLPopupActionParams): (string | symbol)[] {
        const paramKeys = Reflect.ownKeys($popup._params);
        const popupKeys = ($popup.constructor as typeof ESLPopup).CONFIG_KEYS
          .filter((key: string) => !paramKeys.includes(key) && Reflect.has($popup, key as keyof ESLPopup));
        return [...paramKeys, ...popupKeys];
      },
      getOwnPropertyDescriptor: (): PropertyDescriptor | undefined => ({enumerable: true, configurable: true})
    });
  }

  protected _params: ESLPopupActionParams = {};
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
    const {container} = this.config;
    return container ? ESLTraversingQuery.first(container, this) as HTMLElement : this.config.containerEl;
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

  /** Get offsets tether ratio */
  protected get offsetTetherRatio(): number {
    const {alignmentTether} = this.config;
    if (!['start', 'end'].includes(alignmentTether)) return 0.5;
    const ratio = (alignmentTether === 'end') ? 1 : 0;
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
    this._params = copy(params, (key: string) => (this.constructor as typeof ESLPopup).CONFIG_KEYS.includes(key));

    this.style.visibility = 'hidden'; // eliminates the blinking of the popup at the previous position

    // running as a separate task solves the problem with incorrect positioning on the first showing
    if (wasOpened) this.afterOnShow(params);
    else afterNextRender(() => this.afterOnShow(params));
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
    this._params = {};
  }

  /**
   * Actions to execute after showing of popup.
   */
  protected afterOnShow(params: ESLPopupActionParams): void {
    this._updatePosition();

    this.style.visibility = 'visible';
    this.style.cssText += this.config.extraStyle || '';
    this.$$cls(this.config.extraClass || '', true);

    this.$$on(this._onActivatorScroll);
    this.$$on(this._onActivatorIntersection);
    this.$$on(this._onTransitionStart);
    this.$$on(this._onResize);
    this.$$on(this._onRefresh);

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
    this.$$cls(this.config.extraClass || '', false);

    this.$$off({group: 'observer'});

    memoize.clear(this, ['offsetTetherRatio', '$container']);
  }

  protected get scrollTargets(): EventTarget[] {
    if (this.activator) {
      return (getListScrollParents(this.activator) as EventTarget[]).concat([window]);
    }
    return [window];
  }

  protected get intersectionOptions(): IntersectionObserverInit {
    return {
      rootMargin: this.config.intersectionMargin,
      threshold: range(9, (x) => x / 8)
    };
  }

  /** Actions to execute on activator intersection event. */
  @listen({
    auto: false,
    group: 'observer',
    event: ESLIntersectionEvent.TYPE,
    target: ($popup: ESLPopup) => $popup.activator ? ESLIntersectionTarget.for($popup.activator, $popup.intersectionOptions) : [],
    condition: ($popup: ESLPopup) => !$popup.config.disableActivatorObservation
  })
  protected _onActivatorIntersection(event: ESLIntersectionEvent): void {
    this._intersectionRatio = {};
    if (!event.isIntersecting) {
      this.hide();
      return;
    }

    const isHorizontal = isOnHorizontalAxis(this.config.position);
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
  @listen({auto: false, group: 'observer', event: 'scroll', target: ($popup: ESLPopup) => $popup.scrollTargets})
  protected _onActivatorScroll(e: Event): void {
    if (this._updateLoopID) return;
    this._updatePosition();
  }

  @listen({auto: false, group: 'observer', event: 'transitionstart', target: document.body})
  protected _onTransitionStart(): void {
    this._startUpdateLoop();
  }

  @listen({auto: false, group: 'observer', event: 'resize', target: window})
  @decorate(rafDecorator)
  protected _onResize(): void {
    this._updatePosition();
  }

  @listen({auto: false, group: 'observer', event: ($popup: ESLPopup) => $popup.REFRESH_EVENT, target: window})
  protected _onRefresh({target}: Event): void {
    if (!isElement(target)) return;
    const {activator, $container} = this;
    if ($container === target || this.contains(target) || isRelativeNode(activator, target)) this._updatePosition();
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

  protected get positionConfig(): PopupPositionConfig {
    const {$arrow, activator, containerRect, offsetTetherRatio} = this;
    const {position, positionOrigin, behavior, offsetContainer, offsetPlacement, marginTether, offsetTrigger} = this.config;
    const [placement, alignment] = position.split(/\s+/) as [PlacementType, AlignmentType];

    const popupRect = Rect.from(this);
    const arrowRect = $arrow ? Rect.from($arrow) : new Rect();
    const triggerRect = activator ? Rect.from(activator).shift(window.scrollX, window.scrollY) : new Rect();

    const innerMargin = offsetTrigger + arrowRect.width / 2;
    return {
      placement,
      alignment,
      hasInnerOrigin: positionOrigin === 'inner',
      behavior,
      marginTether,
      offsetTetherRatio,
      offsetPlacement,
      intersectionRatio: this._intersectionRatio,
      arrow: arrowRect,
      element: popupRect,
      trigger: triggerRect,
      inner: positionOrigin === 'inner' ? triggerRect.shrink(innerMargin) : triggerRect.grow(innerMargin),
      outer: (typeof offsetContainer === 'number') ?
        containerRect.shrink(offsetContainer) :
        containerRect.shrink(...(offsetContainer ?? [(this.constructor as typeof ESLPopup).DEFAULT_PARAMS.offsetContainer])),
      isRTL: isRTL(this)
    };
  }

  /** Updates position of popup and its arrow */
  protected _updatePosition(): void {
    if (!this.activator) return;

    const {placedAt, popup, arrow} = calcPopupPosition(this.positionConfig);

    this.setAttribute('placed-at', placedAt);
    // set popup position
    this.style.left = `${popup.x}px`;
    this.style.top = `${popup.y}px`;
    if (!this.$arrow) return;
    // set arrow position
    const isHorizontal = isOnHorizontalAxis(this.config.position);
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

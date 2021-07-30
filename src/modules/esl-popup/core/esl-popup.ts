import {ExportNs} from '../../esl-utils/environment/export-ns';
import {attr, jsonAttr} from '../../esl-base-element/core';
import {bind} from '../../esl-utils/decorators/bind';
import {ready} from '../../esl-utils/decorators/ready';
import {prop} from '../../esl-utils/decorators/prop';
import {rafDecorator} from '../../esl-utils/async/raf';
import {ESLToggleable} from '../../esl-toggleable/core';
import {Rect} from '../../esl-utils/dom/rect';
import {getListScrollParents} from '../../esl-utils/dom/scroll';
import {getWindowRect} from '../../esl-utils/dom/window';
import {calcPopupPosition} from './esl-popup-position';

import type {ToggleableActionParams} from '../../esl-toggleable/core';
import type {PositionType, IntersectionRatioRect} from './esl-popup-position';

const INTERSECTION_LIMIT_FOR_ADJACENT_AXIS = 0.7;

export interface PopupActionParams extends ToggleableActionParams {
  /** popup position relative to trigger */
  position?: PositionType;
  /** popup behavior if it does not fit in the window */
  behavior?: string;
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

  @attr({defaultValue: 'top'}) public position: PositionType;
  @attr({defaultValue: 'fit'}) public behavior: string;

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

  protected bindEvents() {
    super.bindEvents();
    window.addEventListener('resize', this._deferredUpdatePosition);
    window.addEventListener('scroll', this._deferredUpdatePosition);
  }

  protected unbindEvents() {
    super.unbindEvents();
    window.removeEventListener('resize', this._deferredUpdatePosition);
    window.removeEventListener('scroll', this._deferredUpdatePosition);
  }

  protected get _isPositioningAlongHorizontal() {
    return ['left', 'right'].includes(this.position);
  }

  protected get _isPositioningAlongVertical() {
    return ['top', 'bottom'].includes(this.position);
  }

  public onShow(params: PopupActionParams) {
    super.onShow(params);

    if (params.position) {
      this.position = params.position;
    }
    if (params.behavior) {
      this.behavior = params.behavior;
    }
    this._offsetTrigger = params.offsetTrigger || 0;
    this._offsetWindow = params.offsetWindow || 0;

    this._updatePosition();
    this.activator && this._addActivatorObserver(this.activator);
  }

  public onHide(params: PopupActionParams) {
    super.onHide(params);

    this.activator && this._removeActivatorObserver(this.activator);
  }

  protected _checkIntersectionForAdjacentAxis(isAdjacentAxis: boolean, intersectionRatio: number) {
    if (isAdjacentAxis && intersectionRatio < INTERSECTION_LIMIT_FOR_ADJACENT_AXIS) {
      this.hide();
    }
  }

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

  @bind
  protected onActivatorScroll(e: Event) {
    this._updatePosition();
  }

  protected _addActivatorObserver(target: HTMLElement) {
    const scrollParents = getListScrollParents(target);

    const unsubscribers = scrollParents.map(($root) => {
      const options = {passive: true} as EventListenerOptions;
      $root.addEventListener('scroll', this.onActivatorScroll, options);
      return () => {
        $root && $root.removeEventListener('scroll', this.onActivatorScroll, options);
      };
    });

    const options = {
      rootMargin: '0px',
      threshold: [...Array(9).keys()].map((x) => x/8)
    } as IntersectionObserverInit;

    const observer = new IntersectionObserver(this.onActivatorIntersection, options);
    observer.observe(target);

    this._activatorObserver = {
      unsubscribers,
      observer
    };
  }

  protected _removeActivatorObserver(target: HTMLElement) {
    this._activatorObserver.observer?.disconnect();
    this._activatorObserver.observer = undefined;
    this._activatorObserver.unsubscribers?.forEach((cb) => cb());
    this._activatorObserver.unsubscribers = [];
  }

  protected set _arrowPosition(value: string) {
    if (!this.$arrow) return;

    this.$arrow.setAttribute('position', value);
  }

  protected _updatePosition() {
    if (!this.activator) return;

    const triggerRect = this.activator.getBoundingClientRect();
    const popupRect = this.getBoundingClientRect();
    const arrowRect = this.$arrow ? this.$arrow.getBoundingClientRect() : new DOMRect();
    const trigger = new Rect(triggerRect.x, triggerRect.y + window.pageYOffset, triggerRect.width, triggerRect.height);
    const innerMargin = this._offsetTrigger + arrowRect.width / 2;

    const config = {
      position: this.position,
      behavior: this.behavior,
      intersectionRatio: this._intersectionRatio,
      element: popupRect,
      trigger,
      inner: Rect.from(trigger).grow(innerMargin),
      outer: getWindowRect().shrink(this._offsetWindow)
    };

    const {x, y, arrow} = calcPopupPosition(config);

    // set popup position
    this.style.left = `${x}px`;
    this.style.top = `${y}px`;

    // set arrow position
    if (this.$arrow) {
      this.$arrow.style.left = ['top', 'bottom'].includes(arrow.position) ? `${arrow.x}px` : 'none';
      this.$arrow.style.top = ['left', 'right'].includes(arrow.position) ? `${arrow.y}px` : 'none';
      this._arrowPosition = arrow.position;
    }
  }
}

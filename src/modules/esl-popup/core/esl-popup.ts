import {ExportNs} from '../../esl-utils/environment/export-ns';
import {attr, jsonAttr} from '../../esl-base-element/core';
import {bind} from '../../esl-utils/decorators/bind';
import {prop} from '../../esl-utils/decorators/prop';
import {rafDecorator} from '../../esl-utils/async/raf';
import {ESLToggleable} from '../../esl-toggleable/core';

import {listScrollParents} from './listScrollParents';
import {calcPopupPosition, resizeRect} from './calcPosition';

import type {ToggleableActionParams} from '../../esl-toggleable/core';
import type {PositionType} from './calcPosition';

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

  public connectedCallback() {
    super.connectedCallback();

    setTimeout(() => {
      this.$arrow = this.querySelector('span.esl-popup-arrow');
    });
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

  // TODO: move to utilities
  protected get _windowWidth() {
    // return document.documentElement.clientWidth || document.body.clientWidth;
    return window.innerWidth || document.documentElement.clientWidth;
  }

  protected get _windowHeight() {
    return window.innerHeight || document.documentElement.clientHeight;
  }

  protected get _windowBottom() {
    return window.pageYOffset + this._windowHeight;
  }

  protected get _windowRight() {
    return window.pageXOffset + this._windowWidth;
  }

  protected get _windowRect() {
    return {
      top: window.pageYOffset + this._offsetWindow,
      left: window.pageXOffset + this._offsetWindow,
      right: this._windowRight - this._offsetWindow,
      bottom: this._windowBottom - this._offsetWindow,
      height: this._windowHeight,
      width: this._windowWidth
    };
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

  @bind
  protected onActivatorIntersection(entries: IntersectionObserverEntry[], observer: IntersectionObserver) {
    if (!entries[0].isIntersecting) {
      this.hide();
    }
  }

  @bind
  protected onActivatorScroll(e: Event) {
    this._updatePosition();
  }

  protected _addActivatorObserver(target: HTMLElement) {
    const scrollParents = listScrollParents(target);

    const unsubscribers = scrollParents.map(($root) => {
      const options = {passive: true} as EventListenerOptions;
      $root.addEventListener('scroll', this.onActivatorScroll, options);
      return () => {
        $root && $root.removeEventListener('scroll', this.onActivatorScroll, options);
      };
    });

    const options = {
      rootMargin: '0px',
      threshold: [0, 1]
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

    console.time('_updatePosition');

    const triggerRect = this.activator.getBoundingClientRect();
    const popupRect = this.getBoundingClientRect();
    const arrowRect = this.$arrow ? this.$arrow.getBoundingClientRect() : new DOMRect();

    const innerMargin = this._offsetTrigger + arrowRect.width / 2;

    const trigger = {
      top: triggerRect.top + window.pageYOffset,
      left: triggerRect.left,
      right: triggerRect.right,
      bottom: triggerRect.bottom + window.pageYOffset,
      height: triggerRect.height,
      width: triggerRect.width,
      cx: triggerRect.left + triggerRect.width / 2,
      cy: triggerRect.top  + window.pageYOffset + triggerRect.height / 2
    };

    const config = {
      position: this.position,
      behavior: this.behavior,
      element: popupRect,
      trigger,
      inner: resizeRect(trigger, innerMargin),
      outer: resizeRect(this._windowRect, -this._offsetWindow)
    };

    const {left, top, arrow} = calcPopupPosition(config);

    // set popup position
    this.style.left = `${left}px`;
    this.style.top = `${top}px`;

    // set arrow position
    if (this.$arrow) {
      this.$arrow.style.left = ['top', 'bottom'].includes(arrow.position) ? `${arrow.left}px` : 'none';
      this.$arrow.style.top = ['left', 'right'].includes(arrow.position) ? `${arrow.top}px` : 'none';
      this._arrowPosition = arrow.position;
    }
    console.timeEnd('_updatePosition');
  }
}

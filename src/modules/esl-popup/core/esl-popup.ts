import {ExportNs} from '../../esl-utils/environment/export-ns';
import {attr, jsonAttr} from '../../esl-base-element/core';
import {bind} from '../../esl-utils/decorators/bind';
import {prop} from '../../esl-utils/decorators/prop';
import {rafDecorator} from '../../esl-utils/async/raf';
import {ESLToggleable} from '../../esl-toggleable/core';

import {listScrollParents} from './listScrollParents';

import type {ToggleableActionParams} from '../../esl-toggleable/core';

export interface PopupActionParams extends ToggleableActionParams {
  /** popup position relative to trigger */
  position?: string;
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

  protected _left: number;
  protected _top: number;
  protected _leftT: number;
  protected _topT: number;
  protected _activatorObserver: ActivatorObserver;

  @attr({defaultValue: 'top'}) public position: string;
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
    return document.documentElement.clientWidth || document.body.clientWidth;
  }

  protected get _windowBottom() {
    return window.pageYOffset + window.innerHeight;
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
      rootMargin: `-${this._offsetWindow}px`,
      threshold: 1.0
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

    const {left, top, arrowLeft, arrowTop, position} = this._calculatePosition(this.activator);

    // set popup position
    this.style.left = `${left}px`;
    this.style.top = `${top}px`;

    // set arrow position
    if (this.$arrow) {
      this.$arrow.style.left = ['top', 'bottom'].includes(position) ? `${arrowLeft}px` : 'none';
      this.$arrow.style.top = ['left', 'right'].includes(position) ? `${arrowTop}px` : 'none';
      this._arrowPosition = position;
    }
  }

  protected _calculatePosition($activator: HTMLElement) {
    if (this.position === 'top') {
      const {left, arrowLeft} = this._calculateLeftT($activator);
      const {top, arrowTop, position} = this._calculateTopT($activator);

      return {
        left,
        top,
        arrowLeft,
        arrowTop,
        position
      };
    }

    if (this.position === 'bottom') {
      const {left, arrowLeft} = this._calculateLeftT($activator);
      const {top, arrowTop, position} = this._calculateTopB($activator);

      return {
        left,
        top,
        arrowLeft,
        arrowTop,
        position
      };
    }

    if (this.position === 'left') {
      const {left, arrowLeft, position} = this._calculateLeftL($activator);
      const {top, arrowTop} = this._calculateTopH($activator);

      return {
        left,
        top,
        arrowLeft,
        arrowTop,
        position
      };
    }

    if (this.position === 'right') {
      const {left, arrowLeft, position} = this._calculateLeftR($activator);
      const {top, arrowTop} = this._calculateTopH($activator);

      return {
        left,
        top,
        arrowLeft,
        arrowTop,
        position
      };
    }

    return {
      left: 0,
      top: 0,
      arrowLeft: 0,
      arrowTop: 0,
      position: 'top'
    };

  }

  protected _calculateLeftT($activator: HTMLElement) {
    const triggerRect = $activator.getBoundingClientRect();
    const triggerPosX = triggerRect.left + window.pageXOffset;
    const centerX = triggerPosX + triggerRect.width / 2;

    let arrowAdjust = 0;
    let left = centerX - this.offsetWidth / 2;

    if (this.behavior === 'fit' && left < this._offsetWindow) {
      arrowAdjust += left - this._offsetWindow;
      left = this._offsetWindow;
    }

    const right = this._windowWidth - (left + this.offsetWidth);
    if (this.behavior === 'fit' && right < this._offsetWindow) {
      arrowAdjust -= right - this._offsetWindow;
      left += right - this._offsetWindow;
    }
    const arrowLeft = this.clientWidth / 2 + arrowAdjust;

    return {
      left,
      arrowLeft
    };
  }

  protected _calculateTopT($activator: HTMLElement) {
    const arrowRect = this.$arrow ? this.$arrow.getBoundingClientRect() : new DOMRect();
    const triggerRect = $activator.getBoundingClientRect();
    const triggerPosY = triggerRect.top + window.pageYOffset;
    const arrowHeight = arrowRect.height / 2;

    let arrowTop = triggerPosY - this._offsetTrigger - arrowHeight;
    let top = arrowTop - this.offsetHeight;
    let position = 'top';
    if (this.behavior === 'fit' && window.pageYOffset > top) {  /* show popup at the bottom of trigger */
      arrowTop = triggerPosY + triggerRect.height + this._offsetTrigger;
      top = arrowTop + arrowHeight + this._offsetTrigger;
      position = 'bottom';
    }

    return {
      top,
      arrowTop,
      position
    };
  }

  protected _calculateTopB($activator: HTMLElement) {
    const arrowRect = this.$arrow ? this.$arrow.getBoundingClientRect() : new DOMRect();
    const triggerRect = $activator.getBoundingClientRect();
    const triggerPosY = triggerRect.top + window.pageYOffset;
    const arrowHeight = arrowRect.height / 2;

    let arrowTop = triggerPosY + triggerRect.height + this._offsetTrigger;
    let top = arrowTop + arrowHeight + this._offsetTrigger;
    const bottom = top + this.offsetHeight;
    let position = 'bottom';
    if (this.behavior === 'fit' && this._windowBottom < bottom) {
      arrowTop = triggerPosY - this._offsetTrigger - arrowHeight;
      top = arrowTop - this.offsetHeight;
      position = 'top';
    }

    return {
      top,
      arrowTop,
      position
    };
  }

  protected _calculateLeftL($activator: HTMLElement) {
    const arrowRect = this.$arrow ? this.$arrow.getBoundingClientRect() : new DOMRect();
    const triggerRect = $activator.getBoundingClientRect();
    const triggerLeft = triggerRect.left + window.pageXOffset;

    let arrowLeft = triggerLeft - this._offsetWindow - arrowRect.width / 2;
    let left = triggerLeft - this._offsetTrigger - arrowRect.width / 2 - this.offsetWidth;
    let position = 'left';

    if (this.behavior === 'fit' && left < this._offsetWindow) {
      const triggerRight = triggerRect.right + window.pageXOffset;
      left = triggerRight + this._offsetTrigger + arrowRect.width / 2;
      arrowLeft = triggerRight + this._offsetTrigger;
      position = 'right';
    }

    return {
      left,
      arrowLeft,
      position
    };
  }

  protected _calculateTopH($activator: HTMLElement) {
    const arrowRect = this.$arrow ? this.$arrow.getBoundingClientRect() : new DOMRect();
    const triggerRect = $activator.getBoundingClientRect();
    const triggerTop = triggerRect.top + window.pageYOffset;
    const triggerCenterY = triggerTop + triggerRect.height / 2;
    const arrowHeight = arrowRect.height / 2;

    let top = triggerCenterY - this.offsetHeight / 2;
    let arrowAdjust = 0;
    if (this.behavior === 'fit' && (top - this._offsetWindow) < window.pageYOffset) {
      arrowAdjust += window.pageYOffset - (top - this._offsetWindow);
      top = this._offsetWindow + window.pageYOffset;
    }
    if (this.behavior === 'fit' && (top + this.offsetHeight + this._offsetWindow) > this._windowBottom) {
      arrowAdjust += this._windowBottom - (this.offsetHeight + this._offsetWindow) - top;
      top = this._windowBottom - (this.offsetHeight + this._offsetWindow);
    }

    const arrowTop = this.offsetHeight / 2 - arrowHeight - arrowAdjust;

    return {
      top,
      arrowTop
    };
  }

  protected _calculateLeftR($activator: HTMLElement) {
    const arrowRect = this.$arrow ? this.$arrow.getBoundingClientRect() : new DOMRect();
    const triggerRect = $activator.getBoundingClientRect();
    const triggerRight = triggerRect.right + window.pageXOffset;

    let left = triggerRight + this._offsetTrigger + arrowRect.width / 2;
    let arrowLeft = triggerRight + this._offsetTrigger;
    let position = 'right';

    if (this.behavior === 'fit' && (left + this._offsetWindow + this.offsetWidth) > this._windowWidth) {
      const triggerLeft = triggerRect.left + window.pageXOffset;
      left = triggerLeft - this._offsetTrigger - arrowRect.width / 2 - this.offsetWidth;
      arrowLeft = triggerLeft - this._offsetWindow - arrowRect.width / 2;
      position = 'left';
    }

    return {
      left,
      arrowLeft,
      position
    };
  }
}

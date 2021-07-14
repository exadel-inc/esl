import {ExportNs} from '../../esl-utils/environment/export-ns';
import {attr, jsonAttr} from '../../esl-base-element/core';
import {prop} from '../../esl-utils/decorators/prop';
import {rafDecorator} from '../../esl-utils/async/raf';
import {ESLToggleable} from '../../esl-toggleable/core';

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

@ExportNs('Popup')
export class ESLPopup extends ESLToggleable {
  public static is = 'esl-popup';

  public $arrow: HTMLElement | null;

  protected _offsetTrigger: number;
  protected _offsetWindow: number;
  protected _deferredUpdatePosition = rafDecorator(() => this._updatePosition());

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
    this.$arrow = this.querySelector('.esl-popup-arrow');

    super.connectedCallback();
  }

  protected bindEvents() {
    super.bindEvents();
    window.addEventListener('resize', this._deferredUpdatePosition);
  }

  protected unbindEvents() {
    super.unbindEvents();
    window.removeEventListener('resize', this._deferredUpdatePosition);
  }

  // TODO: move to utilities
  protected get _windowWidth() {
    return document.documentElement.clientWidth || document.body.clientWidth;
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
      this.$arrow.style.left = `${arrowLeft}px`;
      this._arrowPosition = position;
    }
  }

  protected _calculatePosition($activator: HTMLElement) {
    const {left, arrowLeft} = this._calculateLeft($activator);
    const {top, arrowTop, position} = this._calculateTop($activator);

    return {
      left,
      top,
      arrowLeft,
      arrowTop,
      position
    };
  }

  protected _calculateLeft($activator: HTMLElement) {
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

  protected _calculateTop($activator: HTMLElement) {
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
}

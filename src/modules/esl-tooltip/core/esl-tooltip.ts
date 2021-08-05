import {ExportNs} from '../../esl-utils/environment/export-ns';
import {attr, boolAttr} from '../../esl-base-element/core';
import {ESLPopup} from '../../esl-popup/core';
import {memoize} from '../../esl-utils/decorators/memoize';

import type {PopupActionParams} from '../../esl-popup/core';
import type {PositionType} from '../../esl-popup/core/esl-popup-position';

export interface TooltipActionParams extends PopupActionParams {
  /** text to be shown */
  text?: string;
  /** html content to be shown */
  html?: string;
  /** tooltip without arrow */
  disableArrow?: boolean;
}

@ExportNs('Tooltip')
export class ESLTooltip extends ESLPopup {
  static is = 'esl-tooltip';

  @attr({defaultValue: 'top'}) public position: PositionType;
  @attr({defaultValue: 'fit'}) public behavior: string;
  @boolAttr() public disableArrow: boolean;

  @memoize()
  public static get sharedInstance(): ESLTooltip {
    return document.createElement('esl-tooltip');
  }

  public static show(params: TooltipActionParams = {}) {
    ESLTooltip.sharedInstance.hide(params);
    ESLTooltip.sharedInstance.show(params);
  }

  public static hide(params: TooltipActionParams = {}) {
    ESLTooltip.sharedInstance.hide(params);
  }

  public connectedCallback() {
    if (!this.disableArrow) {
      this._appendArrow();
    }
    super.connectedCallback();
    this.classList.add(ESLPopup.is);
  }

  protected setInitialState() {}

  @memoize()
  protected _createArrow() {
    const arrow = document.createElement('span');
    arrow.className = 'esl-popup-arrow';
    return arrow;
  }

  protected _appendArrow() {
    this.$arrow = this._createArrow();
    this.appendChild(this.$arrow);
  }

  public onShow(params: TooltipActionParams) {
    if (params.disableArrow) {
      this.disableArrow = params.disableArrow;
    }
    if (params.text) {
      this.innerText = params.text;
    }
    if (params.html) {
      this.innerHTML = params.html;
    }
    document.body.appendChild(this);
    super.onShow(params);
    this._updateActivatorState(true);
  }

  public onHide(params: TooltipActionParams) {
    this._updateActivatorState(false);
    super.onHide(params);
    document.body.removeChild(this);
  }

  protected _updateActivatorState(newState: boolean) {
    this.activator?.toggleAttribute('tooltip-shown', newState);
  }
}

declare global {
  export interface ESLLibrary {
    Tooltip: typeof ESLTooltip;
  }
  export interface HTMLElementTagNameMap {
    'esl-tooltip': ESLTooltip;
  }
}

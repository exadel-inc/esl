import {ExportNs} from '../../esl-utils/environment/export-ns';
import {attr, boolAttr} from '../../esl-base-element/core';
import {ESLPopup} from '../../esl-popup/core';
import {ESLNote} from '../../esl-note/core';
import {memoize} from '../../esl-utils/decorators/memoize';

import type {PopupActionParams} from '../../esl-popup/core';

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

  @attr({defaultValue: 'top'}) public position: string;
  @attr({defaultValue: 'fit'}) public behavior: string;
  @boolAttr() public disableArrow: boolean;

  private static _instance: ESLTooltip;

  public static get sharedInstance() {
    if (!ESLTooltip._instance) {
      ESLTooltip._instance = document.createElement('esl-tooltip') as ESLTooltip;
    }

    return ESLTooltip._instance;
  }

  public static show(params: PopupActionParams = {}) {
    ESLTooltip.sharedInstance.hide(params);
    ESLTooltip.sharedInstance.show(params);
  }

  public static hide(params: PopupActionParams = {}) {
    ESLTooltip.sharedInstance.hide(params);
  }

  public connectedCallback() {
    if (!this.disableArrow) {
      this._appendArrow();
    }
    super.connectedCallback();
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

  public onShow(params: PopupActionParams) {
    params = this.mergeDefaultParams(params);
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

  public onHide(params: PopupActionParams) {
    this._updateActivatorState(false);
    super.onHide(params);
    document.body.removeChild(this);
  }

  protected _updateActivatorState(newState: boolean) {
    if (this.activator && (this.activator instanceof ESLNote)) {
      this.activator.updateState(newState);
    }
  }
}

import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLPopup, KEYSOF_POPUP_ACTION_PARAMS} from '../../esl-popup/core';
import {memoize, prop} from '../../esl-utils/decorators';

import type {ESLPopupActionParams} from '../../esl-popup/core';

export interface ESLTooltipActionParams extends ESLPopupActionParams {
  /** text to be shown */
  text?: string;
  /** html content to be shown */
  html?: string;
  /** text directionality of tooltips content */
  dir?: string;
  /** language of tooltips text content */
  lang?: string;
  /** tooltip without arrow */
  disableArrow?: boolean;
}
/** List of ESLTooltipActionParams keys */
export const KEYSOF_TOOLTIP_ACTION_PARAMS: string[] = [
  ...KEYSOF_POPUP_ACTION_PARAMS,
  'text',
  'html',
  'dir',
  'lang',
  'disableArrow'] as const;

@ExportNs('Tooltip')
export class ESLTooltip extends ESLPopup {
  static override is = 'esl-tooltip';

  /** Default params to pass into the tooltip on show/hide actions */
  public static override DEFAULT_PARAMS: ESLTooltipActionParams = {
    ...ESLPopup.DEFAULT_PARAMS,
    position: 'top',
    hideDelay: 300
  };

  /** Shared instanse of Tooltip */
  @memoize()
  public static get sharedInstance(): ESLTooltip {
    return document.createElement('esl-tooltip');
  }

  /** Active state marker */
  public static get open(): boolean {
    return this.sharedInstance.open;
  }

  /** Changes the element state to active */
  public static show(params: ESLTooltipActionParams = {}): void {
    this.sharedInstance.show(params);
  }

  /** Changes the element state to inactive */
  public static hide(params: ESLTooltipActionParams = {}): void {
    this.sharedInstance.hide(params);
  }

  /** List of tooltip params keys  */
  @prop(KEYSOF_TOOLTIP_ACTION_PARAMS) public override PARAM_KEYS: string[];

  public override connectedCallback(): void {
    super.connectedCallback();
    this.classList.add(ESLPopup.is);
    this.tabIndex = 0;
  }

  /** Sets initial state of the Tooltip */
  protected override setInitialState(): void {}

  /** Actions to execute on show Tooltip. */
  public override onShow(params: ESLTooltipActionParams): void {
    if (params.text) this.innerText = params.text;
    if (params.html) this.innerHTML = params.html;
    if (params.text || params.html) memoize.clear(this, '$arrow');

    this.dir = params.dir || '';
    this.lang = params.lang || '';
    this.parentNode !== document.body && document.body.appendChild(this);
    this.$$cls('disable-arrow', params.disableArrow);

    super.onShow(params);
  }

  /** Actions to execute on Tooltip hiding. */
  public override onHide(params: ESLTooltipActionParams): void {
    super.onHide(params);
    this.parentNode === document.body && document.body.removeChild(this);
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

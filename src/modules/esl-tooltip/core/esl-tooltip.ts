import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLPopup} from '../../esl-popup/core';
import {memoize, attr, boolAttr, listen, prop} from '../../esl-utils/decorators';
import {TAB} from '../../esl-utils/dom/keys';
import {getKeyboardFocusableElements, handleFocusChain} from '../../esl-utils/dom/focus';

import type {PopupActionParams} from '../../esl-popup/core';
import type {PositionType} from '../../esl-popup/core/esl-popup-position';

export interface TooltipActionParams extends PopupActionParams {
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

@ExportNs('Tooltip')
export class ESLTooltip extends ESLPopup {
  static override is = 'esl-tooltip';

  @prop(false) public hasFocusLoop: boolean;

  /**
   * Tooltip position relative to the trigger.
   * Currently supported: 'top', 'bottom', 'left', 'right' position types ('top' by default)
   */
  @attr({defaultValue: 'top'}) public override position: PositionType;

  /** Tooltip behavior if it does not fit in the window ('fit' by default) */
  @attr({defaultValue: 'fit'}) public override behavior: string;

  /** Disable arrow at Tooltip */
  @boolAttr() public disableArrow: boolean;

  /** Shared instanse of Tooltip */
  @memoize()
  public static get sharedInstance(): ESLTooltip {
    return document.createElement('esl-tooltip');
  }

  /** List of all focusable elements inside instance */
  public get $focusables(): HTMLElement[] {
    return getKeyboardFocusableElements(this) as HTMLElement[];
  }

  /** First and last focusable elements inside instance */
  public get $boundaryFocusable(): {$first: HTMLElement | undefined, $last: HTMLElement | undefined} {
    const {$focusables} = this;
    const $first = $focusables[0];
    const $last = $focusables.pop();
    return {$first, $last};
  }

  /** Active state marker */
  public static get open(): boolean {
    return this.sharedInstance.open;
  }

  /** Changes the element state to active */
  public static show(params: TooltipActionParams = {}): void {
    this.sharedInstance.show(params);
  }

  /** Changes the element state to inactive */
  public static hide(params: TooltipActionParams = {}): void {
    this.sharedInstance.hide(params);
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    this.classList.add(ESLPopup.is);
    this.classList.toggle('disable-arrow', this.disableArrow);
    this.tabIndex = 0;
  }

  /** Sets initial state of the Tooltip */
  protected override setInitialState(): void {}

  /** Actions to execute on show Tooltip. */
  public override onShow(params: TooltipActionParams): void {
    if (params.disableArrow) {
      this.disableArrow = params.disableArrow;
    }
    if (params.text) {
      this.innerText = params.text;
    }
    if (params.html) {
      this.innerHTML = params.html;
    }
    this.dir = params.dir || '';
    this.lang = params.lang || '';
    this.parentNode !== document.body && document.body.appendChild(this);
    super.onShow(params);
  }

  /** Actions to execute on Tooltip hiding. */
  public override onHide(params: TooltipActionParams): void {
    super.onHide(params);
    this.parentNode === document.body && document.body.removeChild(this);
  }

  /**
   * Actions to execute after showing of popup.
   */
  protected override afterOnShow(): void {
    super.afterOnShow();
    this.focus({preventScroll: true});
  }

  /**
   * Actions to execute before hiding of popup.
   */
  protected override beforeOnHide(): void {
    super.beforeOnHide();
    this.activator?.focus({preventScroll: true});
  }

  @listen({inherit: true})
  protected override _onKeyboardEvent(e: KeyboardEvent): void {
    super._onKeyboardEvent(e);
    if (e.key === TAB) this._onTabKey(e);
  }

  /** Actions on TAB keypressed */
  protected _onTabKey(e: KeyboardEvent): void {
    if (!this.activator) return;
    const {$first, $last} = this.$boundaryFocusable;
    if (this.hasFocusLoop) return handleFocusChain(e, $first, $last) as void;
    if (!$last || e.target === (e.shiftKey ? $first : $last)) {
      this.activator.focus();
      e.preventDefault();
    }
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

import {ExportNs} from '../../esl-utils/environment/export-ns';
import {attr, boolAttr} from '../../esl-base-element/core';
import {ESLPopup} from '../../esl-popup/core';
import {bind} from '../../esl-utils/decorators/bind';
import {memoize} from '../../esl-utils/decorators/memoize';
import {TAB} from '../../esl-utils/dom/keys';
import {getKeyboardFocusableElements} from '../../esl-utils/dom/focus';
import {CSSClassUtils} from '../../esl-utils/dom/class';

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

  /**
   * Tooltip position relative to the trigger.
   * Currently supported: 'top', 'bottom', 'left', 'right' position types ('top' by default)
   */
  @attr({defaultValue: 'top'}) public position: PositionType;

  /** Tooltip behavior if it does not fit in the window ('fit' by default) */
  @attr({defaultValue: 'fit'}) public behavior: string;

  /** Disable arrow at Tooltip */
  @boolAttr() public disableArrow: boolean;

  /** Shared instanse of Tooltip */
  @memoize()
  public static get sharedInstance(): ESLTooltip {
    return document.createElement('esl-tooltip');
  }

  /** List of all focusable elements inside Tooltip */
  public get focusableElements(): Element[] {
    return getKeyboardFocusableElements(this);
  }

  /** First focusable element inside Tooltip */
  public get firstFocusableElement(): Element | null {
    const els = this.focusableElements;
    return els.length ? els[0] : null;
  }

  /** Last focusable element inside Tooltip */
  public get lastFocusableElement(): Element | null {
    const els = this.focusableElements;
    return els.length ? els[els.length - 1] : null;
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

  public connectedCallback(): void {
    if (!this.disableArrow) {
      this._appendArrow();
    }
    super.connectedCallback();
    this.classList.add(ESLPopup.is);
    this.tabIndex = 0;
  }

  /** Sets initial state of the Tooltip */
  protected setInitialState(): void {}

  /** Creates arrow at Tooltip */
  @memoize()
  protected _createArrow(): HTMLElement {
    const arrow = document.createElement('span');
    arrow.className = 'esl-popup-arrow';
    return arrow;
  }

  /** Appends arrow to Tooltip */
  protected _appendArrow(): void {
    this.$arrow = this._createArrow();
    this.appendChild(this.$arrow);
  }

  /** Actions to execute on show Tooltip. */
  public onShow(params: TooltipActionParams): void {
    if (params.disableArrow) {
      this.disableArrow = params.disableArrow;
    }
    if (params.text) {
      this.innerText = params.text;
    }
    if (params.html) {
      this.innerHTML = params.html;
    }
    if (params.extraClass) {
      CSSClassUtils.add(this, params.extraClass);
    }
    document.body.appendChild(this);
    super.onShow(params);
    this._updateActivatorState(true);
  }

  /** Actions to execute on Tooltip hiding. */
  public onHide(params: TooltipActionParams): void {
    this._updateActivatorState(false);
    super.onHide(params);
    document.body.removeChild(this);
    if (params.extraClass) {
      CSSClassUtils.remove(this, params.extraClass);
    }
  }

  /**
   * Actions to execute after showing of popup.
   */
  protected afterOnShow(): void {
    super.afterOnShow();
    this.focus({preventScroll: true});
  }

  /**
   * Actions to execute before hiding of popup.
   */
  protected beforeOnHide(): void {
    this.activator?.focus({preventScroll: true});
  }

  @bind
  protected _onKeyboardEvent(e: KeyboardEvent): void {
    super._onKeyboardEvent(e);
    if (e.key === TAB) this._onTabKey(e);
  }

  protected _onTabKey(e: KeyboardEvent): void {
    if (!this.activator) return;
    const {firstFocusableElement, lastFocusableElement} = this;
    if (
      !lastFocusableElement ||
      e.target === lastFocusableElement && !e.shiftKey ||
      e.target === firstFocusableElement && e.shiftKey
    ) {
      this.activator.focus();
      e.stopPropagation();
      e.preventDefault();
    }
  }

  protected _updateActivatorState(newState: boolean): void {
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

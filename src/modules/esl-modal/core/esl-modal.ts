import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLToggleable} from '../../esl-toggleable/core/esl-toggleable';
import {boolAttr, attr, memoize, listen} from '../../esl-utils/decorators';
import {hasAttr, setAttr} from '../../esl-utils/dom/attr';
import {getKeyboardFocusableElements, handleFocusChain} from '../../esl-utils/dom/focus';
import {lockScroll, unlockScroll} from '../../esl-utils/dom/scroll/utils';
import {parseBoolean} from '../../esl-utils/misc/format';
import {TAB} from '../../esl-utils/dom/keys';

import type {ScrollLockOptions} from '../../esl-utils/dom/scroll/utils';
import type {ESLToggleableActionParams} from '../../esl-toggleable/core/esl-toggleable';

export type ScrollLockStrategies = ScrollLockOptions['strategy'];

export interface ModalActionParams extends ESLToggleableActionParams { }

@ExportNs('Modal')
export class ESLModal extends ESLToggleable {
  public static override is = 'esl-modal';

  @attr({defaultValue: '[data-modal-close]'})
  public override closeTrigger: string;

  /**
   * Define option to lock scroll
   * @see ScrollLockOptions
   */
  @attr({defaultValue: 'pseudo'})
  public scrollLockStrategy: ScrollLockStrategies;

  @boolAttr() public noBackdrop: boolean;
  @boolAttr() public bodyInject: boolean;

  @attr({defaultValue: true, parser: parseBoolean})
  public override closeOnEsc: boolean;

  @attr({defaultValue: true, parser: parseBoolean})
  public override closeOnOutsideAction: boolean;

  @memoize()
  protected static get $backdrop(): HTMLElement {
    const $backdrop = document.createElement('esl-modal-backdrop');
    $backdrop.classList.add('esl-modal-backdrop');
    return $backdrop;
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    if (!hasAttr(this, 'role')) setAttr(this, 'role', 'dialog');
    if (!hasAttr(this, 'tabindex')) setAttr(this, 'tabIndex', '-1');
  }

  public override onShow(params: ModalActionParams): void {
    this.bodyInject && this.inject();
    this.showBackdrop();
    super.onShow(params);
    this.focus();
    lockScroll(document.documentElement, this.lockOptions);
  }

  public override onHide(params: ModalActionParams): void {
    unlockScroll(document.documentElement, this.lockOptions);
    super.onHide(params);
    this.hideBackdrop();
    this.activator?.focus();
    this.bodyInject && this.extract();
  }

  protected inject(): void {
    if (this.parentNode === document.body) return;
    document.body.appendChild(this);
  }

  protected extract(): void {
    if (this.parentNode !== document.body) return;
    document.body.removeChild(this);
  }


  protected showBackdrop(): void {
    if (this.noBackdrop) return;
    if (!document.body.contains(ESLModal.$backdrop)) document.body.appendChild(ESLModal.$backdrop);
    ESLModal.$backdrop.classList.add('active');
  }

  protected hideBackdrop(): void {
    if (this.noBackdrop) return;
    ESLModal.$backdrop.classList.remove('active');
  }

  public get lockOptions(): ScrollLockOptions {
    return {
      strategy: this.scrollLockStrategy,
      initiator: this
    };
  }

  public get $boundaryFocusable(): {first: HTMLElement, last: HTMLElement} {
    const $focusableEls = getKeyboardFocusableElements(this) as HTMLElement[];
    return {first: $focusableEls[0], last: $focusableEls[$focusableEls.length - 1]};
  }

  @listen({inherit: true})
  protected override _onKeyboardEvent(e: KeyboardEvent): void {
    super._onKeyboardEvent(e);
    if (e.key === TAB) this._onTabKey(e);
  }

  protected _onTabKey(e: KeyboardEvent): boolean | undefined {
    const {first, last} = this.$boundaryFocusable;
    return handleFocusChain(e, first, last);
  }
}

declare global {
  export interface ESLLibrary {
    Modal: typeof ESLModal;
  }
  export interface HTMLElementTagNameMap {
    'esl-modal': ESLModal;
  }
}

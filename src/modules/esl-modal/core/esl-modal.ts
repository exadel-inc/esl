import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLToggleable} from '../../esl-toggleable/core/esl-toggleable';
import {boolAttr, attr, memoize, listen} from '../../esl-utils/decorators';
import {hasAttr, setAttr} from '../../esl-utils/dom/attr';
import {getKeyboardFocusableElements, handleFocusChain} from '../../esl-utils/dom/focus';
import {lockScroll, unlockScroll} from '../../esl-utils/dom/scroll/utils';
import {parseBoolean, toBooleanAttribute} from '../../esl-utils/misc/format';
import {TAB} from '../../esl-utils/dom/keys';

import type {ScrollLockOptions} from '../../esl-utils/dom/scroll/utils';
import type {ESLToggleableActionParams} from '../../esl-toggleable/core/esl-toggleable';

export type ScrollLockStrategies = ScrollLockOptions['strategy'];

export interface ModalActionParams extends ESLToggleableActionParams { }

@ExportNs('Modal')
export class ESLModal extends ESLToggleable {
  public static override is = 'esl-modal';

  /**
   * Define option to lock scroll
   * @see ScrollLockOptions
   */
  @attr({defaultValue: 'none'})
  public scrollLockStrategy: ScrollLockStrategies;

  /** Do not activate backdrop */
  @boolAttr() public noBackdrop: boolean;

  /** Indicates that `esl-modal` instances should be moved to body on activate */
  @boolAttr() public injectToBody: boolean;

  /** Selector to mark inner close triggers (default `[data-modal-close]`) */
  @attr({defaultValue: '[data-modal-close]'})
  public override closeTrigger: string;

  /** Close the Toggleable on ESC keyboard event (default enabled) */
  @attr({defaultValue: true, parser: parseBoolean, serializer: toBooleanAttribute})
  public override closeOnEsc: boolean;

  /** Close the Toggleable on a click/tap outside (default enabled) */
  @attr({defaultValue: true, parser: parseBoolean, serializer: toBooleanAttribute})
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
    this.injectToBody && this.inject();
    this.showBackdrop();
    super.onShow(params);
    this.focus();
    lockScroll(document.documentElement, {
      strategy: this.scrollLockStrategy,
      initiator: this
    });
  }

  public override onHide(params: ModalActionParams): void {
    unlockScroll(document.documentElement, {initiator: this});
    super.onHide(params);
    this.hideBackdrop();
    this.activator?.focus();
    this.injectToBody && this.extract();
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

  public get $boundaryFocusable(): {first: HTMLElement, last: HTMLElement} {
    const $focusableEls = getKeyboardFocusableElements(this) as HTMLElement[];
    return {first: $focusableEls[0], last: $focusableEls[$focusableEls.length - 1]};
  }

  @listen({inherit: true})
  protected override _onKeyboardEvent(e: KeyboardEvent): boolean | void {
    super._onKeyboardEvent(e);
    if (e.key === TAB) {
      const {first, last} = this.$boundaryFocusable;
      return handleFocusChain(e, first, last);
    }
  }

  @listen({inherit: true})
  protected override _onCloseClick(e: MouseEvent): void {
    super._onCloseClick(e);
    e.stopPropagation();
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

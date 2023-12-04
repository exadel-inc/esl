import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLToggleable} from '../../esl-toggleable/core/esl-toggleable';
import {boolAttr, attr, listen} from '../../esl-utils/decorators';
import {hasAttr, setAttr} from '../../esl-utils/dom/attr';
import {afterNextRender} from '../../esl-utils/async/raf';
import {promisifyNextRender} from '../../esl-utils/async/promise/raf';
import {parseBoolean, parseCSSTime, toBooleanAttribute} from '../../esl-utils/misc/format';
import {getKeyboardFocusableElements, handleFocusChain} from '../../esl-utils/dom/focus';
import {lockScroll, unlockScroll} from '../../esl-utils/dom/scroll/utils';
import {TAB} from '../../esl-utils/dom/keys';

import {ESLModalBackdrop} from './esl-modal-backdrop';
import {ESLModalPlaceholder} from './esl-modal-placeholder';
import {ESLModalStack} from './esl-modal-stack';

import type {ScrollLockOptions} from '../../esl-utils/dom/scroll/utils';
import type {ESLToggleableActionParams} from '../../esl-toggleable/core/esl-toggleable';
import type {DelegatedEvent} from '../../esl-event-listener/core/types';

export type ScrollLockStrategies = ScrollLockOptions['strategy'];

export interface ModalActionParams extends ESLToggleableActionParams {
}

@ExportNs('Modal')
export class ESLModal extends ESLToggleable {
  public static override is = 'esl-modal';

  protected $placeholder: ESLModalPlaceholder | null;

  /** Indicates that current modal is last open modal */
  protected active: boolean = false;

  /**
   * Define option to lock scroll
   * @see ScrollLockOptions
   */
  @attr({defaultValue: 'background'})
  public scrollLockStrategy: ScrollLockStrategies;

  /** Do not activate backdrop */
  @boolAttr() public noBackdrop: boolean;

  /** Indicates that `esl-modal` instances should be moved to body on activate */
  @boolAttr() public injectToBody: boolean;

  /** Marker of ongoing animation */
  @boolAttr({readonly: true}) public animating: boolean;

  /** Define animation type */
  @attr({defaultValue: 'esl-modal-fade'}) public animationClass: string;


  /** Selector to mark inner close triggers (default `[data-modal-close]`) */
  @attr({defaultValue: '[data-modal-close]'})
  public override closeTrigger: string;

  /** Close the Toggleable on ESC keyboard event (default enabled) */
  @attr({defaultValue: true, parser: parseBoolean, serializer: toBooleanAttribute})
  public override closeOnEsc: boolean;

  /** Close the Toggleable on a click/tap outside (default disabled) */
  @attr({defaultValue: false, parser: parseBoolean, serializer: toBooleanAttribute})
  public override closeOnOutsideAction: boolean;

  public get $backdrop(): ESLModalBackdrop {
    return ESLModalBackdrop.instance;
  }

  public get animationTime(): number {
    const styles = getComputedStyle(this);
    return parseCSSTime(styles.getPropertyValue('--esl-modal-animation-time'));
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.$$cls(this.animationClass, true);
    if (!hasAttr(this, 'role')) setAttr(this, 'role', 'dialog');
    if (!hasAttr(this, 'tabindex')) setAttr(this, 'tabIndex', '-1');
    if (!hasAttr(this, 'aria-modal')) setAttr(this, 'aria-modal', 'true');
  }

  protected override updateA11y(): void {
    const targetEl = this.$a11yTarget;
    if (!targetEl) return;
    targetEl.setAttribute('aria-hidden', String(!this.active));
  }

  public override async onShow(params: ModalActionParams): Promise<void> {
    this.injectToBody && this.inject();
    this.$$attr('animating', true);
    await promisifyNextRender();
    const {animationTime} = this;
    super.onShow(params);
    ESLModalStack.instance.add(this);
    setTimeout(() => {
      this.onShowAnimationEnd(params);
      this.$$cls('handle-scrollbar', true);
    }, animationTime || 0);
  }

  public onShowAnimationEnd(params: ModalActionParams): void {
    this.$$attr('animating', false);
    this.focus({preventScroll: true});
    lockScroll(document.documentElement, {
      strategy: this.scrollLockStrategy,
      initiator: this
    });
  }

  public override onHide(params: ModalActionParams): void {
    const {animationTime} = this;
    this.$$cls('handle-scrollbar', false);
    this.$$attr('animating', true);
    super.onHide(params);
    ESLModalStack.instance.remove(this);
    setTimeout(() => this.onHideAnimationEnd(params), animationTime || 0);
  }

  public onHideAnimationEnd(params: ModalActionParams): void {
    this.$$attr('animating', false);
    unlockScroll(document.documentElement, {initiator: this});
    this.activator?.focus();
    this.injectToBody && afterNextRender(() => this.extract());
  }

  protected inject(): void {
    if (this.parentNode === document.body) return;
    !this.$placeholder && this.replacePlaceholder();
    document.body.appendChild(this);
  }

  protected replacePlaceholder(): void {
    this.$placeholder = ESLModalPlaceholder.from(this);
    this.parentNode?.replaceChild(this.$placeholder, this);
  }

  protected extract(): void {
    if (this.parentNode !== document.body) return;
    document.body.removeChild(this);
  }

  public get $boundaryFocusable(): {first: HTMLElement, last: HTMLElement} {
    const $focusableEls = getKeyboardFocusableElements(this) as HTMLElement[];
    return {first: $focusableEls[0], last: $focusableEls[$focusableEls.length - 1]};
  }

  @listen({event: 'stack:update', target: () => ESLModalStack.instance})
  protected onHandleStackUpdate(): void {
    this.active = (this === ESLModalStack.store.at(-1));
    this.updateA11y();
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
  protected override _onCloseClick(e: DelegatedEvent<MouseEvent>): void {
    super._onCloseClick(e);
    e.stopPropagation();
  }

  public static override register(this: typeof ESLModal, tagName: string = ESLModal.is): void {
    ESLModalBackdrop.register(tagName + '-backdrop');
    ESLModalPlaceholder.register(tagName + '-placeholder');
    ESLModalBackdrop.registered.then(() => ESLModalBackdrop.instance.insert());
    super.register(tagName);

    window.CSS?.registerProperty && CSS.registerProperty({
      name: '--esl-modal-animation-time',
      syntax: '<time>',
      inherits: true,
      initialValue: '0s'
    });
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

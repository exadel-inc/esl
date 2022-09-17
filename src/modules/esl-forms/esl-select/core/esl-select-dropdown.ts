import {ESLToggleable} from '../../../esl-toggleable/core/esl-toggleable';
import {bind, prop, listen} from '../../../esl-utils/decorators';
import {TAB} from '../../../esl-utils/dom/keys';
import {rafDecorator} from '../../../esl-utils/async/raf';
import {ESLSelectList} from '../../esl-select-list/core';

import type {ESLSelect} from './esl-select';
import type {ToggleableActionParams} from '../../../esl-toggleable/core/esl-toggleable';

/**
 * ESLSelectDropdown component
 * @author Alexey Stsefanovich (ala'n)
 *
 * Auxiliary inner custom component to render {@link ESLSelect} dropdown section
 * Uses {@link ESLSelectList} to render the content
 */
export class ESLSelectDropdown extends ESLToggleable {
  public static readonly is = 'esl-select-dropdown';
  public static register(): void {
    ESLSelectList.register();
    super.register();
  }

  /** Owner ESLSelect instance */
  public $owner: ESLSelect;

  /** Inner ESLSelectList component */
  protected $list: ESLSelectList;
  protected _disposeTimeout: number;
  protected _deferredUpdatePosition = rafDecorator(() => this.updatePosition());

  @prop() public closeOnEsc = true;
  @prop() public closeOnOutsideAction = true;

  constructor() {
    super();
    this.$list = document.createElement(ESLSelectList.is);
  }

  protected setInitialState(): void {}

  protected connectedCallback(): void {
    super.connectedCallback();
    this.appendChild(this.$list);
  }
  protected disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeChild(this.$list);
  }

  protected onShow(params: ToggleableActionParams): void {
    document.body.appendChild(this);
    this._disposeTimeout && window.clearTimeout(this._disposeTimeout);

    this.$$cls(this.$owner.dropdownClass, true);
    this.$list.pinSelected = this.$owner.pinSelected;
    this.$list.selectAllLabel = this.$owner.selectAllLabel;
    this.$list.$select = this.$owner.$select;

    super.onShow(params);
    const focusable: HTMLElement | null = this.querySelector('[tabindex]');
    focusable?.focus({preventScroll: true});
    this.updatePosition();
  }
  protected onHide(params: ToggleableActionParams): void {
    const select = this.activator;
    super.onHide(params);
    this._disposeTimeout = window.setTimeout(() => {
      if (this.parentNode !== document.body) return;
      document.body.removeChild(this);
    }, 1000);
    select && setTimeout(() => select.focus({preventScroll: true}), 0);
  }

  @listen('keydown')
  protected _onKeyboardEvent(e: KeyboardEvent): void {
    super._onKeyboardEvent(e);
    if (e.key === TAB) this._onTabKey(e);
  }

  protected _onTabKey(e: KeyboardEvent): void {
    const els = this.querySelectorAll('[tabindex]');
    const first = els[0] as HTMLElement;
    const last = els[els.length - 1] as HTMLElement;
    if (first && e.target === last && !e.shiftKey) first.focus();
    if (last && e.target === first && e.shiftKey) last.focus();
  }

  @listen({event: 'resize', target: window})
  protected _onResize(): void {
    if (!this.activator) return;
    this._deferredUpdatePosition();
  }

  @bind
  public updatePosition(): void {
    if (!this.activator) return;
    const windowY = window.scrollY || window.pageYOffset;
    const rect = this.activator.getBoundingClientRect();

    this.style.top = `${windowY + rect.top + rect.height}px`;
    this.style.left = `${rect.left}px`;
    this.style.width = `${rect.width}px`;
  }
}

declare global {
  export interface HTMLElementTagNameMap {
    'esl-select-dropdown': ESLSelectDropdown;
  }
}

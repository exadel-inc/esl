import {ESLPopup} from '../../../esl-popup/core';
import {prop, listen, memoize} from '../../../esl-utils/decorators';
import {TAB} from '../../../esl-utils/dom/keys';
import {ESLSelectList} from '../../esl-select-list/core';

import type {ESLSelect} from './esl-select';
import type {ESLToggleableActionParams} from '../../../esl-toggleable/core/esl-toggleable';
import type {PositionType} from '../../../esl-popup/core/esl-popup-position';

/**
 * ESLSelectDropdown component
 * @author Alexey Stsefanovich (ala'n)
 *
 * Auxiliary inner custom component to render {@link ESLSelect} dropdown section
 * Uses {@link ESLSelectList} to render the content
 */
export class ESLSelectDropdown extends ESLPopup {
  public static override readonly is = 'esl-select-dropdown';
  public static override register(): void {
    ESLSelectList.register();
    super.register();
  }

  /** Owner ESLSelect instance */
  public $owner: ESLSelect;

  /** Inner delay timer to dispose popup with list */
  protected _disposeTimeout: number;

  @prop(true) public override closeOnEsc: boolean;
  @prop(true) public override closeOnOutsideAction: boolean;
  @prop('bottom') public override position: PositionType;

  /** Inner ESLSelectList component */
  @memoize()
  protected get $list(): ESLSelectList {
    return ESLSelectList.create();
  }

  protected override setInitialState(): void {}

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.appendChild(this.$list);
  }
  protected override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeChild(this.$list);
  }

  protected override onShow(params: ESLToggleableActionParams): void {
    if (this.parentElement !== document.body) document.body.appendChild(this);

    this.$list.pinSelected = this.$owner.pinSelected;
    this.$list.selectAllLabel = this.$owner.selectAllLabel;
    this.$list.$select = this.$owner.$select;

    super.onShow(params);
    this._disposeTimeout && window.clearTimeout(this._disposeTimeout);
    const $focusable: HTMLElement | null = this.querySelector('[tabindex]');
    $focusable?.focus({preventScroll: true});
    this._updatePosition();
  }

  protected override onHide(params: ESLToggleableActionParams): void {
    const $select = this.activator;
    super.onHide(params);
    $select && setTimeout(() => $select.focus({preventScroll: true}), 0);
  }

  protected override afterOnHide(params: ESLToggleableActionParams): void {
    const afterOnHideTask = (): void => {
      super.afterOnHide(params);
      if (this.parentElement === document.body) document.body.removeChild(this);
    };
    if (params.action === 'show') afterOnHideTask();
    else this._disposeTimeout = window.setTimeout(afterOnHideTask, 1000);
  }

  @listen('keydown')
  protected override _onKeyboardEvent(e: KeyboardEvent): void {
    super._onKeyboardEvent(e);
    if (e.key === TAB) this._onTabKey(e);
  }

  protected _onTabKey(e: KeyboardEvent): void {
    const $els = this.querySelectorAll('[tabindex]');
    const $first = $els[0] as HTMLElement;
    const $last = $els[$els.length - 1] as HTMLElement;
    if ($first && e.target === $last && !e.shiftKey) $first.focus();
    if ($last && e.target === $first && e.shiftKey) $last.focus();
  }

  protected override _updatePosition(): void {
    const $select = this.activator;
    if ($select) this.style.width = `${$select.getBoundingClientRect().width}px`;
    super._updatePosition();
  }
}

declare global {
  export interface HTMLElementTagNameMap {
    'esl-select-dropdown': ESLSelectDropdown;
  }
}

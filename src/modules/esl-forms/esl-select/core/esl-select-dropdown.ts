import {ESLPopup} from '../../../esl-popup/core';
import {prop, listen} from '../../../esl-utils/decorators';
import {TAB} from '../../../esl-utils/dom/keys';
import {ESLSelectList} from '../../esl-select-list/core';
import {ESLTraversingQuery} from '../../../esl-traversing-query/core/esl-traversing-query';

import type {ESLSelect} from './esl-select';
import type {ESLSelectRenderer} from './esl-select-renderer';
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

  /** Inner ESLSelectList component */
  protected $list: ESLSelectList;
  protected _disposeTimeout: number;

  @prop() public override closeOnEsc = true;
  @prop() public override closeOnOutsideAction = true;
  @prop() public position = 'bottom' as PositionType;

  constructor() {
    super();
    this.$list = document.createElement(ESLSelectList.is);
  }

  protected override setInitialState(): void {}

  protected connectedCallback(): void {
    super.connectedCallback();
    this.appendChild(this.$list);
  }
  protected override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeChild(this.$list);
  }

  protected onShow(params: ESLToggleableActionParams): void {
    this.activator = ESLTraversingQuery.first('esl-select-renderer', null, this.activator!) as ESLSelectRenderer;

    document.body.appendChild(this);
    this._disposeTimeout && window.clearTimeout(this._disposeTimeout);

    this.$$cls(this.$owner.dropdownClass, true);
    this.$list.pinSelected = this.$owner.pinSelected;
    this.$list.selectAllLabel = this.$owner.selectAllLabel;
    this.$list.$select = this.$owner.$select;

    super.onShow(params);
    const focusable: HTMLElement | null = this.querySelector('[tabindex]');
    focusable?.focus({preventScroll: true});
    this._updatePosition();
  }

  protected override onHide(params: ESLToggleableActionParams): void {
    const select = this.activator;
    super.onHide(params);
    this._disposeTimeout = window.setTimeout(() => {
      if (this.parentNode !== document.body) return;
      document.body.removeChild(this);
    }, 1000);
    select && setTimeout(() => select.focus({preventScroll: true}), 0);
  }

  @listen('keydown')
  protected override _onKeyboardEvent(e: KeyboardEvent): void {
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

  protected override _updatePosition(): void {
    const select = this.activator;
    if (select) this.style.width = `${select.getBoundingClientRect().width}px`;
    super._updatePosition();
  }
}

declare global {
  export interface HTMLElementTagNameMap {
    'esl-select-dropdown': ESLSelectDropdown;
  }
}

import {ESLPopup} from '../../../esl-popup/core/esl-popup';
import {bind} from '../../../esl-utils/decorators/bind';
import {prop} from '../../../esl-utils/decorators/prop';
import {TAB} from '../../../esl-utils/dom/keys';
import {ESLSelectList} from '../../esl-select-list/core';
import {jsonAttr} from '../../../esl-base-element/core';
import {afterNextRender} from '../../../esl-utils/async/raf';

import type {ESLSelect} from './esl-select';
import type {PositionType, PopupActionParams} from '../../../esl-popup/core';
import type {ToggleableActionParams} from '../../../esl-toggleable/core/esl-toggleable';

/**
 * ESLSelectDropdown component
 * @author Alexey Stsefanovich (ala'n)
 *
 * Auxiliary inner custom component to render {@link ESLSelect} dropdown section
 * Uses {@link ESLSelectList} to render the content
 */
export class ESLSelectDropdown extends ESLPopup {
  public static readonly is = 'esl-select-dropdown';

  @prop() public behavior: string = '';
  @prop() public position: PositionType = 'bottom';

  /** Default params to merge into passed action params */
  @jsonAttr<PopupActionParams>({defaultValue: {
    offsetTrigger: 0,
    offsetWindow: 15
  }})
  public defaultParams: PopupActionParams;

  public static register(): void {
    ESLSelectList.register();
    super.register();
  }

  /** Owner ESLSelect instance */
  public $owner: ESLSelect;

  /** Inner ESLSelectList component */
  protected $list: ESLSelectList;
  protected _disposeTimeout: number;

  @prop() public closeOnEsc = true;
  @prop() public closeOnOutsideAction = true;

  constructor() {
    super();
    this.$list = document.createElement(ESLSelectList.is);
  }

  protected setInitialState(): void {}

  public connectedCallback(): void {
    super.connectedCallback();
    this.appendChild(this.$list);
  }
  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeChild(this.$list);
  }

  public onShow(params: ToggleableActionParams): void {
    document.body.appendChild(this);
    this._disposeTimeout && window.clearTimeout(this._disposeTimeout);

    this.$list.pinSelected = this.$owner.pinSelected;
    this.$list.selectAllLabel = this.$owner.selectAllLabel;
    this.$list.$select = this.$owner.$select;

    super.onShow(params);
    const focusable: HTMLElement | null = this.querySelector('[tabindex]');
    focusable && afterNextRender(() => focusable.focus({preventScroll: true}));
  }

  public onHide(params: ToggleableActionParams): void {
    const select = this.activator;
    super.onHide(params);
    this._disposeTimeout = window.setTimeout(() => {
      if (this.parentNode !== document.body) return;
      document.body.removeChild(this);
    }, 1000);
    select && afterNextRender(() => select.focus({preventScroll: true}));
  }

  @bind
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

  protected _updatePosition(): void {
    if (!this.activator) return;
    const rect = this.activator.getBoundingClientRect();
    this.style.width = `${rect.width}px`;
    // TODO: fix potential reflow
    super._updatePosition();
  }
}

declare global {
  export interface HTMLElementTagNameMap {
    'esl-select-dropdown': ESLSelectDropdown;
  }
}

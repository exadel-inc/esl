import {ESLToggleable, ToggleableActionParams} from '../../../esl-toggleable/core/esl-toggleable';
import {bind} from '../../../esl-utils/decorators/bind';
import {TAB} from '../../../esl-utils/dom/keys';
import {rafDecorator} from '../../../esl-utils/async/raf';
import {ESLSelectList} from '../../esl-select-list/core';

import type {ESLSelect} from './esl-select';

/**
 * ESLSelectDropdown component
 * @author Alexey Stsefanovich (ala'n)
 *
 * Auxiliary inner custom component to render {@link ESLSelect) dropdown section
 * Uses {@link ESLSelectList} to render the content
 */
export class ESLSelectDropdown extends ESLToggleable {
  public static readonly is = 'esl-select-dropdown';
  public static register() {
    ESLSelectList.register();
    super.register();
  }

  /** Owner ESLSelect instance */
  public $owner: ESLSelect;

  /** Inner ESLSelectList component */
  protected $list: ESLSelectList;
  protected _disposeTimeout: number;
  protected _deferredUpdatePosition = rafDecorator(() => this.updatePosition());

  // TODO: update defaults + override decorator
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  get closeOnEsc() { return true; }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  get closeOnOutsideAction() { return true; }

  constructor() {
    super();
    this.$list = document.createElement(ESLSelectList.is) as ESLSelectList;
  }

  protected setInitialState() {}

  protected connectedCallback() {
    super.connectedCallback();
    this.appendChild(this.$list);
  }
  protected disconnectedCallback() {
    super.disconnectedCallback();
    this.removeChild(this.$list);
  }

  protected bindEvents() {
    super.bindEvents();
    window.addEventListener('resize', this._deferredUpdatePosition);
  }
  protected unbindEvents() {
    super.unbindEvents();
    window.removeEventListener('resize', this._deferredUpdatePosition);
  }

  protected onShow(params: ToggleableActionParams) {
    document.body.appendChild(this);
    this._disposeTimeout && window.clearTimeout(this._disposeTimeout);

    this.$list.pinSelected = this.$owner.pinSelected;
    this.$list.selectAllLabel = this.$owner.selectAllLabel;
    this.$list.$select = this.$owner.$select;

    super.onShow(params);
    const focusable = this.querySelector('[tabindex]') as HTMLElement;
    focusable && focusable.focus( { preventScroll: true } );
    this.updatePosition();
  }
  protected onHide(params: ToggleableActionParams) {
    const select = this.activator;
    super.onHide(params);
    this._disposeTimeout = window.setTimeout(() => {
      if (this.parentNode !== document.body) return;
      document.body.removeChild(this);
    }, 1000);
    select && setTimeout(() => select.focus({ preventScroll: true }), 0);
  }

  @bind
  protected _onKeyboardEvent(e: KeyboardEvent) {
    super._onKeyboardEvent(e);
    if (e.key === TAB) this._onTabKey(e);
  }

  protected _onTabKey(e: KeyboardEvent) {
    const els = this.querySelectorAll('[tabindex]');
    const first = els[0] as HTMLElement;
    const last = els[els.length - 1] as HTMLElement;
    if (first && e.target === last && !e.shiftKey) first.focus();
    if (last && e.target === first && e.shiftKey) last.focus();
  }

  @bind
  public updatePosition() {
    if (!this.activator) return;
    const windowY = window.scrollY || window.pageYOffset;
    const rect = this.activator.getBoundingClientRect();

    this.style.top = `${windowY + rect.top + rect.height}px`;
    this.style.left = `${rect.left}px`;
    this.style.width = `${rect.width}px`;
  }
}

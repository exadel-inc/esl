import {ESLBasePopup, PopupActionParams} from '../../../esl-base-popup/core/esl-base-popup';
import {bind} from '../../../esl-utils/decorators/bind';
import {rafDecorator} from '../../../esl-utils/async/raf';
import {ESLSelectList} from '../../esl-select-list/core';

import type {ESLSelect} from './esl-select';

export class ESLSelectDropdown extends ESLBasePopup {
  public static readonly is = 'esl-select-dropdown';
  public static register() {
    ESLSelectList.register();
    super.register();
  }

  public owner: ESLSelect;

  protected $list: ESLSelectList;
  protected _disposeTimeout: number;
  protected _deferredUpdatePosition = rafDecorator(() => this.updatePosition());

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  get closeOnEsc() { return true; }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  get closeOnOutsideAction() { return true; }

  constructor() {
    super();
    this.$list = document.createElement(ESLSelectList.is) as ESLSelectList;
    this.$list.pinSelected = true;
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

  protected onShow(params: PopupActionParams) {
    document.body.appendChild(this);
    this._disposeTimeout && window.clearTimeout(this._disposeTimeout);

    this.$list.select = this.owner.select;
    this.$list.selectAllLabel = this.owner.selectAllLabel;

    super.onShow(params);
    const focusable = this.querySelector('[tabindex]') as HTMLElement;
    focusable && focusable.focus( { preventScroll: true } );
    this.updatePosition();
  }
  protected onHide(params: PopupActionParams) {
    const select = this.activator;
    select && setTimeout(() => select.focus({ preventScroll: true }), 0);
    super.onHide(params);
    this._disposeTimeout = window.setTimeout(() => {
      document.body.removeChild(this);
    }, 1000);
  }

  @bind
  protected _onKeyboardEvent(e: KeyboardEvent) {
    super._onKeyboardEvent(e);
    if (e.key === 'Tab') this._onTabKey(e);
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

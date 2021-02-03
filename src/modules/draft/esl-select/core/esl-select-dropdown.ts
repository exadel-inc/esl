import {ESLBasePopup, PopupActionParams} from '../../../esl-base-popup/core/esl-base-popup';
import {ESLSelectList} from './esl-select-list';
import {rafDecorator} from '../../../esl-utils/async/raf';
import {bind} from '../../../esl-utils/decorators/bind';

import type {ESLSelect} from './esl-select';

export class ESLSelectDropdown extends ESLBasePopup {
  public static readonly is = 'esl-select-dropdown';

  public origin: ESLSelect;

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

    this.$list.model = this.origin.model;
    this.$list.selectAllLabel = this.origin.selectAll;

    super.onShow(params);
    const focusable = this.querySelector('[tabindex]') as HTMLElement;
    focusable && focusable.focus();
    this.updatePosition();
  }
  protected onHide(params: PopupActionParams) {
    const select = this.activator;
    select && setTimeout(() => select.focus(), 0);
    super.onHide(params);
    this._disposeTimeout = window.setTimeout(() => {
      document.body.removeChild(this);
    }, 1000);
  }

  @bind
  public updatePosition() {
    if (!this.activator) return;
    const windowY = window.scrollY || window.pageYOffset;
    const rect = this.activator.getBoundingClientRect();

    this.style.top = `${windowY + rect.y + rect.height}px`;
    this.style.left = `${rect.left}px`;
    this.style.width = `${rect.width}px`;
  }
}

import {attr, boolAttr, ESLBaseElement} from '../../../esl-base-element/core';
import {bind} from '../../../esl-utils/decorators/bind';
import {ESLScrollbar} from '../../../esl-scrollbar/core';
import {ESLSelectItem} from './esl-select-item';

import {ESLSelectWrapper} from './esl-select-wrapper';

export class ESLSelectList extends ESLSelectWrapper {
  public static readonly is = 'esl-select-list';
  public static get observedAttributes() {
    return ['select-all-label'];
  }

  public static register() {
    ESLSelectItem.register();
    super.register();
  }

  @attr({defaultValue: 'Select All'}) public selectAllLabel: string;
  @boolAttr() public pinSelected: string;

  protected $items: ESLSelectItem[];
  protected $list: HTMLDivElement;
  protected $scroll: ESLScrollbar;
  protected $selectAll: ESLSelectItem;

  constructor() {
    super();
    this.$list = document.createElement('div');
    this.$list.setAttribute('role', 'list');
    this.$list.classList.add('esl-scrollable-content');
    this.$list.classList.add('esl-select-list-container');
    this.$scroll = document.createElement(ESLScrollbar.is) as ESLScrollbar;
    this.$scroll.target = '::prev';
    this.$selectAll = document.createElement(ESLSelectItem.is) as ESLSelectItem;
    this.$selectAll.classList.add('esl-select-all-item');
  }

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
    if (!this.connected || newVal === oldVal) return;
    if (attrName === 'select-all-label') {
      this.$selectAll.textContent = newVal;
    }
  }

  protected connectedCallback() {
    super.connectedCallback();

    this.appendChild(this.$selectAll);
    this.appendChild(this.$list);
    this.appendChild(this.$scroll);

    this.bindSelect();
    this.bindEvents();
  }
  protected disconnectedCallback() {
    super.disconnectedCallback();

    this.appendChild(this.$selectAll);
    this.appendChild(this.$list);
    this.appendChild(this.$scroll);

    this.unbindEvents();
  }

  protected bindSelect() {
    const target = this.querySelector('[esl-select-target]') as HTMLSelectElement;
    if (!target || !(target instanceof HTMLSelectElement)) return;
    this.select = target;
  }

  public bindEvents() {
    if (!this.select) return;
    this.addEventListener('click', this._onClick);
    this.addEventListener('keypress', this._onKeyboard);
  }
  public unbindEvents() {
    if (!this.select) return;
    this.removeEventListener('click', this._onClick);
    this.removeEventListener('keypress', this._onKeyboard);
  }

  protected renderItems() {
    if (!this.select) return;
    this.$list.innerHTML = '';
    const activeItems = this.$items.filter((option) => option.selected);
    const inactiveItems = this.$items.filter((option) => !option.selected);

    activeItems.forEach((item) => this.$list.appendChild(item));
    activeItems.slice(-1).forEach((item) => item.classList.add('separator'));
    inactiveItems.forEach((item) => this.$list.appendChild(item));
  }
  protected renderAllOption() {
    if (!this.select) return;
    this.$items = this.options.map(ESLSelectItem.build);
    this.$selectAll.textContent = this.selectAllLabel;
    this.$selectAll.selected = this.$items.every((item) => item.selected);
  }

  @bind
  protected _onTargetChange(newTarget: HTMLSelectElement | undefined, oldTarget: HTMLSelectElement | undefined) {
    super._onTargetChange(newTarget, oldTarget);
    this.bindEvents();
    this.renderAllOption();
    this.renderItems();
  }

  @bind
  public _onChange() {
    this.$items.forEach((item) => {
      item.selected = this.isSelected(item.value);
    });
    this.$selectAll.selected = this.$items.every((item) => item.selected);
  }

  @bind
  protected _onClick(e: MouseEvent | KeyboardEvent) {
    const target = e.target;
    if (!target || !(target instanceof ESLSelectItem)) return;
    if (target.classList.contains('esl-select-all-item')) {
      this.setAllSelected(!target.selected);
    } else {
      this.setSelected(target.value, !target.selected);
    }
  }

  @bind
  protected _onKeyboard(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      this._onClick(e);
      e.preventDefault();
    }
  }
}

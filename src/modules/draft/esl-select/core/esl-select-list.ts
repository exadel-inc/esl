import {attr, ESLBaseElement} from '../../../esl-base-element/core';
import {bind} from '../../../esl-utils/decorators/bind';
import {ESLScrollbar} from '../../../esl-scrollbar/core';
import {ESLSelectItem} from './esl-select-item';

import type {ESLSelect} from './esl-select';

export class ESLSelectList extends ESLBaseElement {
  public static readonly is = 'esl-select-list';
  public static get observedAttributes() { return ['select-all-label']; }

  protected _owner: ESLSelect;

  @attr({defaultValue: 'Select All'})
  public selectAllLabel: string;

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

  get owner() {
    return this._owner;
  }
  set owner(mod: ESLSelect) {
    this.unbindEvents();
    this._owner = mod;
    this.bindEvents();
    this.rerender();
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

    this.rerender();
    this.bindEvents();
  }
  protected disconnectedCallback() {
    super.disconnectedCallback();

    this.appendChild(this.$selectAll);
    this.appendChild(this.$list);
    this.appendChild(this.$scroll);

    this.unbindEvents();
  }

  public bindEvents() {
    if (!this.owner) return;
    this.owner.addEventListener('change', this._onChange);
    this.addEventListener('click', this._onClick);
    this.addEventListener('keypress', this._onKeyboard);
  }
  public unbindEvents() {
    if (!this.owner) return;
    this.owner.removeEventListener('change', this._onChange);
    this.removeEventListener('click', this._onClick);
    this.removeEventListener('keypress', this._onKeyboard);
  }

  @bind
  public rerender() {
    if (!this.owner) return;
    this.$items = this.owner.options.map(ESLSelectItem.build);
    this.$selectAll.selected = this.$items.every((item) => item.selected);
    this.$selectAll.textContent = this.selectAllLabel;

    this.$list.innerHTML = '';
    const activeItems = this.$items.filter((option) => option.selected);
    const inactiveItems = this.$items.filter((option) => !option.selected);

    activeItems.forEach((item) => this.$list.appendChild(item));
    activeItems.slice(-1).forEach((item) => item.classList.add('separator'));
    inactiveItems.forEach((item) => this.$list.appendChild(item));
  }

  @bind
  public _onChange() {
    this.$items.forEach((item) => {
      item.selected = this.owner.isSelected(item.value);
    });
    this.$selectAll.selected = this.$items.every((item) => item.selected);
  }

  @bind
  protected _onClick(e: MouseEvent | KeyboardEvent) {
    const target = e.target;
    if (!target || !(target instanceof ESLSelectItem)) return;
    if (target.classList.contains('esl-select-all-item')) {
      this.owner.setAll(!target.selected);
    } else {
      this.owner.set(target.value, !target.selected);
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

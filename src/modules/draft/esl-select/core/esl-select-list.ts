import {attr, ESLBaseElement} from '../../../esl-base-element/core';
import {ESLScrollbar} from '../../../esl-scrollbar/core';
import {ESLSelectModel} from './esl-select-model';
import {ESLSelectItem} from './esl-select-item';
import {bind} from '../../../esl-utils/decorators/bind';
import {ENTER, SPACE, SPACE_IE} from '../../../esl-utils/dom/keycodes';

export class ESLSelectList extends ESLBaseElement {
  public static readonly is = 'esl-select-list';
  public static get observedAttributes() { return ['select-all-label']; }

  protected _model: ESLSelectModel;

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

  get model() {
    return this._model;
  }
  set model(mod: ESLSelectModel) {
    this.unbindEvents();
    this._model = mod;
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
    if (!this.model) return;
    this.model.addListener(this.sync);
    this.addEventListener('click', this._onClick);
    this.addEventListener('keypress', this._onKeyboard);
  }
  public unbindEvents() {
    if (!this.model) return;
    this.model.removeListener(this.sync);
    this.removeEventListener('click', this._onClick);
    this.removeEventListener('keypress', this._onKeyboard);
  }

  @bind
  public rerender() {
    if (!this.model) return;
    this.$items = this.model.options.map(ESLSelectItem.build);
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
  public sync() {
    this.$items.forEach((item) => {
      item.selected = this.model.check(item.value);
    });
    this.$selectAll.selected = this.$items.every((item) => item.selected);
  }

  @bind
  protected _onClick(e: MouseEvent | KeyboardEvent) {
    const target = e.target;
    if (!target || !(target instanceof ESLSelectItem)) return;
    if (target.classList.contains('esl-select-all-item')) {
      this.model.toggleAll(!target.selected);
    } else {
      this.model.toggle(target.value, !target.selected);
    }
  }

  @bind
  protected _onKeyboard(e: KeyboardEvent) {
    switch (e.key) {
      case ENTER:
      case SPACE:
      case SPACE_IE:
        this._onClick(e);
        e.preventDefault();
        break;
    }
  }
}

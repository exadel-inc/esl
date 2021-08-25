import {attr, boolAttr} from '../../../esl-base-element/core';
import {bind} from '../../../esl-utils/decorators/bind';
import {ARROW_DOWN, ARROW_UP, ENTER, SPACE} from '../../../esl-utils/dom/keys';
import {ExportNs} from '../../../esl-utils/environment/export-ns';
import {ESLScrollbar} from '../../../esl-scrollbar/core';
import {ESLSelectItem} from './esl-select-item';
import {ESLSelectWrapper} from './esl-select-wrapper';

/**
 * ESLSelectList component
 * @author Alexey Stsefanovich (ala'n)
 *
 * ESLSelectList is a component to show selectable list of items. Decorates native HTMLSelectElement
 */
@ExportNs('SelectList')
export class ESLSelectList extends ESLSelectWrapper {
  public static readonly is = 'esl-select-list';
  public static get observedAttributes() {
    return ['select-all-label', 'disabled'];
  }

  public static register() {
    ESLSelectItem.register();
    super.register();
  }

  /** Select all options text */
  @attr({defaultValue: 'Select All'}) public selectAllLabel: string;

  /** Disabled state marker */
  @boolAttr() public disabled: boolean;
  /** Marker for selecting items to be pinned to the top of the list */
  @boolAttr() public pinSelected: boolean;

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
    if (attrName === 'disabled') {
      this._updateDisabled();
    }
  }

  protected connectedCallback() {
    super.connectedCallback();

    this.appendChild(this.$selectAll);
    this.appendChild(this.$list);
    this.appendChild(this.$scroll);

    this.bindSelect();
    this.bindEvents();

    this._updateDisabled();
  }
  protected disconnectedCallback() {
    super.disconnectedCallback();

    this.appendChild(this.$selectAll);
    this.appendChild(this.$list);
    this.appendChild(this.$scroll);

    this.unbindEvents();
  }

  protected bindSelect() {
    const target = this.querySelector('[esl-select-target]');
    if (!target || !(target instanceof HTMLSelectElement)) return;
    this.$select = target;
  }

  public bindEvents() {
    if (!this.$select) return;
    this.addEventListener('click', this._onClick);
    this.addEventListener('keydown', this._onKeydown);
  }
  public unbindEvents() {
    if (!this.$select) return;
    this.removeEventListener('click', this._onClick);
    this.removeEventListener('keydown', this._onKeydown);
  }

  protected _renderItems() {
    if (!this.$select) return;
    this.$list.innerHTML = '';
    this.$items = this.options.map(ESLSelectItem.build);
    if (this.pinSelected) {
      this._renderGroup(this.$items.filter((option) => option.selected));
      this._renderGroup(this.$items.filter((option) => !option.selected));
    } else {
      this._renderGroup(this.$items);
    }
    this.toggleAttribute('multiple', this.multiple);
  }
  protected _renderGroup(items: ESLSelectItem[]) {
    items.forEach((item) => this.$list.appendChild(item));
    const [last] = items.slice(-1);
    last && last.classList.add('last-in-group');
  }

  protected _updateSelectAll() {
    if (!this.multiple) {
      this.$selectAll.removeAttribute('tabindex');
      return;
    }
    this.$selectAll.tabIndex = 0;
    this.$selectAll.selected = this.isAllSelected();
    this.$selectAll.textContent = this.selectAllLabel;
  }
  protected _updateDisabled() {
    this.setAttribute('aria-disabled', String(this.disabled));
    if (!this.$select) return;
    this.$select.disabled = this.disabled;
  }

  @bind
  protected _onTargetChange(newTarget: HTMLSelectElement | undefined, oldTarget: HTMLSelectElement | undefined) {
    super._onTargetChange(newTarget, oldTarget);
    this._updateSelectAll();
    this._renderItems();

    this.bindEvents();
  }

  @bind
  public _onChange() {
    this._updateSelectAll();
    this.$items.forEach((item) => item.update());
  }

  @bind
  public _onListChange() {
    this._renderItems();
  }

  @bind
  protected _onClick(e: MouseEvent | KeyboardEvent) {
    if (this.disabled) return;
    const target = e.target;
    if (!target || !(target instanceof ESLSelectItem)) return;
    if (target.classList.contains('esl-select-all-item')) {
      this.setAllSelected(!target.selected);
    } else {
      this.setSelected(target.value, !target.selected);
    }
  }

  @bind
  protected _onKeydown(e: KeyboardEvent) {
    if ([ENTER, SPACE].includes(e.key)) {
      this._onClick(e);
      e.preventDefault();
    }
    if ([ARROW_UP, ARROW_DOWN].includes(e.key)) {
      const index = this.$items.indexOf(document.activeElement as ESLSelectItem);
      const count = this.$items.length;
      const increment = e.key === ARROW_UP ? -1 : 1;
      if (index === -1) return;
      this.$items[(index + increment + count) % count].focus();
      e.preventDefault();
    }
  }
}

declare global {
  export interface ESLLibrary {
    SelectList: typeof ESLSelectList;
  }
  export interface HTMLElementTagNameMap {
    'esl-select-list': ESLSelectList;
  }
}

import {attr, boolAttr} from '../../../esl-base-element/core';
import {bind} from '../../../esl-utils/decorators/bind';
import {CSSUtil} from '../../../esl-utils/dom/styles';

import {ESLSelectRenderer} from './esl-select-renderer';
import {ESLSelectDropdown} from './esl-select-dropdown';
import {ESLSelectWrapper} from '../../esl-select-list/core/esl-select-wrapper';

export class ESLSelect extends ESLSelectWrapper {
  public static readonly is = 'esl-select';
  public static get observedAttributes() {
    return ['disabled'];
  }
  public static register() {
    ESLSelectDropdown.register();
    ESLSelectRenderer.register();
    super.register();
  }

  /** Placeholder text property */
  @attr() public emptyText: string;
  /** Classes for filled stated */
  @attr() public hasValueClass: string;
  /** Classes for focused state. Select focused also if dropdown list is opened */
  @attr() public hasFocusClass: string;
  /** Select all text */
  @attr({defaultValue: 'Select All'}) public selectAllLabel: string;
  /** Additional text for field renderer */
  @attr({defaultValue: '+ {rest} more...'}) public moreLabelFormat: string;

  /** Dropdown open marker */
  @boolAttr() public open: boolean;
  /** Disabled state marker */
  @boolAttr() public disabled: boolean;

  protected $text: ESLSelectRenderer;
  protected $dropdown: ESLSelectDropdown;

  constructor() {
    super();

    this.$text = document.createElement(ESLSelectRenderer.is) as ESLSelectRenderer;
    this.$dropdown = document.createElement(ESLSelectDropdown.is) as ESLSelectDropdown;
  }

  protected attributeChangedCallback(attrName: string) {
    if (attrName === 'disabled') this._updateDisabled();
  }

  protected connectedCallback() {
    super.connectedCallback();

    this.select = this.querySelector('[esl-select-target]') as HTMLSelectElement;
    if (!this.select) return;

    this._prepare();
    this._updateDisabled();
    this.bindEvents();
    this._onUpdate();
  }
  protected disconnectedCallback() {
    super.disconnectedCallback();
    this.unbindEvents();
    this._dispose();
  }

  protected bindEvents() {
    this.addEventListener('click', this._onClick);
    this.addEventListener('keydown', this._onKeydown);
    this.addEventListener('focusout', this._onUpdate);
    this.$dropdown.addEventListener('esl:show', this._onPopupStateChange);
    this.$dropdown.addEventListener('esl:hide', this._onPopupStateChange);
  }
  protected unbindEvents() {
    this.removeEventListener('click', this._onClick);
    this.removeEventListener('keydown', this._onKeydown);
    this.removeEventListener('focusout', this._onUpdate);
    this.$dropdown.removeEventListener('esl:show', this._onPopupStateChange);
    this.$dropdown.removeEventListener('esl:hide', this._onPopupStateChange);
  }

  protected _prepare() {
    this.$text.className = this.select.className;
    this.$text.emptyText = this.emptyText;
    this.$text.moreLabelFormat = this.moreLabelFormat;
    this.$dropdown.owner = this;
    this.appendChild(this.$text);
  }
  protected _dispose() {
    this.select.className = this.$text.className;
    this.removeChild(this.$text);
  }

  protected _updateDisabled() {
    this.setAttribute('aria-disabled', String(this.disabled));
    if (!this.select) return;
    this.select.disabled = this.disabled;
    if (this.disabled && this.open) this.$dropdown.hide();
  }

  @bind
  protected _onChange(event: Event) {
    this._onUpdate();
  }

  @bind
  protected _onUpdate() {
    const hasValue = this.hasSelected();
    this.toggleAttribute('has-value', hasValue);
    CSSUtil.toggleClsTo(this, this.hasValueClass, hasValue);

    const focusEl = document.activeElement;
    const hasFocus = this.open || (focusEl && this.contains(focusEl));
    CSSUtil.toggleClsTo(this, this.hasFocusClass, !!hasFocus);
  }

  @bind
  protected _onClick() {
    if (this.disabled) return;
    this.$dropdown.toggle(!this.$dropdown.open, {
      activator: this,
      initiator: 'select'
    });
  }

  @bind
  protected _onKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      this.click();
      e.preventDefault();
    }
  }

  @bind
  protected _onPopupStateChange(e: CustomEvent) {
    if (e.target !== this.$dropdown) return;
    this.open = this.$dropdown.open;
    this._onUpdate();
  }
}

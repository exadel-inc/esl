import {bind, attr, boolAttr} from '../../../esl-utils/decorators';
import {CSSClassUtils} from '../../../esl-utils/dom/class';
import {ENTER, SPACE} from '../../../esl-utils/dom/keys';
import {ExportNs} from '../../../esl-utils/environment/export-ns';
import {EventUtils} from '../../../esl-utils/dom/events';

import {ESLSelectWrapper} from '../../esl-select-list/core/esl-select-wrapper';
import {ESLSelectRenderer} from './esl-select-renderer';
import {ESLSelectDropdown} from './esl-select-dropdown';

/**
 * ESLSelect component
 * @author Alexey Stsefanovich (ala'n)
 *
 * ESLSelect is a component on top of native select that brings more customization features.
 * Uses "select with dropdown" view. Supports both single and multiple selection.
 */
@ExportNs('Select')
export class ESLSelect extends ESLSelectWrapper {
  public static readonly is = 'esl-select';
  public static observedAttributes = ['disabled', 'dropdown-class'];

  public static register(): void {
    ESLSelectDropdown.register();
    ESLSelectRenderer.register();
    super.register();
  }

  /** Placeholder text property */
  @attr() public placeholder: string;
  /** Class(es) to mark not empty state */
  @attr() public hasValueClass: string;
  /** Class(es) for focused state. Select is also focused if the dropdown list is opened */
  @attr() public hasFocusClass: string;
  /** Class(es) for select dropdown */
  @attr() public dropdownClass: string;
  /** Select all options text */
  @attr({defaultValue: 'Select All'}) public selectAllLabel: string;

  /**
   * Text to add when there is not enough space to show all selected options inline,
   * Supports `{rest}`, `{length}` and `{limit}` placeholders
   */
  @attr({defaultValue: '+ {rest} more...'}) public moreLabelFormat: string;

  /** Dropdown open marker */
  @boolAttr() public open: boolean;
  /** Disabled state marker */
  @boolAttr() public disabled: boolean;
  /** Marker for selecting items to be pinned to the top of the dropdown */
  @boolAttr() public pinSelected: boolean;

  protected $renderer: ESLSelectRenderer;
  protected $dropdown: ESLSelectDropdown;

  constructor() {
    super();

    this.$renderer = document.createElement(ESLSelectRenderer.is);
    this.$dropdown = document.createElement(ESLSelectDropdown.is);
  }

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    if (attrName === 'disabled') this._updateDisabled();
    if (attrName === 'dropdown-class') {
      this.$dropdown.$$cls(oldVal, false);
      this.$dropdown.$$cls(newVal, true);
    }
  }

  protected connectedCallback(): void {
    super.connectedCallback();

    this.$select = this.querySelector('[esl-select-target]')!;
    if (!this.$select) return;

    this._prepare();
    this._updateDisabled();
    this.bindEvents();
    this._onUpdate();
  }
  protected disconnectedCallback(): void {
    super.disconnectedCallback();
    this.unbindEvents();
    this._dispose();
  }

  /** Catches the focus */
  public focus(options?: FocusOptions): void {
    this.$select.focus(options);
  }
  /** Updates select component */
  public update(valueChanged = true): void {
    this._onUpdate();
    if (!valueChanged) return;
    // TODO: silent updates
    EventUtils.dispatch(this, 'esl:change:value', {detail: {event: null}});
  }

  protected bindEvents(): void {
    this.addEventListener('click', this._onClick);
    this.addEventListener('keydown', this._onKeydown);
    this.addEventListener('focusout', this._onUpdate);
    this.$dropdown.addEventListener('esl:show', this._onPopupStateChange);
    this.$dropdown.addEventListener('esl:hide', this._onPopupStateChange);
  }
  protected unbindEvents(): void {
    this.removeEventListener('click', this._onClick);
    this.removeEventListener('keydown', this._onKeydown);
    this.removeEventListener('focusout', this._onUpdate);
    this.$dropdown.removeEventListener('esl:show', this._onPopupStateChange);
    this.$dropdown.removeEventListener('esl:hide', this._onPopupStateChange);
  }

  protected _prepare(): void {
    this.$renderer.className = this.$select.className;
    this.$renderer.emptyText = this.placeholder;
    this.$renderer.moreLabelFormat = this.moreLabelFormat;
    this.$dropdown.$owner = this;
    this.appendChild(this.$renderer);
  }
  protected _dispose(): void {
    this.$select.className = this.$renderer.className;
    this.removeChild(this.$renderer);
  }

  protected _updateDisabled(): void {
    this.setAttribute('aria-disabled', String(this.disabled));
    if (!this.$select) return;
    this.$select.disabled = this.disabled;
    if (this.disabled && this.open) this.$dropdown.hide();
  }

  @bind
  protected _onChange(event: Event): void {
    this._onUpdate();
    EventUtils.dispatch(this, 'esl:change:value', {detail: {event}});
  }

  @bind
  protected _onUpdate(): void {
    const hasValue = this.hasSelected();
    this.toggleAttribute('has-value', hasValue);
    CSSClassUtils.toggle(this, this.hasValueClass, hasValue);

    const focusEl = document.activeElement;
    const hasFocus = this.open || (focusEl && this.contains(focusEl));
    CSSClassUtils.toggle(this, this.hasFocusClass, !!hasFocus);
  }

  @bind
  protected _onClick(): void {
    if (this.disabled) return;
    this.$dropdown.toggle(!this.$dropdown.open, {
      activator: this,
      initiator: 'select'
    });
  }

  @bind
  protected _onKeydown(e: KeyboardEvent): void {
    if ([ENTER, SPACE].includes(e.key)) {
      this.click();
      e.preventDefault();
    }
  }

  @bind
  protected _onPopupStateChange(e: CustomEvent): void {
    if (e.target !== this.$dropdown) return;
    this.open = this.$dropdown.open;
    this._onUpdate();
  }
}

declare global {
  export interface ESLLibrary {
    Select: typeof ESLSelect;
  }
  export interface HTMLElementTagNameMap {
    'esl-select': ESLSelect;
  }
}

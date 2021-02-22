import {ESLBaseElement} from '../../../esl-base-element/core';
import {EventUtils} from '../../../esl-utils/dom/events';
import {bind} from '../../../esl-utils/decorators/bind';

export interface ESLSelectOption {
  text: string;
  value: string;
  selected: boolean;
}

export interface ESLSelectModel {
  /** Allow multiple items */
  multiple: boolean;
  /** Get list of options */
  options: ESLSelectOption[];
  /** Get list of selected options */
  selectedOptions: ESLSelectOption[];

  /** Toggle option with passed value to the state */
  setSelected(value: string, state: boolean): void;
  /** Check selected state*/
  isSelected(value: string): boolean;
  /** Has selected options */
  hasSelected(): boolean;

  /** Check that all options are selected */
  isAllSelected(): boolean;
  /** Toggle all options to the state */
  setAllSelected(state: boolean): void;
}

export abstract class ESLSelectWrapper extends ESLBaseElement implements ESLSelectModel {
  private _$select: HTMLSelectElement;

  public get $select() {
    return this._$select;
  }
  public set $select(select: HTMLSelectElement) {
    const prev = this._$select;
    this._$select = select;
    this._onTargetChange(select, prev);
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.ownerDocument.addEventListener('reset', this._onReset);
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();
    this.ownerDocument.removeEventListener('reset', this._onReset);
    if (this._$select) this._$select.removeEventListener('change', this._onChange);
  }

  protected _onChange(event?: Event) {}
  protected _onTargetChange(newTarget: HTMLSelectElement | undefined,
                            oldTarget: HTMLSelectElement | undefined) {
    if (oldTarget) oldTarget.removeEventListener('change', this._onChange);
    if (newTarget) newTarget.addEventListener('change', this._onChange);
  }

  @bind
  protected _onReset(event: Event) {
    if (!event.target || event.target !== this.form) return;
    setTimeout(() => this._onChange(event));
  }

  public get multiple() {
    return this.$select && this.$select.multiple;
  }

  public get options(): ESLSelectOption[] {
    return this.$select ? Array.from(this.$select.options) : [];
  }
  public get selectedOptions(): ESLSelectOption[] {
    return this.options.filter((item) => item.selected);
  }

  protected getOption(value: string): ESLSelectOption | undefined {
    return this.options.find((item) => item.value === value);
  }

  public setSelected(value: string, state: boolean) {
    const option = this.getOption(value);
    option && (option.selected = state);
    EventUtils.dispatch(this.$select, 'change');
  }
  public isSelected(value: string): boolean {
    const opt = this.getOption(value);
    return !!opt && opt.selected;
  }
  public hasSelected(): boolean {
    return this.options.some((item) => item.selected);
  }

  public isAllSelected(): boolean {
    return this.options.every((item) => item.selected);
  }

  public setAllSelected(state: boolean) {
    if (!this.multiple) return false;
    this.options.forEach((item: HTMLOptionElement) => item.selected = state);
    EventUtils.dispatch(this.$select, 'change');
  }

  // Proxy select methods and values
  public get value() {
    return this.$select?.value;
  }
  public get values() {
    return this.selectedOptions.map((item: HTMLOptionElement) => item.value);
  }

  public get form(): HTMLFormElement | null {
    return this.$select?.form;
  }

  public get name(): string {
    return this.$select?.name;
  }
  public set name(name: string) {
    this.$select && (this.$select.name = name);
  }

  public get required(): boolean {
    return this.$select?.required;
  }
  public set required(required: boolean) {
    this.$select && (this.$select.required = required);
  }

  // Validation API values
  public get validity(): ValidityState {
    return this.$select?.validity;
  }
  public get validationMessage(): string {
    return this.$select?.validationMessage;
  }
  public get willValidate(): boolean {
    return this.$select?.willValidate;
  }

  // Validation API methods
  public checkValidity(): boolean {
    return this.$select?.checkValidity();
  }
  public reportValidity(): boolean {
    return this.$select?.reportValidity();
  }
  public setCustomValidity(error: string): void {
    this.$select?.setCustomValidity(error);
  }
}

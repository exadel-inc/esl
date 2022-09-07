import {ESLBaseElement} from '../../../esl-base-element/core';
import {EventUtils} from '../../../esl-utils/dom/events';
import {bind} from '../../../esl-utils/decorators';

/** Interface for option definition */
export interface ESLSelectOption {
  /** Label text of the option */
  text: string;
  /** Value of the option */
  value: string;
  /** Disabled marker */
  disabled: boolean;
  /** Selected marker */
  selected: boolean;
  /** Initially selected marker */
  defaultSelected: boolean;
}

/** Interface to declare options source for select components */
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

/**
 * Base class for {@link HTMLSelectElement} wrapper element, implements {@link ESLSelectModel} options source
 */
export abstract class ESLSelectWrapper extends ESLBaseElement implements ESLSelectModel {
  protected static observationConfig: MutationObserverInit = {
    subtree: true,
    attributes: true,
    attributeFilter: ['value', 'selected', 'disabled'],
    childList: true,
    characterData: true
  };

  private _$select: HTMLSelectElement;
  private _mutationObserver = new MutationObserver(this._onTargetMutation.bind(this));

  /** Native select that is wrapped */
  public get $select(): HTMLSelectElement {
    return this._$select;
  }
  public set $select(select: HTMLSelectElement) {
    const prev = this._$select;
    this._$select = select;
    this._onTargetChange(select, prev);
  }

  protected connectedCallback(): void {
    super.connectedCallback();
    this.ownerDocument.addEventListener('reset', this._onReset);
  }

  protected disconnectedCallback(): void {
    super.disconnectedCallback();
    this.ownerDocument.removeEventListener('reset', this._onReset);
    this._mutationObserver.disconnect();
    this._$select && this._$select.removeEventListener('change', this._onChange);
  }

  protected _onChange(event?: Event): void {}
  protected _onListChange(): void {}
  protected _onTargetChange(newTarget: HTMLSelectElement | undefined,
                            oldTarget: HTMLSelectElement | undefined): void {
    if (oldTarget) oldTarget.removeEventListener('change', this._onChange);
    if (newTarget) newTarget.addEventListener('change', this._onChange);
    this._mutationObserver.disconnect();
    const type = (this.constructor as typeof ESLSelectWrapper);
    if (newTarget) this._mutationObserver.observe(newTarget, type.observationConfig);
  }
  protected _onTargetMutation(changes: MutationRecord[]): void {
    const isListChange = (change: MutationRecord): boolean => change.addedNodes.length + change.removedNodes.length > 0;
    changes.some(isListChange) ? this._onListChange() : this._onChange();
  }

  @bind
  protected _onReset(event: Event): void {
    if (!event.target || event.target !== this.form) return;
    setTimeout(() => this._onChange(event));
  }

  public get multiple(): boolean {
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

  public setSelected(value: string, state: boolean): void {
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
    return this.options.every((item) => item.selected || item.disabled);
  }

  public setAllSelected(state: boolean): void {
    if (!this.multiple) return;
    this.options.forEach((item: HTMLOptionElement) => item.selected = !item.disabled && state);
    EventUtils.dispatch(this.$select, 'change');
  }

  // Proxy select methods and values
  public get value(): string | undefined {
    return this.$select?.value;
  }
  public get values(): string[] {
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

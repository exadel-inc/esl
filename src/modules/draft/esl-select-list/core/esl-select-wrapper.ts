import {ESLBaseElement} from '../../../esl-base-element/core';
import {EventUtils} from '../../../esl-utils/dom/events';

export interface ESLSelectOption {
  text: string;
  value: string;
  selected: boolean;
}

export interface ESLSelectModel {
  /** Get list of options */
  options: ESLSelectOption[];
  /** Get list of selected options */
  selected: ESLSelectOption[];

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

  public get select() {
    return this._$select;
  }
  public set select(select: HTMLSelectElement) {
    const prev = this._$select;
    this._$select = select;
    this._onTargetChange(select, prev);
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();
    if (this._$select) this._$select.removeEventListener('change', this._onChange);
  }

  protected _onChange(event?: Event) {}
  protected _onTargetChange(newTarget: HTMLSelectElement | undefined,
                            oldTarget: HTMLSelectElement | undefined) {
    if (oldTarget) oldTarget.removeEventListener('change', this._onChange);
    if (newTarget) newTarget.addEventListener('change', this._onChange);
  }

  public get options(): ESLSelectOption[] {
    return this._$select ? Array.from(this._$select.options) : [];
  }
  public get selected(): ESLSelectOption[] {
    return this.options.filter((item) => item.selected);
  }

  protected getOption(value: string): ESLSelectOption | undefined {
    return this.options.find((item) => item.value === value);
  }

  public setSelected(value: string, state: boolean) {
    const option = this.getOption(value);
    option && (option.selected = state);
    EventUtils.dispatch(this._$select, 'change');
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
    this.options.forEach((item) => item.selected = state);
    EventUtils.dispatch(this._$select, 'change');
  }
}

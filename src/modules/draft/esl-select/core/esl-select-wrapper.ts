import {ESLBaseElement} from '../../../esl-base-element/core';

export abstract class ESLSelectWrapper extends ESLBaseElement {

  protected $select: HTMLSelectElement;

  /** Event callback */
  protected abstract _onChange(): void;

  // Model methods
  /** Get list of options */
  public get options(): HTMLOptionElement[] {
    return this.$select ? Array.from(this.$select.options) : [];
  }
  /** Get list of selected options */
  public get selected(): HTMLOptionElement[] {
    return this.options.filter((item) => item.selected);
  }

  /** Has selected options */
  public get hasValue(): boolean {
    return this.options.some((item) => item.selected);
  }

  /** Get option with passed value */
  public get(value: string): HTMLOptionElement | undefined {
    return this.options.find((item) => item.value === value);
  }
  /** Toggle option with passed value to the state */
  public set(value: string, state: boolean) {
    const option = this.get(value);
    option && (option.selected = state);
    this._onChange();
  }
  /** Check selected state*/
  public isSelected(value: string): boolean {
    const opt = this.get(value);
    return !!opt && opt.selected;
  }

  /** Toggle all options to the state */
  public setAll(state: boolean) {
    this.options.forEach((item) => item.selected = state);
    this._onChange();
  }
}

import {ESLBaseElement} from '../../../esl-base-element/core';
import {EventUtils} from '../../../esl-utils/dom/events';

export abstract class ESLSelectWrapper extends ESLBaseElement {
  private _$select: HTMLSelectElement;

  public get select() {
    return this._$select;
  }
  public set select(select: HTMLSelectElement) {
    const prev = this._$select;
    this._$select = select;
    this._onSelectChange(select, prev);
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();
    if (this._$select) this._$select.removeEventListener('change', this._onChange);
  }

  protected _onChange(event?: Event) {}
  protected _onSelectChange(newTarget: HTMLSelectElement | undefined,
                            oldTarget: HTMLSelectElement | undefined) {
    if (oldTarget) oldTarget.removeEventListener('change', this._onChange);
    if (newTarget) newTarget.addEventListener('change', this._onChange);
  }

  // Model methods
  /** Get list of options */
  public get options(): HTMLOptionElement[] {
    return this._$select ? Array.from(this._$select.options) : [];
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
  public getOption(value: string): HTMLOptionElement | undefined {
    return this.options.find((item) => item.value === value);
  }
  /** Toggle option with passed value to the state */
  public setSelected(value: string, state: boolean) {
    const option = this.getOption(value);
    option && (option.selected = state);
    EventUtils.dispatch(this._$select, 'change');
  }
  /** Check selected state*/
  public isSelected(value: string): boolean {
    const opt = this.getOption(value);
    return !!opt && opt.selected;
  }

  /** Toggle all options to the state */
  public setAllSelected(state: boolean) {
    this.options.forEach((item) => item.selected = state);
    EventUtils.dispatch(this._$select, 'change');
  }
}

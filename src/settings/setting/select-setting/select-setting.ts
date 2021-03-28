import {attr} from '@exadel/esl/modules/esl-base-element/core';
import {UIPSetting} from '../setting';
import {ESLSelect} from "@exadel/esl";

export class UIPSelectSetting extends UIPSetting {
  public static is = 'uip-select-setting';
  protected $field: ESLSelect;

  @attr({defaultValue: 'replace'}) mode: 'replace' | 'append';

  protected initField() {
    this.$field = new ESLSelect();
    this.$field.name = this.label || '';

    const select = document.createElement('select');
    this.querySelectorAll('option').forEach(option => select.add(option));

    this.$field.$select = select;
  }

  protected render(): void {
    this.appendChild(this.$field);
  }

  protected getDisplayedValue(): string | boolean {
    return this.$field.value;
  }

  protected setValue(value: string): void {
    this.$field.setSelected(value, true);
  }

  protected setInconsistency(): void {
  }

  protected isValid(): boolean {
    return true;
  }
}


import {attr} from '@exadel/esl/modules/esl-base-element/core';
import {UIPSetting} from '../setting';
import {ESLSelect} from "@exadel/esl";

export class UIPSelectSetting extends UIPSetting {
  public static is = 'uip-select-setting';
  protected $field: ESLSelect;

  @attr({defaultValue: 'replace'}) mode: 'replace' | 'append';

  get values(): string[] {
    return this.$field.options.map(opt => opt.value);
  }

  protected connectedCallback() {
    super.connectedCallback();

    this.$field = new ESLSelect();
    this.$field.name = this.label || '';

    const select = document.createElement('select');
    this.querySelectorAll('option').forEach(option => select.add(option));
    select.multiple = true;

    this.$field.$select = select;
    this.render();
  }

  protected render(): void {
    this.innerHTML = '';
    this.appendChild(this.$field);
  }

  protected getDisplayedValue(): string | boolean {
    return this.$field.values.join(' ');
  }

  protected setValue(value: string): void {
    value.split(' ').forEach(opt => this.$field.setSelected(opt, true));
  }

  protected setInconsistency(): void {
  }

  protected isValid(): boolean {
    return true;
  }
}


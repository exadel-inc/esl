import {UIPSetting} from '../setting';
import {attr} from '@exadel/esl/modules/esl-base-element/core';

export class UIPTextSetting extends UIPSetting {
  public static is = 'uip-text-setting';

  @attr({defaultValue: ''}) public label: string;
  protected $field: HTMLInputElement;

  protected connectedCallback() {
    super.connectedCallback();

    this.$field = document.createElement('input');
    this.$field.type = 'text';
    this.$field.name = this.label;

    const label = document.createElement('label');
    label.innerText = this.label;
    label.appendChild(this.$field);
    this.appendChild(label);
  }

  protected getDisplayedValue(): string {
    return this.$field.value;
  }

  protected setValue(value: string): void {
    this.$field.value = value;
    this.$field.placeholder = '';
  }

  protected setInconsistency(): void {
    this.$field.value = '';
    this.$field.placeholder = 'Multiple values';
  }
}

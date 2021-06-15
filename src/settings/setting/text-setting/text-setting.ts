import {attr} from '@exadel/esl/modules/esl-base-element/core';

import {UIPSetting} from '../setting';
import {WARN} from '../../../utils/warn-messages/warn';

export class UIPTextSetting extends UIPSetting {
  public static is = 'uip-text-setting';

  @attr({defaultValue: ''}) public label: string;
  protected $field: HTMLInputElement;

  protected connectedCallback() {
    super.connectedCallback();
    if (this.$field) return;

    this.$field = document.createElement('input');
    this.$field.type = 'text';
    this.$field.name = this.label;

    const label = document.createElement('label');
    label.innerText = this.label;
    label.appendChild(this.$field);

    this.innerHTML = '';
    this.appendChild(label);
  }

  protected getDisplayedValue(): string {
    return this.$field.value;
  }

  protected setValue(value: string | null): void {
    this.$field.value = value || '';
    this.$field.placeholder = '';
  }

  protected setInconsistency(msg = WARN.inconsistent): void {
    this.$field.value = '';
    this.$field.placeholder = msg;
  }
}

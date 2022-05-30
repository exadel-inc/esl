import {attr} from '@exadel/esl/modules/esl-base-element/core';
import {memoize} from '@exadel/esl/modules/esl-utils/decorators/memoize';

import {UIPSetting} from '../../plugins/settings/setting';
import {WARNING_MSG} from '../../utils/warning-msg';

/**
 * Custom setting for inputting attribute's value.
 * @extends UIPSetting
 */
export class UIPTextSetting extends UIPSetting {
  public static is = 'uip-text-setting';

  /** Setting's visible name. */
  @attr({defaultValue: ''}) public label: string;

  /** Text input to change setting's value. */
  @memoize()
  protected get $field(): HTMLInputElement {
    const $field = document.createElement('input');
    $field.type = 'text';
    $field.name = this.label;
    return $field;
  }

  protected connectedCallback() {
    super.connectedCallback();

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

  protected setInconsistency(msg = WARNING_MSG.inconsistent): void {
    this.$field.value = '';
    this.$field.placeholder = msg;
  }
}

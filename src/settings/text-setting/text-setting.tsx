import {attr} from '@exadel/esl/modules/esl-base-element/core';
import {memoize} from '@exadel/esl/modules/esl-utils/decorators/memoize';

import {UIPSetting} from '../../plugins/settings/setting';
import {WARNING_MSG} from '../../utils/warning-msg';

import * as React from 'jsx-dom';

/**
 * Custom setting for inputting attribute's value
 * @extends UIPSetting
 */
export class UIPTextSetting extends UIPSetting {
  public static is = 'uip-text-setting';

  /** Setting's visible name */
  @attr({defaultValue: ''}) public label: string;

  /** Text input to change setting's value */
  @memoize()
  protected get $field() {
    return <input type="text" name={this.label}/> as HTMLInputElement;
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.innerHTML = '';

    const $inner = <label>
      {this.label}
      {this.$field}
    </label>;

    this.appendChild($inner);
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

  set disabled(force: boolean) {
    this.$field.toggleAttribute('disabled', force);
  }
}

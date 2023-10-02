import React from 'jsx-dom';

import {attr, memoize} from '@exadel/esl/modules/esl-utils/decorators';

import {UIPSetting} from '../setting';

/**
 * Custom setting for inputting attribute's value
 */
export class UIPTextSetting extends UIPSetting {
  public static is = 'uip-text-setting';

  /** Setting's visible name */
  @attr({defaultValue: ''}) public label: string;

  /** Text input to change setting's value */
  @memoize()
  protected get $field(): HTMLInputElement {
    return <input type="text" name={this.label}/> as HTMLInputElement;
  }

  protected override connectedCallback(): void {
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

  protected setInconsistency(msg = this.INCONSISTENT_VALUE_MSG): void {
    this.$field.value = '';
    this.$field.placeholder = msg;
  }

  set disabled(force: boolean) {
    this.$field.toggleAttribute('disabled', force);
  }
}

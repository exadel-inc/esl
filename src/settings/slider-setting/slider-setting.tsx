import {attr} from '@exadel/esl/modules/esl-base-element/core';
import {memoize} from '@exadel/esl/modules/esl-utils/decorators/memoize';
import {listen} from '@exadel/esl/modules/esl-utils/decorators/listen';

import {UIPSetting} from '../../plugins/settings/setting';
import {WARNING_MSG} from '../../utils/warning-msg';

import * as React from 'jsx-dom';

export class UIPSliderSetting extends UIPSetting {
  public static is = 'uip-slider-setting';

  /** Setting's visible name. */
  @attr({defaultValue: ''}) public label: string;
  /** Minimum range value. */
  @attr({defaultValue: '0'}) public min: string;
  /** Maximum range value. */
  @attr({defaultValue: '0'}) public max: string;
  /** Step for range. */
  @attr({defaultValue: '0'}) public step: string;

  protected connectedCallback() {
    super.connectedCallback();

    const inner =
      <>
        <label>
          <span>{this.label}</span>
          {this.$field}
        </label>
        {this.$fieldValue}
      </>;

    this.append(inner);
  }

  protected disconnectedCallback() {
    this.innerHTML = '';
    super.disconnectedCallback();
  }

  /** Range input to change setting's value */
  @memoize()
  protected get $field() {
    return <input type="range" min={this.min} max={this.max} step={this.step}/> as HTMLInputElement;
  }

  /** Container for current value */
  @memoize()
  protected get $fieldValue() {
    return <div className="slider-value"></div>;
  }

  /** Handles `input` event to display its current value */
  @listen('input')
  protected updateSliderValue() {
    this.$fieldValue.textContent = `Value: ${this.$field.value}`;
  }

  protected getDisplayedValue(): string {
    return this.$field.value;
  }

  protected setValue(value: string | null): void {
    this.$field.value = value || this.min;
    this.updateSliderValue();
  }

  protected setInconsistency(msg = WARNING_MSG.inconsistent): void {
    this.$field.value = this.min;
    this.$fieldValue.textContent = msg;
  }

  set disabled(force: boolean) {
    this.$fieldValue.classList.toggle('disabled', force);
    this.$field.toggleAttribute('disabled', force);
  }
}

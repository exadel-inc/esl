import React from 'jsx-dom';

import {attr, memoize, listen} from '@exadel/esl/modules/esl-utils/decorators';

import {UIPSetting} from '../base-setting/base-setting';
import type {UIPStateModel} from '../../../core/base/model';

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

  protected override connectedCallback(): void {
    super.connectedCallback();

    const $inner =
      <>
        <label>
          <span>{this.label}</span>
          {this.$field}
        </label>
        {this.$fieldValue}
      </>;

    this.append($inner);
  }

  protected override disconnectedCallback(): void {
    this.innerHTML = '';
    super.disconnectedCallback();
  }

  /** Range input to change setting's value */
  @memoize()
  protected get $field(): HTMLInputElement {
    return <input type="range" min={this.min} max={this.max} step={this.step}/> as HTMLInputElement;
  }

  /** Container for current value */
  @memoize()
  protected get $fieldValue(): HTMLElement {
    return <div className="slider-value"></div> as HTMLElement;
  }

  /** Handles `input` event to display its current value */
  @listen('input')
  protected updateSliderValue(): void {
    this.$fieldValue.textContent = `Value: ${this.$field.value}`;
  }

  updateFrom(model: UIPStateModel): void {
    super.updateFrom(model);
    const values = model.getAttribute(this.target, this.attribute);
    if (!values.length) {
      this.setInconsistency(this.NO_TARGET_MSG);
      return;
    }
    if (!values[0]) this.setInconsistency(this.NOT_VALUE_SPECIFIED_MSG);
  }

  protected getDisplayedValue(): string {
    return this.$field.value;
  }

  protected setValue(value: string | null): void {
    if (value) {
      this.$field.value = value;
      this.updateSliderValue();
    }
  }

  protected setInconsistency(msg = this.INCONSISTENT_VALUE_MSG): void {
    this.$fieldValue.textContent = msg;
  }

  public setDisabled(force: boolean): void {
    this.$fieldValue.classList.toggle('disabled', force);
    this.$field.toggleAttribute('disabled', force);
  }
}

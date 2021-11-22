import {UIPSetting} from '../setting/setting';
import {attr} from '@exadel/esl/modules/esl-base-element/core';
import {WARNING_MSG} from '../../utils/warning-msg';

export class UIPSliderSetting extends UIPSetting {
  public static is = 'uip-slider-setting';
  /** CSS Class added when setting has inconsistent state. */
  public static inconsistencyClass = 'inconsistency-marker';

  /** Setting's visible name. */
  @attr({defaultValue: ''}) public label: string;
  /** Minimum range value. */
  @attr({defaultValue: '0'}) public min: string;
  /** Maximum range value. */
  @attr({defaultValue: '100'}) public max: string;
  /** Step for range. */
  @attr({defaultValue: '1'}) public step: string;
  /** Range input to change setting's value. */
  protected $field: HTMLInputElement;
  /** Range value displayed below. */
  protected $fieldValue: HTMLDivElement;

  protected connectedCallback() {
    super.connectedCallback();
    if (this.$field) return;

    this.initSlider();
    this.initSliderValue();
    const label = document.createElement('label');
    label.innerText = this.label;
    label.appendChild(this.$field);

    this.innerHTML = '';
    this.append(label);
    this.append(this.$fieldValue);
  }

  protected initSlider() {
    this.$field = document.createElement('input');
    this.$field.type = 'range';
    this.$field.min = this.min;
    this.$field.max = this.max;
    this.$field.step = this.step;
    this.$field.name = this.label;
  }

  protected initSliderValue() {
    this.$fieldValue = document.createElement('div');
    this.$fieldValue.classList.add('slider-value');
    this.$field.addEventListener('input', () => this.updateSliderValue());
  }

  protected updateSliderValue() {
    this.$fieldValue.textContent = `Value: ${this.$field.value}`;
  }

  protected getDisplayedValue(): string {
    return this.$field.value;
  }

  protected setValue(value: string | null): void {
    this.$field.value = value || '0';
    this.updateSliderValue();
  }

  protected setInconsistency(msg = WARNING_MSG.inconsistent): void {
    this.$field.value = '0';
    this.$fieldValue.textContent = msg;
  }
}

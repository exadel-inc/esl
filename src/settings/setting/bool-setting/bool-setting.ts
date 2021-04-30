import {UIPSetting} from '../setting';
import {attr} from '@exadel/esl/modules/esl-base-element/core';
import {UIPStateModel} from '../../../utils/state-model/state-model';
import ArrayUtils from '../../../utils/array-utils/array-utils';

export class UIPBoolSetting extends UIPSetting {
  public static is = 'uip-bool-setting';
  public static inconsistentState = {
    message: '(multiple values)',
    class: 'inconsistency-marker'
  };

  @attr({defaultValue: ''}) public label: string;
  @attr({defaultValue: ''}) public value: string;
  @attr({defaultValue: 'replace'}) public mode: 'replace' | 'append';

  protected $field: HTMLInputElement;

  protected connectedCallback() {
    super.connectedCallback();

    this.$field = document.createElement('input');
    this.$field.type = 'checkbox';
    this.$field.name = this.label;

    const label = document.createElement('label');
    label.innerText = this.label;
    label.appendChild(this.$field);
    this.appendChild(label);
  }

  applyTo(model: UIPStateModel) {
    if (this.mode === 'replace') {
      super.applyTo(model);
      return;
    }

    const val = this.getDisplayedValue() as (string | false);

    model.transformAttribute(this.target, this.attribute, attrValue => {
      if (!attrValue) {
        return val || null;
      }

      const attrTokens = ArrayUtils.remove(attrValue.split(/\s+/), this.value);
      val && attrTokens.push(val);

      return attrTokens.join(' ');
    });
  }

  updateFrom(model: UIPStateModel) {
    const attrValues = model.getAttribute(this.target, this.attribute);

    if (this.mode === 'replace') {
      if ((attrValues[0] === null || attrValues[0] === this.value) &&
        attrValues.every(val => attrValues[0] === val)) {
        this.setValue(attrValues[0]);
      } else {
        this.setInconsistency();
      }

      return;
    }

    const valueMatch = attrValues.map(attrValue =>
      ArrayUtils.intersection([this.value], attrValue?.split(' ') || []));
    valueMatch.every(match => ArrayUtils.equals(match, valueMatch[0])) ?
      this.setValue(valueMatch[0].length ? this.value : null) : this.setInconsistency();
  }

  protected getDisplayedValue(): string | boolean {
    if (this.value) {
      return this.$field.checked ? this.value : false;
    }

    return this.$field.checked;
  }

  protected setValue(value: string | null): void {
    if (this.value) {
      this.$field.checked = value === this.value;
    } else {
      this.$field.checked = value !== null;
    }

    this.querySelector(`.${UIPBoolSetting.inconsistentState.class}`)?.remove();
  }

  protected setInconsistency(): void {
    this.$field.checked = false;
    this.querySelector(`.${UIPBoolSetting.inconsistentState.class}`)?.remove();

    const inconsistencyMarker = document.createElement('span');
    inconsistencyMarker.classList.add(UIPBoolSetting.inconsistentState.class);
    inconsistencyMarker.innerText = UIPBoolSetting.inconsistentState.message;

    this.appendChild(inconsistencyMarker);
  }
}

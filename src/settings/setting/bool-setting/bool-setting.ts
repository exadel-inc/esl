import {attr} from '@exadel/esl/modules/esl-base-element/core';

import {UIPSetting} from '../setting';
import {UIPStateModel} from '../../../utils/state-model/state-model';
import TokenListUtils from '../../../utils/array-utils/token-list-utils';
import {WARN} from "../../../utils/warn-messages/warn";

export class UIPBoolSetting extends UIPSetting {
  public static is = 'uip-bool-setting';
  public static inconsistencyClass = 'inconsistency-marker';

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

      const attrTokens = TokenListUtils.remove(TokenListUtils.split(attrValue), this.value);
      val && attrTokens.push(val);

      return attrTokens.join(' ');
    });
  }

  updateFrom(model: UIPStateModel) {
    const attrValues = model.getAttribute(this.target, this.attribute);

    if (!attrValues.length) return this.setInconsistency(WARN.noTarget);

    if (this.mode === 'replace') {
      if (attrValues.some(val => this.value ? val !== attrValues[0] : typeof val !== typeof attrValues[0])) {
        return this.setInconsistency(WARN.multiple);
      }

      return this.setValue((this.value && attrValues[0] !== this.value) ? null : attrValues[0]);
    }

    const valueMatch = attrValues.map(attrValue =>
      TokenListUtils.intersection([this.value], TokenListUtils.split(attrValue)));
    valueMatch.every(match => TokenListUtils.equals(match, valueMatch[0])) ?
      this.setValue(valueMatch[0].length ? this.value : null) : this.setInconsistency(WARN.multiple);
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

    this.querySelector(`.${UIPBoolSetting.inconsistencyClass}`)?.remove();
  }

  protected setInconsistency(msg=WARN.inconsistent): void {
    this.$field.checked = false;
    this.querySelector(`.${UIPBoolSetting.inconsistencyClass}`)?.remove();

    const inconsistencyMarker = document.createElement('span');
    inconsistencyMarker.classList.add(UIPBoolSetting.inconsistencyClass);
    inconsistencyMarker.innerText = `(${msg})`;

    this.appendChild(inconsistencyMarker);
  }
}

import {UIPSetting} from '../setting';
import {attr} from '@exadel/esl/modules/esl-base-element/core';
import {UIPStateModel} from '../../../utils/state-model/state-model';
import ArrayUtils from '../../../utils/array-utils/array-utils';

export class UIPBoolSetting extends UIPSetting {
  public static is = 'uip-bool-setting';
  protected $field: HTMLInputElement;

  @attr({defaultValue: ''}) value: string;
  @attr({defaultValue: 'replace'}) mode: 'replace' | 'append';

  protected initField() {
    this.$field = document.createElement('input');
    this.$field.type = 'checkbox';
    this.$field.name = this.label || '';
  }

  applyTo(model: UIPStateModel) {
    if (this.mode === 'replace') {
      super.applyTo(model);
      return;
    }

    const val = this.getDisplayedValue() as (string | false);
    const valRegex = new RegExp(/\b/.source + this.value + /\b/.source);

    model.transformAttribute(this.target, this.attribute, attrValue => {
      return attrValue === null ? val || null : attrValue.replace(valRegex, '') + ` ${val || ''}`;
    });
  }

  updateFrom(model: UIPStateModel) {
    const attrValues = model.getAttribute(this.target, this.attribute);

    if (this.mode === 'replace') {
      if ((attrValues[0] === null || attrValues[0] === this.value) && attrValues.every(val => attrValues[0] === val)) {
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

  protected render() {
    this.innerHTML = '';
    this.appendChild(this.$field);
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
  }

  // TODO: implement inconsistency state for boolean setting
  protected setInconsistency(): void {

  }

  protected isValid(): boolean {
    return true;
  }
}

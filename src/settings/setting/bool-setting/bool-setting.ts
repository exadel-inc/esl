import {attr} from '@exadel/esl/modules/esl-base-element/core';

import {UIPSetting} from '../setting';
import {UIPStateModel} from '../../../utils/state-model/state-model';
import TokenListUtils from '../../../utils/array-utils/token-list-utils';
import {WARN} from '../../../utils/warn-messages/warn';

export class UIPBoolSetting extends UIPSetting {
  public static is = 'uip-bool-setting';
  public static inconsistencyClass = 'inconsistency-marker';

  @attr({defaultValue: ''}) public label: string;
  @attr({defaultValue: ''}) public value: string;
  @attr({defaultValue: 'replace'}) public mode: 'replace' | 'append';

  protected $field: HTMLInputElement;

  protected connectedCallback() {
    super.connectedCallback();
    if (this.$field) return;

    this.$field = document.createElement('input');
    this.$field.type = 'checkbox';
    this.$field.name = this.label;

    const label = document.createElement('label');
    label.innerText = this.label;
    label.appendChild(this.$field);

    this.innerHTML = '';
    this.appendChild(label);
  }

  applyTo(model: UIPStateModel) {
    if (this.mode === 'replace') return super.applyTo(model);

    const val = this.getDisplayedValue();

    model.transformAttribute(this.target, this.attribute, attrValue => {
      if (!attrValue) return val || null;

      const attrTokens = TokenListUtils.remove(TokenListUtils.split(attrValue), this.value);
      val && attrTokens.push(this.value);

      return TokenListUtils.join(attrTokens);
    });
  }

  updateFrom(model: UIPStateModel) {
    const attrValues = model.getAttribute(this.target, this.attribute);

    if (!attrValues.length) return this.setInconsistency(WARN.noTarget);

    this.mode === 'replace' ? this.updateReplace(attrValues) : this.updateAppend(attrValues);
  }

  protected updateReplace(attrValues: (string | null)[]): void {
    if (!TokenListUtils.hasEqualsElements(attrValues)) {
      return this.setInconsistency(WARN.multiple);
    }

    return this.setValue((this.value && attrValues[0] !== this.value) ? null : attrValues[0]);
  }

  protected updateAppend(attrValues: (string | null)[]): void {
    const containsFunction = (val: string | null) =>
      TokenListUtils.contains(TokenListUtils.split(val), [this.value]);

    if (attrValues.every(containsFunction)) return this.setValue(this.value);
    if (!attrValues.some(containsFunction)) return this.setValue(null);

    return this.setInconsistency(WARN.multiple);
  }

  protected getDisplayedValue(): string | false {
    if (this.value) {
      return this.$field.checked ? this.value : false;
    }

    return this.$field.checked ? '' : false;
  }

  protected setValue(value: string | null): void {
    if (this.value) {
      this.$field.checked = value === this.value;
    } else {
      this.$field.checked = value !== null;
    }

    this.querySelector(`.${UIPBoolSetting.inconsistencyClass}`)?.remove();
  }

  protected setInconsistency(msg = WARN.inconsistent): void {
    this.$field.checked = false;
    this.querySelector(`.${UIPBoolSetting.inconsistencyClass}`)?.remove();

    const inconsistencyMarker = document.createElement('span');
    inconsistencyMarker.classList.add(UIPBoolSetting.inconsistencyClass);
    inconsistencyMarker.innerText = `(${msg})`;

    this.appendChild(inconsistencyMarker);
  }
}

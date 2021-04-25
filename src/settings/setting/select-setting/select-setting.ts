import {attr, boolAttr} from '@exadel/esl/modules/esl-base-element/core';
import {UIPSetting} from '../setting';
import {ESLSelect} from '@exadel/esl';
import {UIPStateModel} from '../../../utils/state-model/state-model';
import ArrayUtils from '../../../utils/array-utils/array-utils';

export class UIPSelectSetting extends UIPSetting {
  public static is = 'uip-select-setting';
  protected $field: ESLSelect;
  static inconsistentState = {
    value: 'inconsistent',
    text: 'Inconsistent value'
  };

  @attr({defaultValue: 'replace'}) mode: 'replace' | 'append';
  @boolAttr() multiple: boolean;

  get values(): string[] {
    return this.$field.options.map(opt => opt.value);
  }

  protected initField() {
    this.$field = new ESLSelect();
    this.$field.name = this.label || '';

    const select = document.createElement('select');
    select.setAttribute('esl-select-target', '');
    this.querySelectorAll('option').forEach(option => select.add(option));
    select.multiple = this.multiple;
    select.addEventListener('change', () => {
      select.remove(this.values.indexOf(UIPSelectSetting.inconsistentState.value));
    });

    this.$field.appendChild(select);
  }

  applyTo(model: UIPStateModel) {
    if (this.mode === 'replace') {
      super.applyTo(model);
      return;
    }

    const val = this.getDisplayedValue();
    const optRegex = (opt: string) => new RegExp(` ?${opt} ?`);

    model.transformAttribute(this.target, this.attribute, attrValue => {
      return attrValue === null ? val || null : this.values.reduce((outStr, option) =>
        outStr.replace(optRegex(option), ''), attrValue) + `${val ? ' ' + val : ''}`;
    });
  }

  updateFrom(model: UIPStateModel) {
    const settingOptions = this.values;
    const attrValues = model.getAttribute(this.target, this.attribute);

    if (this.mode === 'replace') {
      if (attrValues[0] && ArrayUtils.contains(settingOptions, attrValues[0].split(' ')) &&
        attrValues.every(val => val === attrValues[0])) {
        this.setValue(attrValues[0]);
      } else {
        this.setInconsistency();
      }

      return;
    }

    const attrTokens = attrValues.map(value => value?.split(' ') || []);
    const valueTokens = ArrayUtils.intersection(settingOptions, ...attrTokens);
    valueTokens.length ? this.setValue(valueTokens.join(' ')) : this.setInconsistency();
  }

  protected getDisplayedValue(): string {
    return this.$field.values.join(' ');
  }

  protected setValue(value: string): void {
    this.reset();

    this.$field.removeEventListener('change', this._onChange);
    value.split(' ').forEach(opt => this.$field.setSelected(opt, true));
    this.$field.addEventListener('change', this._onChange);
  }

  protected setInconsistency(): void {
    this.reset();

    const inconsistentOption = new Option(UIPSelectSetting.inconsistentState.text,
      UIPSelectSetting.inconsistentState.value, false, true);
    inconsistentOption.disabled = true;

    this.$field.$select.add(inconsistentOption, 0);
    this.$field.update();
  }

  protected reset(): void {
    this.$field.options.forEach(opt => opt.selected = false);
    this.$field.$select.remove(this.values.indexOf(UIPSelectSetting.inconsistentState.value));
  }

  protected isValid(): boolean {
    return true;
  }
}

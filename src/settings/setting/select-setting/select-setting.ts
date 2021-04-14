import {attr, boolAttr} from '@exadel/esl/modules/esl-base-element/core';
import {UIPSetting} from '../setting';
import {ESLSelect} from '@exadel/esl';
import {UIPStateModel} from '../../../utils/state-model/state-model';
import ArrayUtils from '../../../utils/array-utils/array-utils';

export class UIPSelectSetting extends UIPSetting {
  public static is = 'uip-select-setting';
  protected $field: ESLSelect;
  protected inconsistentMessage = 'Inconsistency value';

  @attr({defaultValue: 'replace'}) mode: 'replace' | 'append';
  @boolAttr() multiple: boolean;

  get values(): string[] {
    return this.$field.options.map(opt => opt.value);
  }

  protected initField() {
    this.$field = new ESLSelect();
    this.$field.name = this.label || '';

    const select = document.createElement('select');
    this.querySelectorAll('option').forEach(option => select.add(option));
    select.multiple = this.multiple;

    this.$field.$select = select;
  }

  applyTo(model: UIPStateModel) {
    if (this.mode === 'replace') {
      super.applyTo(model);
      return;
    }

    const val = this.getDisplayedValue();
    const optRegex = (opt: string) => new RegExp(/\b/.source + opt + /\b/.source);

    model.transformAttribute(this.target, this.attribute, attrValue => {
      return attrValue === null ? val || null : this.values.reduce((outStr, option) =>
          outStr.replace(optRegex(option), ''), attrValue) + ` ${val}`;
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

  protected render(): void {
    this.innerHTML = '';
    this.appendChild(this.$field);
  }

  protected getDisplayedValue(): string {
    return this.$field.values.join(' ');
  }

  protected setValue(value: string): void {
    this.reset();
    value.split(' ').forEach(opt => this.$field.setSelected(opt, true));
  }

  protected setInconsistency(): void {
    this.reset();
    this.$field.$select.add(new Option(this.inconsistentMessage, this.inconsistentMessage));
    this.$field.setSelected(this.inconsistentMessage, true);
  }

  protected reset(): void {
    this.values.forEach(opt => this.$field.setSelected(opt, false));
    this.$field.$select.remove(this.values.indexOf(this.inconsistentMessage));
  }

  protected isValid(): boolean {
    return true;
  }
}

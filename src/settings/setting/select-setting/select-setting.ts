import {attr, boolAttr} from '@exadel/esl/modules/esl-base-element/core';
import {UIPSetting} from '../setting';
import {ESLSelect} from '@exadel/esl';
import {UIPStateModel} from '../../../utils/state-model/state-model';
import ArrayUtils from '../../../utils/array-utils/array-utils';

export class UIPSelectSetting extends UIPSetting {
  public static is = 'uip-select-setting';
  protected $field: ESLSelect;

  @attr({defaultValue: 'replace'}) mode: 'replace' | 'append';
  @boolAttr() multiple: boolean;

  get values(): string[] {
    return this.$field.options.map(opt => opt.value);
  }

  protected connectedCallback() {
    super.connectedCallback();

    this.$field = new ESLSelect();
    this.$field.name = this.label || '';

    const select = document.createElement('select');
    this.querySelectorAll('option').forEach(option => select.add(option));
    select.multiple = this.multiple;

    this.$field.$select = select;
    this.render();
  }

  applyTo(model: UIPStateModel) {
    if (this.mode === 'replace') {
      super.applyTo(model);
      return;
    }

    const val = this.getDisplayedValue();

    if (val) {
      model.transformAttribute(this.target, this.attribute, (attrValue) => {
        return this.values.reduce((outStr, option) =>
            outStr.replace(new RegExp(/\b/.source + option + /\b/.source), ''), attrValue || '') +
          ` ${val}`;
      });
    } else {
      model.transformAttribute(this.target, this.attribute, (attrValue) => {
        return attrValue && this.values.reduce((outStr, option) =>
          outStr.replace(new RegExp(/\b/.source + option + /\b/.source), ''), attrValue);
      });
    }
  }

  updateFrom(model: UIPStateModel) {
    const settingOptions = this.values;
    const attrTokens = model.getAttribute(this.target, this.attribute).map(value => value ? value.split(' ') : []);

    if (attrTokens.some(tokens => !tokens.length)) {
      this.setInconsistency();
      return;
    }

    if (this.mode === 'append') {
      const valueTokens = ArrayUtils.intersection(ArrayUtils.select(attrTokens[0], settingOptions), ...attrTokens);
      valueTokens.length ? this.setValue(valueTokens.join(' ')) : this.setInconsistency();

      return;
    }

    ArrayUtils.contains(settingOptions, attrTokens[0]) &&
    attrTokens.every(tokens => tokens && ArrayUtils.equals(tokens, attrTokens[0])) ?
      this.setValue(attrTokens[0].join(' ')) : this.setInconsistency();
  }

  protected render(): void {
    this.innerHTML = '';
    this.appendChild(this.$field);
  }

  protected getDisplayedValue(): string {
    return this.$field.values.join(' ');
  }

  protected setValue(value: string): void {
    value.split(' ').forEach(opt => this.$field.setSelected(opt, true));
  }

  protected setInconsistency(): void {
  }

  protected isValid(): boolean {
    return true;
  }
}


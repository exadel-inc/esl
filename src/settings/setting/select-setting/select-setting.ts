import {attr, boolAttr} from '@exadel/esl/modules/esl-base-element/core';
import {ESLSelect} from '@exadel/esl';
import {generateUId} from '@exadel/esl/modules/esl-utils/misc/uid';

import {UIPSetting} from '../setting';
import {UIPStateModel} from '../../../utils/state-model/state-model';
import TokenListUtils from '../../../utils/array-utils/token-list-utils';
import {WARN} from "../../../utils/warn-messages/warn";

export class UIPSelectSetting extends UIPSetting {
  public static is = 'uip-select-setting';
  public static inconsistentValue = 'inconsistent';

  @attr({defaultValue: ''}) public label: string;
  @attr({defaultValue: 'replace'}) public mode: 'replace' | 'append';
  @boolAttr() public multiple: boolean;

  protected $field: ESLSelect;

  get values(): string[] {
    return this.$field.options.map(opt => opt.value);
  }

  protected connectedCallback() {
    super.connectedCallback();

    this.$field = new ESLSelect();
    this.$field.name = this.label;
    this.initSelect();

    const label = document.createElement('label');
    label.innerText = this.label;
    label.htmlFor = this.$field.$select.id;

    this.appendChild(label);
    this.appendChild(this.$field);
  }

  protected initSelect(): void {
    const select = document.createElement('select');
    select.setAttribute('esl-select-target', '');
    select.multiple = this.multiple;
    select.id = `${UIPSelectSetting.is}-${generateUId()}`;

    this.querySelectorAll('option').forEach(option => select.add(option));
    select.addEventListener('change', () => {
      select.remove(this.values.indexOf(UIPSelectSetting.inconsistentValue));
    });

    this.$field.$select = select;
    this.$field.appendChild(select);
  }

  applyTo(model: UIPStateModel) {
    if (this.mode === 'replace') {
      super.applyTo(model);
      return;
    }

    const val = this.getDisplayedValue();

    model.transformAttribute(this.target, this.attribute, attrValue => {
      if (!attrValue) {
        return val || null;
      }

      const attrTokens = this.values.reduce((tokens, option) =>
        TokenListUtils.remove(tokens, option), TokenListUtils.split(attrValue));
      val && attrTokens.push(val);

      return attrTokens.join(' ');
    });
  }

  updateFrom(model: UIPStateModel) {
    this.reset();
    const settingOptions = this.values;
    const attrValues = model.getAttribute(this.target, this.attribute);

    if (!attrValues.length) return this.setInconsistency(WARN.noTarget);

    if (this.mode === 'replace') {
      if (attrValues.some(val => val !== attrValues[0])) return this.setInconsistency(WARN.multiple);
      if (attrValues[0] && TokenListUtils.contains(settingOptions, TokenListUtils.split(attrValues[0]))) {
        return this.setValue(attrValues[0]);
      }

      return this.setInconsistency(WARN.noMatch);
    }

    const optionsMatch = attrValues.map(attrValue =>
      TokenListUtils.intersection(settingOptions, TokenListUtils.split(attrValue)));
    const commonOptions = TokenListUtils.intersection(...optionsMatch);

    if (this.multiple || commonOptions.length) return this.setValue(commonOptions.join(' '));
    optionsMatch.some(match => match.length) ?
      this.setInconsistency(WARN.multiple) : this.setInconsistency(WARN.noMatch);
  }

  protected getDisplayedValue(): string {
    return this.$field.values.join(' ');
  }

  protected setValue(value: string): void {
    this.reset();

    this.removeEventListener(UIPSelectSetting.changeEvent, this._onChange);
    value.split(' ').forEach(opt => this.$field.setSelected(opt, true));
    this.addEventListener(UIPSelectSetting.changeEvent, this._onChange);
  }

  protected setInconsistency(msg=WARN.inconsistent): void {
    this.reset();

    const inconsistentOption = new Option(msg, UIPSelectSetting.inconsistentValue,
      false, true);
    inconsistentOption.disabled = true;

    this.$field.$select.add(inconsistentOption, 0);
    this.$field.update();
  }

  protected reset(): void {
    this.$field.options.forEach(opt => opt.selected = false);
    this.$field.$select.remove(this.values.indexOf(UIPSelectSetting.inconsistentValue));
  }
}

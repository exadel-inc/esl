import {attr, boolAttr} from '@exadel/esl/modules/esl-base-element/core';
import {ESLSelect} from '@exadel/esl';
import {generateUId} from '@exadel/esl/modules/esl-utils/misc/uid';

import {UIPSetting} from '../setting';
import {UIPStateModel} from '../../../core/state-model';
import TokenListUtils from '../../../utils/array-utils/token-list-utils';
import {WARN} from '../../../utils/warn-messages/warn';

export class UIPSelectSetting extends UIPSetting {
  public static is = 'uip-select-setting';
  public static inconsistentValue = 'inconsistent';

  @attr({defaultValue: ''}) public label: string;
  @attr({defaultValue: 'replace'}) public mode: 'replace' | 'append';
  @boolAttr() public multiple: boolean;

  protected $field: ESLSelect;

  protected get settingOptions(): string[] {
    return this.$field.options.map(opt => opt.value);
  }

  protected connectedCallback() {
    super.connectedCallback();
    if (this.$field) return;

    this.$field = new ESLSelect();
    this.$field.name = this.label;
    this.initSelect();

    const label = document.createElement('label');
    label.innerText = this.label;
    label.htmlFor = this.$field.$select.id;
    this.appendChild(label);

    this.innerHTML = '';
    this.appendChild(this.$field);
  }

  protected initSelect(): void {
    const select = document.createElement('select');
    select.setAttribute('esl-select-target', '');
    select.multiple = this.multiple;
    select.id = `${UIPSelectSetting.is}-${generateUId()}`;

    this.querySelectorAll('option').forEach(option => select.add(option));

    select.addEventListener('change', () => {
      select.remove(this.settingOptions.indexOf(UIPSelectSetting.inconsistentValue));
    });

    this.$field.$select = select;
    this.$field.appendChild(select);
  }

  applyTo(model: UIPStateModel) {
    if (this.mode === 'replace') return super.applyTo(model);

    const val = this.getDisplayedValue();

    model.transformAttribute(this.target, this.attribute, attrValue => {
      if (!attrValue) return val || null;

      const attrTokens = this.settingOptions.reduce((tokens, option) =>
        TokenListUtils.remove(tokens, option), TokenListUtils.split(attrValue));
      val && attrTokens.push(val);

      return TokenListUtils.join(attrTokens);
    }, this.settings);
  }

  updateFrom(model: UIPStateModel) {
    this.reset();
    const attrValues = model.getAttribute(this.target, this.attribute);

    if (!attrValues.length) return this.setInconsistency(WARN.noTarget);

    this.mode === 'replace' ? this.updateReplace(attrValues) : this.updateAppend(attrValues);
  }

  protected updateReplace(attrValues: (string | null)[]): void {
    if (!TokenListUtils.hasEqualsElements(attrValues)) return this.setInconsistency(WARN.multiple);

    if (attrValues[0] !== null &&
      TokenListUtils.contains(this.settingOptions, TokenListUtils.split(attrValues[0]))) {
      return this.setValue(attrValues[0]);
    }

    return this.multiple ? this.setValue('') : this.setInconsistency(WARN.noMatch);
  }

  protected updateAppend(attrValues: (string | null)[]): void {
    const commonOptions = TokenListUtils.intersection(
      ...attrValues.map(val => TokenListUtils.split(val)), this.settingOptions);

    if (this.multiple || commonOptions.length) return this.setValue(TokenListUtils.join(commonOptions));

    return this.setInconsistency(TokenListUtils.hasEqualsElements(attrValues) ?
      WARN.noMatch : WARN.multiple);
  }

  protected getDisplayedValue(): string {
    return this.$field.values.join(' ');
  }

  protected setValue(value: string): void {
    this.removeEventListener(UIPSelectSetting.changeEvent, this._onChange);
    value.split(' ').forEach(opt => this.$field.setSelected(opt, true));
    this.addEventListener(UIPSelectSetting.changeEvent, this._onChange);
  }

  protected setInconsistency(msg = WARN.inconsistent): void {
    const inconsistentOption = new Option(msg, UIPSelectSetting.inconsistentValue,
      false, true);
    inconsistentOption.disabled = true;

    this.$field.$select.add(inconsistentOption, 0);
    this.$field.update();
  }

  protected reset(): void {
    this.$field.options.forEach(opt => opt.selected = false);
    this.$field.$select.remove(this.settingOptions.indexOf(UIPSelectSetting.inconsistentValue));
  }
}

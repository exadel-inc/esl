import {attr, boolAttr} from '@exadel/esl/modules/esl-base-element/core';
import {UIPSetting} from '../setting';
import {ESLSelect} from '@exadel/esl';
import {UIPStateModel} from '../../../utils/state-model/state-model';
import ArrayUtils from '../../../utils/array-utils/array-utils';
import {generateUId} from '@exadel/esl/modules/esl-utils/misc/uid';

export class UIPSelectSetting extends UIPSetting {
  public static is = 'uip-select-setting';
  public static inconsistentState = {
    value: 'inconsistent',
    text: 'Multiple values'
  };

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
      select.remove(this.values.indexOf(UIPSelectSetting.inconsistentState.value));
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
        ArrayUtils.remove(tokens, option), attrValue.split(/\s+/));
      val && attrTokens.push(val);

      return attrTokens.join(' ');
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

    this.removeEventListener(UIPSelectSetting.changeEvent, this._onChange);
    value.split(' ').forEach(opt => this.$field.setSelected(opt, true));
    this.addEventListener(UIPSelectSetting.changeEvent, this._onChange);
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
}

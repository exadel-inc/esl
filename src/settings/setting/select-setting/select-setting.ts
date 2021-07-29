import {attr, boolAttr} from '@exadel/esl/modules/esl-base-element/core';
import {generateUId} from '@exadel/esl/modules/esl-utils/misc/uid';

import {UIPSetting} from '../setting';
import {ChangeAttrConfig, UIPStateModel} from '../../../core/state-model';
import TokenListUtils from '../../../utils/token-list/token-list-utils';
import {WARN} from '../../../utils/warn-messages/warn';

import type {ESLSelect} from '@exadel/esl/modules/esl-forms/esl-select/core';

/**
 * Custom setting for selecting attribute's value.
 * @extends UIPSetting
 */
export class UIPSelectSetting extends UIPSetting {
  public static is = 'uip-select-setting';
  /** Option displayed when setting has inconsistent state. */
  public static inconsistentValue = 'inconsistent';

  /** Setting's visible name. */
  @attr({defaultValue: ''}) public label: string;
  /**
   * Attribute to set mode for setting.
   * `replace` - replacing [attribute's]{@link UIPSetting#attribute} value with setting's value.
   * `append` - appending [attribute's]{@link UIPSetting#attribute} value to attribute's value.
   */
  @attr({defaultValue: 'replace'}) public mode: 'replace' | 'append';
  /** Indicates whether setting supports multiple values selected or not. */
  @boolAttr() public multiple: boolean;
  /** Select field to change setting's value. */
  protected $field: ESLSelect;

  protected get settingOptions(): string[] {
    return this.$field.options.map(opt => opt.value);
  }

  protected connectedCallback() {
    super.connectedCallback();
    if (this.$field) return;

    this.$field = document.createElement('esl-select') as ESLSelect;
    this.$field.name = this.label;
    this.initSelect();

    const label = document.createElement('label');
    label.innerText = this.label;
    label.htmlFor = this.$field.$select.id;
    this.appendChild(label);

    this.innerHTML = '';
    this.appendChild(this.$field);
  }

  /** Initialization of {@link ESLSelect}. */
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

    const cfg: ChangeAttrConfig = {
      target: this.target,
      attribute: this.attribute,
      modifier: this.settings,
      transform: this.transformValue.bind(this, this.getDisplayedValue())
    };

    model.changeAttribute(cfg);
  }

  transformValue(value: string, attrValue: string | null ) {
    if (!attrValue) return value || null;

    const attrTokens = this.settingOptions.reduce((tokens, option) =>
      TokenListUtils.remove(tokens, option), TokenListUtils.split(attrValue));
    value && attrTokens.push(value);

    return TokenListUtils.join(attrTokens);
  }

  updateFrom(model: UIPStateModel) {
    this.reset();
    const attrValues = model.getAttribute(this.target, this.attribute);

    if (!attrValues.length) return this.setInconsistency(WARN.noTarget);

    this.mode === 'replace' ? this.updateReplace(attrValues) : this.updateAppend(attrValues);
  }

  /** Update setting's value for replace {@link mode}. */
  protected updateReplace(attrValues: (string | null)[]): void {
    if (!TokenListUtils.hasSameElements(attrValues)) return this.setInconsistency(WARN.multiple);

    if (attrValues[0] !== null &&
      TokenListUtils.contains(this.settingOptions, TokenListUtils.split(attrValues[0]))) {
      return this.setValue(attrValues[0]);
    }

    return this.multiple ? this.setValue('') : this.setInconsistency(WARN.noMatch);
  }

  /** Update setting's value for append {@link mode}. */
  protected updateAppend(attrValues: (string | null)[]): void {
    const commonOptions = TokenListUtils.intersection(
      ...attrValues.map(val => TokenListUtils.split(val)), this.settingOptions);

    if (this.multiple || commonOptions.length) return this.setValue(TokenListUtils.join(commonOptions));

    return this.setInconsistency(TokenListUtils.hasSameElements(attrValues) ?
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

  /** Reset [select]{@link $field} value. */
  protected reset(): void {
    this.$field.options.forEach(opt => opt.selected = false);
    this.$field.$select.remove(this.settingOptions.indexOf(UIPSelectSetting.inconsistentValue));
  }

  public static register() {
    customElements.whenDefined('esl-select').then(() => super.register());
  }
}

import {attr, boolAttr, listen} from '@exadel/esl/modules/esl-base-element/core';
import {randUID} from '@exadel/esl/modules/esl-utils/misc/uid';
import {memoize} from '@exadel/esl/modules/esl-utils/decorators/memoize';
import type {ESLSelect} from '@exadel/esl/modules/esl-forms/esl-select/core';

import {UIPSetting} from '../../plugins/settings/setting';
import {ChangeAttrConfig, UIPStateModel} from '../../core/base/model';
import TokenListUtils from '../../utils/token-list-utils';
import {WARNING_MSG} from '../../utils/warning-msg';
import {UIPRoot} from '../../registration';


/**
 * Custom setting for selecting attribute's value
 * @extends UIPSetting
 */
export class UIPSelectSetting extends UIPSetting {
  public static is = 'uip-select-setting';
  /** Option displayed when setting has inconsistent state */
  public static inconsistentValue = 'inconsistent';
  /** CSS selector for dropdown element */
  private static dropdownClass = 'uip-select-dropdown';

  /** Setting's visible name */
  @attr({defaultValue: ''}) public label: string;
  /**
   * Attribute to set mode for setting
   * `replace` - replacing [attribute's]{@link UIPSetting#attribute} value with setting's value
   * `append` - appending [attribute's]{@link UIPSetting#attribute} value to attribute's value
   */
  @attr({defaultValue: 'replace'}) public mode: 'replace' | 'append';
  /** Indicates whether setting supports multiple values selected or not */
  @boolAttr() public multiple: boolean;
  /** Select field to change setting's value */
  @memoize()
  protected get $field(): ESLSelect {
    const $field = document.createElement('esl-select');
    $field.name = this.label;
    $field.dropdownClass = UIPSelectSetting.dropdownClass;
    $field.$select = this.select;
    $field.append(this.select);
    return $field;
  }

  /** Label element for input */
  @memoize()
  protected get $label(): HTMLLabelElement {
    const $label = document.createElement('label');
    $label.innerText = this.label;
    return $label;
  }

  /** Collects all options' values */
  @memoize()
  protected get settingOptions(): string[] {
    return this.$field.options.map(opt => opt.value);
  }

  /** Initialization of {@link ESLSelect} */
  @memoize()
  protected get select(): HTMLSelectElement {
    const select = document.createElement('select');
    select.setAttribute('esl-select-target', '');
    select.multiple = this.multiple;
    select.id = `${UIPSelectSetting.is}-${randUID()}`;
    this.querySelectorAll('option').forEach(option => select.add(option));
    return select;
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.$label.htmlFor = this.$field.$select.id;

    this.innerHTML = '';
    this.appendChild(this.$label);
    this.appendChild(this.$field);
  }

  applyTo(model: UIPStateModel) {
    if (this.mode === 'replace') return super.applyTo(model);

    const cfg: ChangeAttrConfig = {
      target: this.target,
      attribute: this.attribute,
      modifier: this.$settings,
      transform: this.transformValue.bind(this, this.getDisplayedValue())
    };

    model.changeAttribute(cfg);
  }

  /** Function to transform(update) attribute value */
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

    if (!attrValues.length) {
      this.disabled = true;
      return this.setInconsistency(WARNING_MSG.noTarget);
    }

    this.mode === 'replace' ? this.replaceFrom(attrValues) : this.appendFrom(attrValues);
  }

  /** Updates setting's value for replace {@link mode} */
  protected replaceFrom(attrValues: (string | null)[]): void {
    if (!TokenListUtils.hasSameElements(attrValues)) return this.setInconsistency(WARNING_MSG.multiple);

    if (attrValues[0] !== null &&
      TokenListUtils.contains(this.settingOptions, TokenListUtils.split(attrValues[0]))) {
      return this.setValue(attrValues[0]);
    }

    return this.multiple ? this.setValue('') : this.setInconsistency(WARNING_MSG.noMatch);
  }

  /** Updates setting's value for {@link mode} = "append" */
  protected appendFrom(attrValues: (string | null)[]): void {
    // array of each attribute's value intersection with select options
    const valuesOptions = attrValues.map(val => TokenListUtils.intersection(this.settingOptions, TokenListUtils.split(val)));

    // make empty option active if no options intersections among attribute values
    if (this.settingOptions.includes('') && valuesOptions.every(inter => !inter.length)) {
      return this.setValue('');
    }

    // common options among all attribute values
    const commonOptions = TokenListUtils.intersection(...valuesOptions);

    if (this.multiple || commonOptions.length) return this.setValue(TokenListUtils.join(commonOptions));

    return this.setInconsistency(TokenListUtils.hasSameElements(attrValues) ?
      WARNING_MSG.noMatch : WARNING_MSG.multiple);
  }

  protected getDisplayedValue(): string {
    return this.$field.values.join(' ');
  }

  protected setValue(value: string): void {
    this.$$off(this._onChange);
    value.split(' ').forEach(opt => this.$field.setSelected(opt, true));
    this.$$on(this._onChange);
  }

  protected setInconsistency(msg = WARNING_MSG.inconsistent): void {
    const inconsistentOption = new Option(msg, UIPSelectSetting.inconsistentValue,
      false, true);
    inconsistentOption.disabled = true;

    this.$field.$select.add(inconsistentOption, 0);
    this.$field.update();
  }

  /** Handles setting `change` event to clear inconsistent value */
  @listen('change')
  protected clearInconsistency(): void {
    this.select.remove(this.settingOptions.indexOf(UIPSelectSetting.inconsistentValue));
  }


  /**
   * Handles {@link UIPRoot} `uip:configchange` event to
   * manage dropdown theme
   */
  @listen({event: 'uip:configchange', target: `::parent(.${UIPRoot.is})`})
  protected onRootThemeChange(e: CustomEvent): void {
    if (e.detail.attribute !== 'dark-theme') return;
    let dropdownClass = UIPSelectSetting.dropdownClass;
    if (e.detail.value !== null) dropdownClass += ' uip-dark-dropdown';
    this.$field.dropdownClass = dropdownClass;
  }

  set disabled(force: boolean) {
    this.$field.toggleAttribute('disabled', force);
  }

  /** Resets {@link $field} value. */
  protected reset(): void {
    this.disabled = false;
    this.$field.options.forEach(opt => opt.selected = false);
    this.$field.$select.remove(this.settingOptions.indexOf(UIPSelectSetting.inconsistentValue));
  }

  public static register() {
    customElements.whenDefined('esl-select').then(() => super.register());
  }
}

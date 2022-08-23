import {attr} from '@exadel/esl/modules/esl-base-element/core';
import {memoize} from '@exadel/esl/modules/esl-utils/decorators/memoize';

import {UIPSetting} from '../../plugins/settings/setting';
import {ChangeAttrConfig, UIPStateModel} from '../../core/base/model';
import TokenListUtils from '../../utils/token-list-utils';
import {WARNING_MSG} from '../../utils/warning-msg';

/**
 * Custom setting to add/remove attributes or append values to attribute.
 * @extends UIPSetting
 */
export class UIPBoolSetting extends UIPSetting {
  public static is = 'uip-bool-setting';

  /** Setting's visible name. */
  @attr({defaultValue: ''}) public label: string;
  /**
   * Value for updating [attribute's]{@link UIPSetting#attribute} value.
   * If it's unset, setting adds/removes [attribute]{@link UIPSetting#attribute}.
   */
  @attr({defaultValue: ''}) public value: string;
  /**
   * Attribute to set mode for setting.
   * `replace` - replacing [attribute's]{@link UIPSetting#attribute} value with setting's value.
   * `append` - appending [attribute's]{@link UIPSetting#attribute} value to attribute's value.
   */
  @attr({defaultValue: 'replace'}) public mode: 'replace' | 'append';

  /** Checkbox field to change setting's value. */
  @memoize()
  protected get $field(): HTMLInputElement {
    const $field = document.createElement('input');
    $field.type = 'checkbox';
    $field.name = this.label;
    return $field;
  }

  @memoize()
  protected get $label(): HTMLLabelElement {
    const $label = document.createElement('label');
    $label.innerText = this.label;
    $label.append(this.$field);
    return $label;
  }

  @memoize()
  protected get $inconsistencyMarker(): HTMLElement {
    const marker = document.createElement('div');
    marker.classList.add('inconsistency-marker');
    return marker;
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.$label.remove();
    this.insertBefore(this.$label, this.firstChild);
  }

  applyTo(model: UIPStateModel): void {
    if (this.mode === 'replace') return super.applyTo(model);

    const cfg: ChangeAttrConfig = {
      target: this.target,
      attribute: this.attribute,
      modifier: this.$settings,
      transform: this.transform.bind(this, this.getDisplayedValue()),
    };

    model.changeAttribute(cfg);
  }

  transform(value: string | false,  attrValue: string | null): string | null {
    if (!attrValue) return value || null;

    const attrTokens = TokenListUtils.remove(TokenListUtils.split(attrValue), this.value);
    value && attrTokens.push(this.value);

    return TokenListUtils.join(attrTokens);
  }

  updateFrom(model: UIPStateModel): void {
    this.disabled = false;
    const attrValues = model.getAttribute(this.target, this.attribute);

    if (!attrValues.length) {
      this.disabled = true;
      return this.setInconsistency(WARNING_MSG.noTarget);
    }

    this.mode === 'replace' ? this.updateReplace(attrValues) : this.updateAppend(attrValues);
  }

  /** Update setting's value for replace {@link mode}. */
  protected updateReplace(attrValues: (string | null)[]): void {
    if (!TokenListUtils.hasSameElements(attrValues)) {
      return this.setInconsistency(WARNING_MSG.multiple);
    }

    return this.setValue((this.value && attrValues[0] !== this.value) ? null : attrValues[0]);
  }

  /** Update setting's value for append {@link mode}. */
  protected updateAppend(attrValues: (string | null)[]): void {
    const containsFunction = (val: string | null) =>
      TokenListUtils.contains(TokenListUtils.split(val), [this.value]);

    if (attrValues.every(containsFunction)) return this.setValue(this.value);
    if (!attrValues.some(containsFunction)) return this.setValue(null);

    return this.setInconsistency(WARNING_MSG.multiple);
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
    this.$inconsistencyMarker.remove();
  }

  protected setInconsistency(msg = WARNING_MSG.inconsistent): void {
    this.$field.checked = false;
    this.$inconsistencyMarker.remove();
    this.$inconsistencyMarker.innerText = msg;
    console.log(this.$inconsistencyMarker);
    this.append(this.$inconsistencyMarker);
  }

  set disabled(force: boolean) {
    this.$inconsistencyMarker.classList.toggle('disabled', force);
    this.$field.toggleAttribute('disabled', force);
  }
}

import React from 'jsx-dom';
import {attr, memoize} from '@exadel/esl/modules/esl-utils/decorators';

import {TokenListUtils} from '../../../core/utils/token-list';
import {UIPSetting} from '../base-setting/base-setting';

import type {ChangeAttrConfig, UIPStateModel} from '../../../core/base/model';

/**
 * Custom setting to add/remove attributes or append values to attribute
 */
export class UIPBoolSetting extends UIPSetting {
  public static is = 'uip-bool-setting';

  /** Setting's visible name */
  @attr({defaultValue: ''}) public label: string;
  /**
   * Value for updating [attribute's]{@link UIPSetting#attribute} value
   * If it's unset, setting adds/removes [attribute]{@link UIPSetting#attribute}
   */
  @attr({defaultValue: ''}) public value: string;
  /**
   * Attribute to set mode for setting
   * `replace` - replacing [attribute's]{@link UIPSetting#attribute} value with setting's value
   * `append` - appending [attribute's]{@link UIPSetting#attribute} value to attribute's value
   */
  @attr({defaultValue: 'replace'}) public mode: 'replace' | 'append';

  /** Checkbox field to change setting's value */
  @memoize()
  protected get $field(): HTMLInputElement {
    const $field = document.createElement('input');
    $field.type = 'checkbox';
    $field.name = this.label;
    $field.className = this.labelInputClass;
    return $field;
  }

  @memoize()
  protected get $inner(): HTMLElement {
    return (
      <label class={this.labelFieldClass}>
        {this.$field}<span class={this.labelMsgClass}>{this.label}</span>
      </label>
    ) as HTMLElement;
  }

  /** Container element for displaying inconsistency message */
  @memoize()
  protected get $inconsistencyMsg(): HTMLElement {
    return <span className={this.inconsistencyMsgClass}/> as HTMLElement;
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.innerHTML = '';
    this.appendChild(this.$inner);
  }

  applyTo(model: UIPStateModel): void {
    if (this.mode === 'replace') return super.applyTo(model);

    const cfg: ChangeAttrConfig = {
      target: this.target,
      attribute: this.attribute,
      modifier: this,
      transform: this.transform.bind(this, this.getDisplayedValue()),
    };

    model.changeAttribute(cfg);
  }

  /** Function to transform(update) attribute value */
  transform(value: string | false,  attrValue: string | null): string | null {
    if (!attrValue) return value || null;

    const attrTokens = TokenListUtils.remove(TokenListUtils.split(attrValue), this.value);
    value && attrTokens.push(this.value);

    return TokenListUtils.join(attrTokens);
  }

  updateFrom(model: UIPStateModel): void {
    super.updateFrom(model);
    const values = model.getAttribute(this.target, this.attribute);
    if (!values.length) {
      this.setInconsistency(this.NO_TARGET_MSG);
    } else {
      this.mode === 'replace' ? this.updateReplace(values) : this.updateAppend(values);
    }
  }

  /** Updates setting's value for replace {@link mode} */
  protected updateReplace(attrValues: (string | null)[]): void {
    if (!TokenListUtils.isAllEqual(attrValues)) {
      return this.setInconsistency(this.MULTIPLE_VALUE_MSG);
    }

    return this.setValue((this.value && attrValues[0] !== this.value) ? null : attrValues[0]);
  }

  /** Updates setting's value for append {@link mode} */
  protected updateAppend(attrValues: (string | null)[]): void {
    const containsFunction = (val: string | null) =>
      TokenListUtils.contains(TokenListUtils.split(val), [this.value]);

    if (attrValues.every(containsFunction)) return this.setValue(this.value);
    if (!attrValues.some(containsFunction)) return this.setValue(null);

    return this.setInconsistency(this.MULTIPLE_VALUE_MSG);
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
    this.$inconsistencyMsg.remove();
  }

  protected setInconsistency(msg = this.INCONSISTENT_VALUE_MSG): void {
    this.$field.checked = false;
    this.$inconsistencyMsg.innerText = msg;
    this.$inner.append(this.$inconsistencyMsg);
  }

  public setDisabled(force: boolean): void {
    this.$inconsistencyMsg.classList.toggle('disabled', force);
    this.$field.toggleAttribute('disabled', force);
  }
}

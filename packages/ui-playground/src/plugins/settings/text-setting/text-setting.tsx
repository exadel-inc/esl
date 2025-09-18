import {attr, memoize} from '@exadel/esl/modules/esl-utils/decorators';

import {UIPSetting} from '../base-setting/base-setting';
import type {UIPStateModel} from '../../../core/base/model';

/**
 * Custom setting for inputting attribute's value
 */
export class UIPTextSetting extends UIPSetting {
  public static is = 'uip-text-setting';

  /** Setting's visible name */
  @attr({defaultValue: ''}) public label: string;

  /** Text input to change setting's value */
  @memoize()
  protected get $field(): HTMLInputElement {
    return <input type="text" name={this.label}/> as HTMLInputElement;
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.innerHTML = '';

    const $inner = <label>
      {this.label}
      {this.$field}
    </label>;

    this.appendChild($inner);
  }

  updateFrom(model: UIPStateModel): void {
    super.updateFrom(model);
    const values = model.getAttribute(this.target, this.attribute);
    if (!values.length) {
      this.setInconsistency(this.NO_TARGET_MSG);
    } else {
      this.setValue(values[0]);
    }
  }

  protected getDisplayedValue(): string {
    return this.$field.value;
  }

  protected setValue(value: string | null): void {
    this.$field.value = value || '';
    this.$field.placeholder = '';
  }

  protected setInconsistency(msg = this.INCONSISTENT_VALUE_MSG): void {
    this.$field.value = '';
    this.$field.placeholder = msg;
  }

  public setDisabled(force: boolean): void {
    this.$field.toggleAttribute('disabled', force);
  }
}

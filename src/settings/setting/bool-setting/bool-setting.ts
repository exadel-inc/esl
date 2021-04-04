import {UIPSetting} from '../setting';
import {attr} from '@exadel/esl/modules/esl-base-element/core';
import {UIPStateModel} from '../../../utils/state-model/state-model';

export class UIPBoolSetting extends UIPSetting {
  public static is = 'uip-bool-setting';
  protected $field: HTMLInputElement;

  @attr({defaultValue: null}) value: string;
  @attr({defaultValue: 'replace'}) mode: 'replace' | 'append';

  protected connectedCallback() {
    super.connectedCallback();

    this.$field = document.createElement('input');
    this.$field.type = 'checkbox';
    this.$field.name = this.label || '';

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
        return (attrValue?.replace(new RegExp(/\b/.source + this.value + /\b/.source), '') || '') +
          ` ${val}`;
      });
    } else {
      model.transformAttribute(this.target, this.attribute, (attrValue) => {
        return attrValue && attrValue.replace(new RegExp(/\b/.source + this.value + /\b/.source), '');
      });
    }
  }

  updateFrom(model: UIPStateModel) {
    const values = model.getAttribute(this.target, this.attribute);
    let checkEqual: (string | boolean | null)[];

    if (this.mode === 'replace') {
      checkEqual = values.map(attrValue => attrValue && this.value ? attrValue === this.value : true);
    } else {
      checkEqual = values.map(value => value && new RegExp(/\b/.source + this.value + /\b/.source).test(value));
    }

    if (checkEqual.every(value => value === checkEqual[0])) {
      checkEqual[0] ? this.setValue(this.value || '') : this.setValue(null);
    } else {
      this.setInconsistency();
    }
  }

  protected render() {
    this.innerHTML = '';
    this.appendChild(this.$field);
  }

  protected getDisplayedValue(): string | boolean {
    if (this.value) {
      return this.$field.checked ? this.value : false;
    }

    return this.$field.checked;
  }

  protected setValue(value: string | null): void {
    if (this.value) {
      this.$field.checked = value === this.value;
    } else {
      this.$field.checked = value !== null;
    }
  }

  protected setInconsistency(): void {

  }

  protected isValid(): boolean {
    return true;
  }
}

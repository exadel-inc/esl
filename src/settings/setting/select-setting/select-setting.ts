import {attr} from '@exadel/esl/modules/esl-base-element/core';
import {UIPSetting} from '../setting';

export class UIPSelectSetting extends UIPSetting {
  public static is = 'uip-select-setting';
  protected $field: HTMLSelectElement;

  @attr({defaultValue: 'replace'}) mode: 'replace' | 'append';

  protected render(): void {
    this.$field = document.createElement('select');
    this.$field.name = this.label || '';

    const options = this.innerHTML;
    this.innerHTML = '';
    this.$field.innerHTML = options;
  }

  protected getDisplayedValue(): string | boolean {
    return this.$field.value;
  }

  protected setValue(value: string): void {
    const val = Array.prototype.find.call(this.$field.options, (opt: HTMLOptionElement) =>
      value.search(new RegExp(/\b/.source + opt.value + /\b/.source)) !== -1);

    if (val) {
      this.$field.value = val;
    }
    else {
      this.setInconsistency();
    }
  }

  protected setInconsistency(): void {

  }

  protected isValid(): boolean {
    return true;
  }
}


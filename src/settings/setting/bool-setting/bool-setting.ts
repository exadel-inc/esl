import {UIPSetting} from '../setting';
import {attr} from "@exadel/esl/modules/esl-base-element/core";

export class UIPBoolSetting extends UIPSetting {
  public static is = 'uip-bool-setting';
  protected $field: HTMLInputElement;

  @attr({defaultValue: null}) value: string;
  @attr({defaultValue: 'replace'}) mode: 'replace' | 'append';

  protected render() {
    this.$field = document.createElement('input');
    this.$field.type = 'checkbox';
    this.$field.name = this.label || '';
  }

  protected getDisplayedValue(): string | boolean {
    return this.value ? this.value : this.$field.checked;
  }

  protected setValue(value: string | null): void {
    if (this.value) {
      if (this.mode === 'append') {
        this.$field.checked = (value || '').search(new RegExp(/\b/.source + this.value + /\b/.source)) !== -1;
      } else {
        this.$field.checked = value === this.value;
      }
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


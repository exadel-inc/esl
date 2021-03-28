import {UIPSetting} from '../setting';
import {attr} from "@exadel/esl/modules/esl-base-element/core";

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
    }
    else {
      this.$field.checked = value !== null;
    }
  }

  protected setInconsistency(): void {

  }

  protected isValid(): boolean {
    return true;
  }
}


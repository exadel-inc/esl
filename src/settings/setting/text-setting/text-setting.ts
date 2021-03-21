import {UIPSetting} from '../setting';

export class UIPTextSetting extends UIPSetting {
  public static is = 'uip-text-setting';
  protected $field: HTMLInputElement;

  protected render(): void {
    this.$field = document.createElement('input');
    this.$field.type = 'string';
    this.$field.name = this.label || '';
  }

  protected getDisplayedValue(): string {
    return this.$field.value;
  }

  protected setValue(value: string) {
    this.$field.value = value;
    this.$field.placeholder = '';
  }

  protected setInconsistency() {
    this.$field.value = '';
    this.$field.placeholder = 'Inconsistent value';
  }

  protected isValid() {
    return true;
  }
}


import {UIPSetting} from '../setting';

export class UIPTextSetting extends UIPSetting {
  public static is = 'uip-text-setting';
  protected $field: HTMLInputElement;

  protected initField() {
    this.$field = document.createElement('input');
    this.$field.type = 'text';
    this.$field.name = this.label || '';
  }

  protected render() {
    this.innerHTML = '';
    this.appendChild(this.$field);
  }

  protected getDisplayedValue(): string {
    return this.$field.value;
  }

  protected setValue(value: string): void {
    this.$field.value = value;
    this.$field.placeholder = '';
  }

  protected setInconsistency(): void {
    this.$field.value = '';
    this.$field.placeholder = 'Inconsistent value';
  }

  protected isValid(): boolean {
    return true;
  }
}

import {attr} from '@exadel/esl/modules/esl-base-element/core';
import {UIPSetting} from '../setting';

export class UIPListSetting extends UIPSetting {
  public static is = 'uip-list-setting';
  protected select: HTMLSelectElement;

  @attr() public value: string;

  protected get target(): HTMLSelectElement {
    return this.select || this.querySelector('select');
  }

  protected get values(): string[] {
    return Array.prototype.map.call(this.target.options, (opt: HTMLOptionElement) => opt.value);
  }

  protected targetValue(e: Event): string {
    return (e.target as HTMLSelectElement).value;
  }

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    if (!this.connected || oldVal === newVal) return;

    if (attrName === 'value' && this.select.value !== newVal) {
      this.select.value = newVal;
    }
  }

  protected render(): void {
    if (this.querySelector('select')) return;

    this.select = document.createElement('select');
    this.select.name = this.name;
    this.createOptions();
    this.value = this.select.value;
  }

  protected createOptions(): void {
    this.querySelectorAll('uip-list-item').forEach(item => {
      if (item.textContent) {
        const value = item.getAttribute('value');
        this.select.add(new Option(item.textContent, value ? value : item.textContent));
      }
    });
  }
}


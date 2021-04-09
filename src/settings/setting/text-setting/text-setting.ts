import {attr} from '@exadel/esl/modules/esl-base-element/core';
import {UIPSetting} from '../setting';

export class UIPTextSetting extends UIPSetting {
  public static is = 'uip-text-setting';
  @attr() public value: string;

  protected input: HTMLInputElement;

  protected get target(): HTMLInputElement {
    return this.input || this.querySelector('input');
  }

  protected renderInput(inputType: string): void {
    if (this.querySelector('input')) return;

    this.input = document.createElement('input');
    this.input.type = inputType;
    this.input.name = this.name;
  }

  protected targetValue(e: Event): string | boolean {
    return (e.target as HTMLInputElement).value;
  }

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    if (!this.connected || oldVal === newVal) return;

    if (attrName === 'value' && this.input.value !== newVal) {
      this.input.value = newVal;
    }
  }

  protected render(): void {
    this.renderInput('text');
  }
}


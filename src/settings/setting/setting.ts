import {ESLBaseElement, attr} from '@exadel/esl/modules/esl-base-element/core';
import {bind} from '@exadel/esl/modules/esl-utils/decorators/bind';
import {EventUtils} from '@exadel/esl/modules/esl-utils/dom/events';

export abstract class UIPSetting extends ESLBaseElement {
  @attr({readonly: true}) public name: string;
  @attr({readonly: true}) public selector: string;
  public value: string | boolean;

  protected abstract render(): void;
  protected abstract get target(): HTMLElement;
  protected abstract targetValue(e: Event): string | boolean;

  protected connectedCallback() {
    super.connectedCallback();
    this.renderLabel();
    this.render();

    this.target.addEventListener('change', this.onValueChange);
    this.appendChild(this.target);
  }

  static get observedAttributes(): string[] {
    return ['value'];
  }

  @bind
  protected onValueChange(e: Event): void {
    e.preventDefault();
    this.value = this.targetValue(e);
    EventUtils.dispatch(this, 'valueChange', {detail: {name: this.name, value: this.value, selector: this.selector}});
  }

  protected renderLabel(): void {
    if (this.querySelector('label')) return;

    const label = document.createElement('label');
    if (this.selector) {
      label.innerHTML = `${this.name} (${this.selector})`;
    } else label.innerText = this.name;
    label.htmlFor = this.name;

    this.appendChild(label);
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();
    this.target.removeEventListener('change', this.onValueChange);
  }
}

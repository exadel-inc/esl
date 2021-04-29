import {attr, ESLBaseElement} from '@exadel/esl/modules/esl-base-element/core';
import {UIPStateModel} from '../../utils/state-model/state-model';
import {UIPSettings} from '../settings';
import {EventUtils} from '@exadel/esl/modules/esl-utils/dom/events';
import {bind} from '@exadel/esl/modules/esl-utils/decorators/bind';

export abstract class UIPSetting extends ESLBaseElement {
  static is = 'uip-setting';

  @attr() attribute: string;
  @attr() label?: string;
  @attr() target: string;

  protected $field: HTMLElement;

  protected connectedCallback() {
    super.connectedCallback();

    this.classList.add(UIPSetting.is);
    const settings = this.closest(`${UIPSettings.is}`);
    const target = settings?.getAttribute('target');

    if (settings && target) {
      this.target = target;
    }

    this.initField();
    this.render();
    this.$field.addEventListener('change', this._onChange);
  }

  @bind
  protected _onChange(e: Event): void {
    e.preventDefault();
    EventUtils.dispatch(this, 'valueChange');
  }

  public applyTo(model: UIPStateModel): void {
    model.setAttribute(this.target, this.attribute, this.getDisplayedValue());
  }

  public updateFrom(model: UIPStateModel): void {
    const values = model.getAttribute(this.target, this.attribute);

    if (values.some(value => value === null || value !== values[0])) {
      this.setInconsistency();
    }
    else {
      this.setValue(values[0]);
    }
  }

  protected renderLabel(): void {
    if (this.querySelector('label')) return;

    const label = document.createElement('label');
    label.innerText = this.label || '';
    label.htmlFor = this.label || '';
    this.appendChild(label);
  }

  protected render(): void {
    this.innerHTML = '';
    this.renderLabel();
    this.appendChild(this.$field);
  }

  protected abstract getDisplayedValue(): string | boolean;
  protected abstract isValid(): boolean;
  protected abstract setInconsistency(): void;
  protected abstract setValue(value: string | null): void;
  protected abstract initField(): void;
}

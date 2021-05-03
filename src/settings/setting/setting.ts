import {attr, ESLBaseElement} from '@exadel/esl/modules/esl-base-element/core';
import {UIPStateModel} from '../../utils/state-model/state-model';
import {UIPSettings} from '../settings';
import {EventUtils} from '@exadel/esl/modules/esl-utils/dom/events';
import {bind} from '@exadel/esl/modules/esl-utils/decorators/bind';

export abstract class UIPSetting extends ESLBaseElement {
  static is = 'uip-setting';
  static changeEvent = 'change';

  @attr() public attribute: string;
  @attr() public target: string;

  protected connectedCallback() {
    super.connectedCallback();
    this.classList.add(UIPSetting.is);
    this.bindEvents();

    if (this.target) return;
    const settingsTarget = this.closest(`${UIPSettings.is}`)?.getAttribute('target');
    if (settingsTarget) this.target = settingsTarget;
  }

  protected bindEvents(): void {
    this.addEventListener(UIPSetting.changeEvent, this._onChange);
  }

  protected unbindEvents(): void {
    this.removeEventListener(UIPSetting.changeEvent, this._onChange);
  }

  @bind
  protected _onChange(e: Event): void {
    e.preventDefault();
    EventUtils.dispatch(this, 'uip:change');
  }

  public applyTo(model: UIPStateModel): void {
    this.isValid() && model.setAttribute(this.target, this.attribute, this.getDisplayedValue());
  }

  public updateFrom(model: UIPStateModel): void {
    const values = model.getAttribute(this.target, this.attribute);

    if (values.some(value => value === null || value !== values[0])) {
      this.setInconsistency();
    } else {
      this.setValue(values[0]);
    }
  }

  protected isValid(): boolean {
    return true;
  }

  protected setInconsistency(): void {
    return;
  }

  protected disconnectedCallback() {
    this.unbindEvents();
    super.disconnectedCallback();
  }

  protected abstract getDisplayedValue(): string | boolean;
  protected abstract setValue(value: string | null): void;
}

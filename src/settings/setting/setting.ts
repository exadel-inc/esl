import {attr, ESLBaseElement} from '@exadel/esl/modules/esl-base-element/core';
import {EventUtils} from '@exadel/esl/modules/esl-utils/dom/events';
import {bind} from '@exadel/esl/modules/esl-utils/decorators/bind';

import {UIPStateModel} from '../../core/state-model';
import {UIPSettings} from '../settings';
import {WARN} from '../../utils/warn-messages/warn';

export abstract class UIPSetting extends ESLBaseElement {
  static is = 'uip-setting';
  static changeEvent = 'change';

  @attr() public attribute: string;
  @attr() public target: string;

  public get settingContainer(): HTMLElement | null {
    return this.closest(UIPSettings.is);
  }

  public get settings() {
    return this.settingContainer as UIPSettings;
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.classList.add(UIPSetting.is);
    this.bindEvents();

    if (this.target) return;
    const settingsTarget = this.settingContainer?.getAttribute('target');
    if (settingsTarget) this.target = settingsTarget;
  }

  protected disconnectedCallback() {
    this.unbindEvents();
    super.disconnectedCallback();
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
    const cfg = {
      target: this.target,
      name: this.attribute,
      value: this.getDisplayedValue(),
      modifier: this.settings
    };
    this.isValid() ? model.setAttribute(cfg) : this.setInconsistency(WARN.invalid);
  }

  public updateFrom(model: UIPStateModel): void {
    const values = model.getAttribute(this.target, this.attribute);

    if (!values.length) {
      this.setInconsistency(WARN.noTarget);
    } else if (values.some(value => value !== values[0])) {
      this.setInconsistency(WARN.multiple);
    } else {
      this.setValue(values[0]);
    }
  }

  protected isValid(): boolean {
    return true;
  }

  protected setInconsistency(msg = WARN.inconsistent): void {
    return;
  }

  protected abstract getDisplayedValue(): string | boolean;
  protected abstract setValue(value: string | null): void;
}

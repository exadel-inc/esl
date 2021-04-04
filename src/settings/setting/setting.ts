import {attr, ESLBaseElement} from '@exadel/esl/modules/esl-base-element/core';
import {UIPStateModel} from '../../utils/state-model/state-model';
import {UIPSettings} from '../settings';

export abstract class UIPSetting extends ESLBaseElement {
  @attr() attribute: string;
  @attr() label?: string;
  @attr() target: string;
  protected $field: HTMLElement;

  protected connectedCallback() {
    super.connectedCallback();

    const settings = this.closest(`${UIPSettings.is}`);
    const target = settings?.getAttribute('target');

    if (settings && target) {
      this.target = target;
    }
  }

  public applyTo(model: UIPStateModel): void {
    model.setAttribute(this.target, this.attribute, this.getDisplayedValue());
  }

  public updateFrom(model: UIPStateModel): void {
    const values = model.getAttribute(this.target, this.attribute);

    if (values.every(value => value && value === values[0])) {
      this.setValue(values[0]);
    }
    else {
      this.setInconsistency();
    }
  }

  protected abstract getDisplayedValue(): string | boolean;
  protected abstract isValid(): boolean;
  protected abstract setInconsistency(): void;
  protected abstract setValue(value: string | null): void;
  protected abstract render(): void;
}

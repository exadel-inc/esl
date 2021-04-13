import {attr, ESLBaseElement} from '@exadel/esl/modules/esl-base-element/core';
import {UIPStateModel} from '../../utils/state-model/state-model';
import {UIPSettings} from '../settings';
import {EventUtils} from '@exadel/esl/modules/esl-utils/dom/events';

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

    this.initField();
    this.render();
    this.$field.addEventListener('change', (e: Event) => {
      e.preventDefault();
      EventUtils.dispatch(this, 'valueChange');
    });
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

  protected abstract getDisplayedValue(): string | boolean;
  protected abstract isValid(): boolean;
  protected abstract setInconsistency(): void;
  protected abstract setValue(value: string | null): void;
  protected abstract initField(): void;
  protected abstract render(): void;
}

import {ESLBaseElement, attr} from '@exadel/esl/modules/esl-base-element/core';
import {EventUtils} from '@exadel/esl/modules/esl-utils/dom/events';
import {bind} from '@exadel/esl/modules/esl-utils/decorators/bind';

export class UIPRoot extends ESLBaseElement {
  public static is = 'uip-root';
  private _state: string;

  @attr({defaultValue: 'vertical'}) public mode: string;
  @attr({defaultValue: 'light'}) public theme: string;

  public get state() {
    return this._state;
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.bindEvents();
  }

  protected disconnectedCallback() {
    this.unbindEvents();
  }

  protected bindEvents() {
    this.addEventListener('request:change', this._onStateChange);

    const $options = this.querySelector('.uip-options') as HTMLElement;
    $options.addEventListener('click', this._onOptionChange);
  }

  protected unbindEvents() {
    this.removeEventListener('request:change', this._onStateChange);

    const $options = this.querySelector('.uip-options') as HTMLElement;
    $options.removeEventListener('click', this._onOptionChange);
  }

  protected _onStateChange(e: CustomEvent) {
    this._state = e.detail.markup;
    EventUtils.dispatch(this, 'state:change', {detail: e.detail});
  }

  @bind
  protected _onOptionChange(e: Event) {
    const target = e.target as HTMLElement;
    if (!target) return;

    const mode = target.getAttribute('mode');
    const theme = target.getAttribute('theme');

    if (mode) this.mode = mode;
    if (theme) this.theme = theme;
  }
}

import {bind} from '@exadel/esl';
import {ESLBaseElement} from '@exadel/esl/modules/esl-base-element/core';
import {EventUtils} from '@exadel/esl/modules/esl-utils/dom/events';

export class UIPRoot extends ESLBaseElement {
  public static is = 'uip-root';
  private _state: string;

  public get state() {
    return this._state;
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.bindEvents();
  }

  protected disconnectedCallback() {
    this.unbindEvents();
    super.disconnectedCallback();
  }

  protected bindEvents() {
    this.addEventListener('request:change', this._onStateChange);
  }

  protected unbindEvents() {
    this.removeEventListener('request:change', this._onStateChange);
  }

  @bind
  protected _onStateChange(e: CustomEvent) {
    this._state = e.detail.markup;
    const detail = Object.assign({
      origin: e.target
    }, e.detail);
    EventUtils.dispatch(this, 'state:change', {detail});
  }
}

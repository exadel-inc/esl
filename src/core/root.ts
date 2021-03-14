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
    this.addEventListener('request:change', this._onStateChange);
  }

  private _onStateChange(e: CustomEvent) {
    this._state = e.detail.markup;
    EventUtils.dispatch(this, 'state:change', {detail: e.detail});
  }

  protected disconnectedCallback() {
    this.removeEventListener('request:change', this._onStateChange);
  }
}

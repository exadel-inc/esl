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
    this._onResize();
    this.bindEvents();
  }

  protected disconnectedCallback() {
    this.unbindEvents();
    super.disconnectedCallback();
  }

  protected bindEvents() {
    this.addEventListener('request:change', this._onStateChange);
    window.addEventListener('resize', this._onResize);
  }

  protected unbindEvents() {
    this.removeEventListener('request:change', this._onStateChange);
  }

  protected _onStateChange(e: CustomEvent) {
    this._state = e.detail.markup;
    EventUtils.dispatch(this, 'state:change', {detail: e.detail});
  }

  @bind
  protected _onResize() {
    if (window.matchMedia('(max-width: 992px)').matches) {
      this.mode = 'horizontal';
    }
  }
}

import {bind} from '@exadel/esl';
import {ESLBaseElement} from '@exadel/esl/modules/esl-base-element/core';
import {EventUtils} from '@exadel/esl/modules/esl-utils/dom/events';
import {UIPStateModel} from '../utils/state-model/state-model';

export class UIPRoot extends ESLBaseElement {
  public static is = 'uip-root';
  private _model: UIPStateModel;

  public get model(): UIPStateModel {
    return this._model;
  }

  public set model(model: UIPStateModel) {
    this._model = model;
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.bindEvents();
    this.model = new UIPStateModel();
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
    e.stopPropagation();
    this.model.html = e.detail.markup;
    const detail = Object.assign({
      origin: e.target
    }, e.detail);
    EventUtils.dispatch(this, 'state:change', {detail});
  }
}

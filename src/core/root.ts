import {ObserverCallback} from '@exadel/esl';
import {ESLBaseElement} from '@exadel/esl/modules/esl-base-element/core';
import {UIPStateModel} from './state-model';

/** Container for {@link UIPPlugin} components. */
export class UIPRoot extends ESLBaseElement {
  public static is = 'uip-root';
  private _model = new UIPStateModel();

  public get model(): UIPStateModel {
    return this._model;
  }

  public addStateListener(listener: ObserverCallback) {
    this._model.addListener(listener);
  }

  public removeStateListener(listener: ObserverCallback) {
    this._model.removeListener(listener);
  }
}

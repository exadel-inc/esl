import {ObserverCallback} from '@exadel/esl';
import {ESLBaseElement} from '@exadel/esl/modules/esl-base-element/core';
import {UIPStateModel} from './state-model';

/**
 * UI Playground root custom element definition,
 * container element for {@link UIPPlugin} components.
 * Define the bounds of UI Playground instance.
 * Share the {@link UIPStateModel} instance between {@link UIPPlugin}-s.
 */
export class UIPRoot extends ESLBaseElement {
  public static is = 'uip-root';
  private _model = new UIPStateModel();

  /** {@link UIPStateModel} instance to store UI Playground state. */
  public get model(): UIPStateModel {
    return this._model;
  }

  /** Alias for {@link this.model.addListener}. */
  public addStateListener(listener: ObserverCallback) {
    this._model.addListener(listener);
  }

  /** Alias for {@link this.model.removeListener}. */
  public removeStateListener(listener: ObserverCallback) {
    this._model.removeListener(listener);
  }
}

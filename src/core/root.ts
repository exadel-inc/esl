import {EventUtils, ObserverCallback} from '@exadel/esl';
import {attr, ESLBaseElement} from '@exadel/esl/modules/esl-base-element/core';
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

  /**
   * Attribute for controlling UIP components' layout.
   * Has two values: `vertical` and `horizontal`.
   */
  @attr() public mode: string;
  /**
   * Attribute for controlling UIP components' theme.
   * Has two values: `uip-light` and `uip-dark`.
   */
  @attr() public theme: string;

  static get observedAttributes() {
    return ['theme', 'mode'];
  }

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

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
    if (oldVal !== newVal) {
      this.classList.remove(`${oldVal}-${attrName}`);
      this.classList.add(`${newVal}-${attrName}`);
      EventUtils.dispatch(this, 'uip:configchange', {
        bubbles: false,
        detail: {
          attribute: attrName,
          value: newVal
        }
      });
    }
  }
}

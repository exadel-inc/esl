import {bind, EventUtils, ObserverCallback} from '@exadel/esl';
import {attr, ESLBaseElement} from '@exadel/esl/modules/esl-base-element/core';
import {ESLMediaQuery} from '@exadel/esl/modules/esl-media-query/core';
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

  /** Media query for mobile breakpoints. */
  static _query: ESLMediaQuery = new ESLMediaQuery('@-SM');

  /**
   * Attribute for controlling UIP components' layout.
   * Has two values: `vertical` and `horizontal`.
   */
  @attr({defaultValue: 'vertical'}) public mode: string;

  /**
   * Attribute for controlling UIP components' theme.
   * Has two values: `uip-light` and `uip-dark`.
   */
  @attr({defaultValue: 'uip-light'}) public theme: string;

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
    UIPRoot._query.addListener(this._onQueryChange);
  }

  /** Alias for {@link this.model.removeListener}. */
  public removeStateListener(listener: ObserverCallback) {
    this._model.removeListener(listener);
    UIPRoot._query.removeListener(this._onQueryChange);
  }

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
    if (oldVal !== newVal) {
      this._updateStyles(attrName, oldVal, newVal);
      EventUtils.dispatch(this, 'uip:configchange', {
        bubbles: false,
        detail: {
          attribute: attrName,
          value: newVal
        }
      });
    }
  }

  /**
   * Callback to track resize event.
   * Applies horizontal mode for mobile breakpoints.
   */
  @bind
  protected _onQueryChange() {
    this.mode === 'vertical' && UIPRoot._query.matches
        ? this._updateStyles('mode', this.mode, 'horizontal')
        : this._updateStyles('mode', 'horizontal', this.mode);
  }

  protected _updateStyles(option: string, prev: string, next: string) {
    this.classList.remove(`${prev}-${option}`);
    this.classList.add(`${next}-${option}`);
  }
}

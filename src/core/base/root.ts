import {bind, EventUtils, ObserverCallback, ESLMediaRuleList} from '@exadel/esl';
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
  @attr({defaultValue: 'vertical'}) public mode: string;

  /**
   * Attribute for controlling UIP components' theme.
   * Has two values: `uip-light` and `uip-dark`.
   */
  @attr({defaultValue: 'uip-light'}) public theme: string;

  /**
   * Attibute for setup media query rules
   */
  @attr({defaultValue: '@-SM => horizontal'}) public rewriteMode: string;

  private _lastMode: string;
  private _rewriteModeRL: ESLMediaRuleList<string>;

  static get observedAttributes() {
    return ['theme', 'mode', 'rewrite-mode'];
  }

  /** {@link UIPStateModel} instance to store UI Playground state. */
  public get model(): UIPStateModel {
    return this._model;
  }

  protected connectedCallback() {
    this.applyRewriteQuery(this.rewriteMode);
    super.connectedCallback();
    this.theme = String(this.theme);
    this._lastMode = this.mode = String(this.mode);
    this._onQueryChange();
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();
    this.applyRewriteQuery(null);
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
    if (oldVal === newVal) return;
    if (attrName === 'mode' || attrName === 'theme') {
      this._updateStyles(attrName, oldVal, newVal);
      EventUtils.dispatch(this, 'uip:configchange', {
        bubbles: false,
        detail: {
          attribute: attrName,
          value: newVal
        }
      });
    }
    if (attrName === 'rewrite-mode') {
      this.applyRewriteQuery(newVal);
    }
  }

  protected _updateStyles(option: string, prev: string, next: string) {
    this.classList.remove(`${prev}-${option}`);
    this.classList.add(`${next}-${option}`);
  }

  /**
   * @param query media query rule
   * Parses media query rule
   * Manages media query listeners
   */
  protected applyRewriteQuery(query: string | null) {
    this._rewriteModeRL?.removeListener(this._onQueryChange);
    if (!query) return;
    this._rewriteModeRL = ESLMediaRuleList.parse(query, ESLMediaRuleList.STRING_PARSER);
    this._rewriteModeRL.addListener(this._onQueryChange);
  }

  /**
   * Callback to track resize event.
   * Applies horizontal mode for mobile breakpoints.
   */
  @bind
  protected _onQueryChange() {
    const rewriteValue = this._rewriteModeRL.activeValue;

    if (rewriteValue) {
      this._lastMode = this.mode;
      this.mode = rewriteValue;
    } else {
      this.mode = this._lastMode;
    }
  }
}

import {attr, ESLBaseElement} from '@exadel/esl/modules/esl-base-element/core';
import {UIPRoot} from './root';
import {StateModelFiredObj} from './state-model';

/**
 * Base class for UI Playground plugins.
 *
 * Implements basic relation and styles
 */
export abstract class UIPPlugin extends ESLBaseElement {
  static get observedAttributes() { return ['label']; }

  private _root: UIPRoot | null;

  /** Visible label */
  @attr() public label: string;

  /** @returns UIPRoot - playground root element */
  protected get root(): UIPRoot | null {
    return this._root;
  }
  protected set root(root: UIPRoot | null) {
    this._root?.removeStateListener(this._onRootStateChange);
    this._root = root;
    this._root?.addStateListener(this._onRootStateChange);
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.classList.add('uip-plugin');
    this.root = this.closest(`${UIPRoot.is}`) as UIPRoot;
    this.root && this._onRootStateChange({markup: this.root.model.html});
  }
  protected disconnectedCallback() {
    this._root?.removeStateListener(this._onRootStateChange);
    this.root = null;
    super.disconnectedCallback();
  }

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
    if (attrName === 'label') this.setAttribute('aria-label', newVal);
  }

  /** Handles root state change*/
  protected abstract _onRootStateChange(e: StateModelFiredObj): void;
}

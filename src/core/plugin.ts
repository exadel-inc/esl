import {memoize} from '@exadel/esl';
import {attr, ESLBaseElement} from '@exadel/esl/modules/esl-base-element/core';
import {UIPRoot} from './root';
import {UIPStateModel} from './state-model';

/**
 * Base class for UI Playground plugins.
 *
 * Implements basic relation and styles
 */
export abstract class UIPPlugin extends ESLBaseElement {
  static get observedAttributes() {
    return ['label'];
  }

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

  protected get model(): UIPStateModel | null {
    return this.root ? this.root.model : null;
  }

  @memoize()
  get $inner() {
    const $inner = document.createElement('div');
    const pluginType = <typeof UIPPlugin>this.constructor;
    $inner.className = `${pluginType.is}-inner uip-plugin-inner`;
    return $inner;
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.classList.add('uip-plugin');
    this.root = this.closest(`${UIPRoot.is}`) as UIPRoot;
    this.root && this._onRootStateChange();
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
  protected _onRootStateChange(): void {}
}

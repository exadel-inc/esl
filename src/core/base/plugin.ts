import {memoize} from '@exadel/esl/modules/esl-utils/decorators/memoize';
import {attr, ESLBaseElement} from '@exadel/esl/modules/esl-base-element/core';

import {UIPRoot} from './root';
import {UIPStateModel} from './model';

/**
 * Base class for UI Playground plugins.
 *
 * Implements basic relation and styles
 */
export abstract class UIPPlugin extends ESLBaseElement {
  static observedAttributes = ['label'];

  /** Visible label */
  @attr() public label: string;

  /** @returns UIPRoot - playground root element */
  @memoize()
  protected get root(): UIPRoot | null {
    return this.closest(`${UIPRoot.is}`) as UIPRoot;
  }

  protected get model(): UIPStateModel | null {
    return this.root ? this.root.model : null;
  }

  @memoize()
  protected get $inner() {
    const $inner = document.createElement('div');
    const pluginType = this.constructor as typeof UIPPlugin;
    $inner.className = `${pluginType.is}-inner uip-plugin-inner`;
    return $inner;
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.classList.add('uip-plugin');
    this.root?.addStateListener(this._onRootStateChange);
    this.root && this._onRootStateChange();
  }

  protected disconnectedCallback() {
    this.root?.removeStateListener(this._onRootStateChange);
    super.disconnectedCallback();
    memoize.clear(this, 'root');
  }

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
    if (attrName === 'label') this.setAttribute('aria-label', newVal);
  }

  /** Handles root state change*/
  protected _onRootStateChange(): void {}
}

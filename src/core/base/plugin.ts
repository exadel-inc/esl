import {memoize} from '@exadel/esl/modules/esl-utils/decorators/memoize';
import {attr, ESLBaseElement} from '@exadel/esl/modules/esl-base-element/core';

import {UIPRoot} from './root';
import {UIPStateModel} from './model';

/**
 * Base class for UI Playground plugins
 * Implements basic relation and styles
 */
export abstract class UIPPlugin extends ESLBaseElement {
  static observedAttributes = ['label'];

  /** Visible label */
  @attr() public label: string;

  /** Closest playground {@link UIPRoot} element */
  @memoize()
  protected get root(): UIPRoot | null {
    return this.closest(`${UIPRoot.is}`) as UIPRoot;
  }

  /** Returns {@link UIPStateModel} from root instance */
  protected get model(): UIPStateModel | null {
    return this.root ? this.root.model : null;
  }

  /** {@link UIPPlugin} section wrapper */
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

  /** Handles {@link UIPRoot} state changes */
  protected _onRootStateChange(): void {}
}

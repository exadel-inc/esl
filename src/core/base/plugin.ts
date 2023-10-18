import {ESLBaseElement} from '@exadel/esl/modules/esl-base-element/core';
import {attr, memoize} from '@exadel/esl/modules/esl-utils/decorators';

import {UIPRoot} from './root';

import type {UIPStateModel} from './model';

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
    return this.closest(`${UIPRoot.is}`);
  }

  /** Returns {@link UIPStateModel} from root instance */
  protected get model(): UIPStateModel | null {
    return this.root ? this.root.model : null;
  }

  protected connectedCallback(): void {
    super.connectedCallback();
    this.classList.add('uip-plugin');
    this.root?.addStateListener(this._onRootStateChange);
  }

  protected disconnectedCallback(): void {
    this.root?.removeStateListener(this._onRootStateChange);
    super.disconnectedCallback();
    memoize.clear(this, 'root');
  }

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    if (attrName === 'label') this.setAttribute('aria-label', newVal);
  }

  /** Handles {@link UIPRoot} state changes */
  protected _onRootStateChange(): void {}
}

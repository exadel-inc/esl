import {attr, ESLBaseElement} from '@exadel/esl/modules/esl-base-element/core';
import {UIPRoot} from './root';
import {bind} from '@exadel/esl/modules/esl-utils/decorators/bind';
import {EventUtils} from '@exadel/esl/modules/esl-utils/dom/events';

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
  protected get root(): UIPRoot | null{
    return this._root;
  }
  protected set root(root: UIPRoot | null) {
    this._root && this._root.removeEventListener('state:change', this._onRootChange);
    this._root = root;
    this._root && this._root.addEventListener('state:change', this._onRootChange);
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.classList.add('uip-plugin');
    this.root = this.closest(`${UIPRoot.is}`) as UIPRoot;
  }
  protected disconnectedCallback() {
    this.root = null;
    super.disconnectedCallback();
  }

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
    if (attrName === 'label') this.setAttribute('aria-label', newVal);
  }

  /** Handles root state change event. Delegate non self triggered events to the {@link handleChange}*/
  @bind
  protected _onRootChange(e: CustomEvent) {
    if (e.detail.origin === this) return;
    this.handleChange(e);
  }

  /** Dispatch change state */
  protected dispatchChange(markup: string) {
    const detail = {
      markup,
      type: (this.constructor as typeof UIPPlugin).is
    };
    EventUtils.dispatch(this, 'request:change', {detail});
  }

  /** Handles root state change. Will not process self triggered changes */
  protected abstract handleChange(e: CustomEvent): void;
}

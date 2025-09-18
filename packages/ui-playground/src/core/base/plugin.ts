import {ESLBaseElement} from '@exadel/esl/modules/esl-base-element/core';
import {ESLTraversingQuery} from '@exadel/esl/modules/esl-traversing-query/core';
import {attr, memoize} from '@exadel/esl/modules/esl-utils/decorators';

import {UIPRoot} from './root';

import type {UIPStateModel} from './model';

/**
 * Base class for UI Playground plugins
 * Implements basic relation and styles
 */
export abstract class UIPPlugin extends ESLBaseElement {
  static readonly observedAttributes = ['root', 'label'];

  /** Visible label */
  @attr() public label: string;

  /** Query for $root */
  @attr({defaultValue: `::parent(${UIPRoot.is})`})
  public root: string;

  /** Closest playground {@link UIPRoot} element */
  @memoize()
  public get $root(): UIPRoot | null {
    return ESLTraversingQuery.first(this.root, this) as UIPRoot;
  }

  /** Returns {@link UIPStateModel} from $root instance */
  protected get model(): UIPStateModel | null {
    return this.$root ? this.$root.model : null;
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.classList.add('uip-plugin');
  }

  protected override disconnectedCallback(): void {
    super.disconnectedCallback();
    memoize.clear(this, '$root');
  }

  protected override attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    if (attrName === 'label') this.setAttribute('aria-label', newVal);
    if (attrName === 'root') memoize.clear(this, '$root');
  }
}

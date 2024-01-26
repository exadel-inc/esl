import React from 'jsx-dom';

import {listen, memoize} from '@exadel/esl/modules/esl-utils/decorators';

import {UIPPlugin} from '../../core/base/plugin';
import {UIPSnippets} from '../snippets/snippets';

import './snippets-title.shape';
import type {UIPRoot} from '../../core/base/root';

/** Common lightweight plugin to display currently selected snippet title */
export class UIPSnippetsTitle extends UIPPlugin {
  public static override is = 'uip-snippets-title';

  @memoize()
  public override get $root(): UIPRoot | null {
    const parent: UIPSnippets = this.closest(`${UIPSnippets.is}`)!;
    if (parent) return parent.$root;
    return super.$root;
  }

  /** Active snippet title inner element */
  @memoize()
  protected get $inner(): JSX.Element {
    const type = this.constructor as typeof UIPSnippetsTitle;
    return <span className={type.is + '-inner'}></span>;
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.appendChild(this.$inner);
    setTimeout(() => this._onRootStateChange());
  }

  /** Handles active snippet title change */
  @listen({event: 'uip:snippet:change', target: ($this: UIPSnippetsTitle) => $this.$root})
  protected _onRootStateChange(): void {
    this.$inner.textContent = this.model!.activeSnippet?.label || '';
  }
}

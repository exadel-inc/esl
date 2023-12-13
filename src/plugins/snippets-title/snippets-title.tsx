import React from 'jsx-dom';

import {listen, memoize} from '@exadel/esl/modules/esl-utils/decorators';

import {UIPPlugin} from '../../core/base/plugin';
import {UIPSnippets} from '../snippets/snippets';

import './snippets-title.shape';
import type {UIPRoot} from '../../core/base/root';

/** Common lightweight plugin to display currently selected snippet title */
export class UIPSnippetsTitle extends UIPPlugin {
  public static override is = 'uip-title';

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.appendChild(this.$inner);
  }

  @memoize()
  public override get $root(): UIPRoot | null {
    const parent = this.closest(`${UIPSnippets.is}`) as UIPSnippets;
    if (parent) return parent.$root;
    return super.$root;
  }

  /** Active snippet title */
  @memoize()
  protected get $inner(): JSX.Element {
    const type = this.constructor as typeof UIPSnippetsTitle;
    return <span className={type.is + '-inner'}></span>;
  }

  /** Handle active snippet title */
  @listen({event: 'uip:model:change', target: ($this: UIPSnippetsTitle)=> $this.model})
  protected _onRootStateChange(): void {
    this.$inner.textContent = this.model!.activeSnippet?.label || '';
  }
}

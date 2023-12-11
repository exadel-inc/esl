import React from 'jsx-dom';

import {attr, decorate, listen, memoize} from '@exadel/esl/modules/esl-utils/decorators';
import {debounce} from '@exadel/esl/modules/esl-utils/async/debounce';

import {UIPPlugin} from '../../core/base/plugin';
import {UIPSnippets} from '../snippets/snippets';


import './snippets-list.shape';

import type {UIPSnippetItem} from '../../core/base/snippet';
import type {DelegatedEvent} from '@exadel/esl/modules/esl-event-listener/core';
import type {UIPRoot} from '../../core/base/root';


/**
 * Snippets {@link UIPPlugin} custom element definition
 * Container class for snippets (component's templates)
 */
export class UIPSnippetsList extends UIPPlugin {
  public static override is = 'uip-snippets-list';

  /** CSS Class for snippets list item */
  @attr({defaultValue: 'snippets-list-item'}) public itemCls: string;
  /** CSS Class for snippets button */
  @attr({defaultValue: 'uip-snippet-trigger'}) public itemBtnCls: string;
  /** CSS Class added to active snippet */
  @attr({defaultValue: 'active'}) public activeCls: string;

  @memoize()
  public override get $root(): UIPRoot | null {
    const parent = this.closest(`${UIPSnippets.is}`) as UIPSnippets;
    if (parent) return parent.$root;
    return super.$root;
  }

  /** {@link UIPPlugin} section wrapper */
  @memoize()
  protected get $inner(): HTMLElement {
    const pluginType = this.constructor as typeof UIPPlugin;
    return <ul className={`${pluginType.is}-inner snippets-list esl-scrollable-content`}>{this.$items}</ul> as HTMLElement;
  }

  /** Snippets list from dropdown element*/
  @memoize()
  public get $items(): HTMLElement[] {
    if (!this.model) return [];
    return this.model.snippets.map(this.buildListItem.bind(this)).filter((item: HTMLElement): item is HTMLElement => !!item);
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.appendChild(this.$inner);
  }

  protected override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.innerHTML = '';
    memoize.clear(this, ['$items', '$inner']);
  }

  /** Initializes snippets layout */
  @decorate(debounce, 0)
  protected rerender(): void {
    this.$inner.innerHTML = '';
    memoize.clear(this, '$items');
    this.$inner.append(...this.$items);
  }

  /** Builds snippets list item */
  protected buildListItem(snippet: UIPSnippetItem, index: number): HTMLElement | undefined {
    if (!snippet.label) return;

    const classes = [this.itemCls];
    if (snippet.active) classes.push(this.activeCls);
    return <li className={classes.join(' ')}>
      <button type="button" className={this.itemBtnCls} uip-snippet-index={index}>{snippet.label}</button>
    </li> as HTMLElement;
  }

  /** Handles `click` event to manage active snippet */
  @listen({event: 'click', selector: '[uip-snippet-index]'})
  protected _onItemClick(e: DelegatedEvent<MouseEvent>): void {
    const {snippets} = this.model!;
    const index = e.$delegate?.getAttribute('uip-snippet-index') || '';
    if (!index || !snippets) return;
    this.model!.applySnippet(snippets[+index], this);
    e.preventDefault();
  }

  @listen({event: 'uip:snippet:change', target: ($this: UIPSnippetsList) => $this.model})
  protected _onRootStateChange(): void {
    this.rerender();
  }
}

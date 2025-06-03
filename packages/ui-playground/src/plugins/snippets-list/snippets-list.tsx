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
 * Snippets List {@link UIPPlugin} custom element definition
 * Container class for snippets (component's templates)
 */
export class UIPSnippetsList extends UIPPlugin {
  public static override is = 'uip-snippets-list';

  /** CSS Class for snippets list item */
  @attr({defaultValue: 'uip-snippets-item-wrapper'}) public itemCls: string;
  /** CSS Class for snippets button */
  @attr({defaultValue: 'uip-snippets-item'}) public itemBtnCls: string;
  /** CSS Class added to active snippet */
  @attr({defaultValue: 'uip-snippets-item-active'}) public activeCls: string;
  /** CSS Class added to isolated snippet */
  @attr({defaultValue: 'uip-snippets-item-isolated'}) public isolatedCls: string;

  @memoize()
  public override get $root(): UIPRoot | null {
    const parent: UIPSnippets = this.closest(`${UIPSnippets.is}`)!;
    if (parent) return parent.$root;
    return super.$root;
  }

  /** {@link UIPPlugin} section wrapper */
  @memoize()
  protected get $inner(): HTMLElement {
    const pluginType = this.constructor as typeof UIPPlugin;
    return <ul className={`${pluginType.is}-inner esl-scrollable-content`}>{this.$items}</ul> as HTMLElement;
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
    if (snippet.isolated) classes.push(this.isolatedCls);

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

  /** Handles `uip:snippet:change` event to rerender snippets list */
  @listen({event: 'uip:snippet:change', target: ($this: UIPSnippetsList) => $this.$root})
  protected _onRootStateChange(): void {
    this.rerender();
  }
}

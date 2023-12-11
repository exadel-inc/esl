import React from 'jsx-dom';

import {attr, listen} from '@exadel/esl/modules/esl-utils/decorators';
import {ESLMediaQuery} from '@exadel/esl/modules/esl-media-query/core';
import {ESLToggleable} from '@exadel/esl/modules/esl-toggleable/core';
import {ESLTrigger} from '@exadel/esl/modules/esl-trigger/core';

import {UIPPlugin} from '../../core/base/plugin';
import {UIPSnippetsIcon} from '../snippets-list/snippets.icon';

/**
 * Header {@link UIPPlugin} custom element definition
 * Container for {@link UIPSnippetsList} and {@link UIPOptions} elements
 */
export class UIPSnippets extends UIPPlugin {
  static override is = 'uip-snippets';

  @attr({defaultValue: 'not all'}) public dropdownView: string;

  protected connectedCallback(): void {
    super.connectedCallback();

    if (this.$root?.ready) this._onRootReady();

    ESLTrigger.register();
    ESLToggleable.register();
  }

  @listen({
    event: 'uip:root:ready',
    target: ($this: UIPPlugin) => $this.$root
  })
  protected _onRootReady(): void {
    this.renderSnippetsList();
    this._onBreakpointChange();
  }

  /** Renders {@link UIPSnippetsList} element */
  protected renderSnippetsList(): void {
    if (!this.model?.snippets.length) return;

    if (this.model?.snippets.length > 1) {
      this.prepend(this.$snippetsInnerContent());
    } else {
      this.prepend(this.$title);
    }
  }

  protected get $title(): JSX.Element {
    return <uip-title></uip-title>;
  }

  /** Renders dropdown element for a case with multiple snippets */
  protected $snippetsInnerContent(): JSX.Element {
    return <>
      <esl-trigger active-class="open" className="snippets-dropdown-control">
        <UIPSnippetsIcon/>
        <uip-title></uip-title>
      </esl-trigger>
      <esl-toggleable className="snippets-dropdown" close-on-outside-action close-on-esc close-on="li">
        <uip-snippets-list></uip-snippets-list>
        <esl-scrollbar target="::prev::child"></esl-scrollbar>
      </esl-toggleable>
    </>;
  }

  @listen({
    event: 'change',
    target: (snippets: UIPSnippets) => ESLMediaQuery.for(snippets.dropdownView)
  })
  protected _onBreakpointChange(): void {
    const isMatches = ESLMediaQuery.for(this.dropdownView).matches;
    this.$$cls('dropdown-view', isMatches);
  }
}

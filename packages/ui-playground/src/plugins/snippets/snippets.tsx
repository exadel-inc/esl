import {attr, listen, memoize} from '@exadel/esl/modules/esl-utils/decorators';
import {ESLMediaQuery} from '@exadel/esl/modules/esl-media-query/core';
import {UIPPlugin} from '../../core/base/plugin';
import {UIPSnippetsIcon} from '../snippets-list/snippets.icon';

import type {ESLTrigger} from '@exadel/esl/modules/esl-trigger/core';
import type {ESLToggleable} from '@exadel/esl/modules/esl-toggleable/core';
import type {UIPSnippetsTitle} from '../snippets-title/snippets-title';

/**
 * Snippets {@link UIPPlugin} custom element definition
 * Container for {@link UIPSnippetsList} element
 */
export class UIPSnippets extends UIPPlugin {
  static override is = 'uip-snippets';
  static override observedAttributes = ['dropdown-view', ...UIPPlugin.observedAttributes];

  @attr({defaultValue: 'not all'}) public dropdownView: string;

  /** @returns true if dropdown mode should be active */
  public get isDropdown(): boolean {
    return ESLMediaQuery.for(this.dropdownView).matches;
  }


  /** Builds inner {@link UIPSnippetsTitle} */
  @memoize()
  protected get $title(): UIPSnippetsTitle {
    return <uip-snippets-title/> as UIPSnippetsTitle;
  }

  /** Builds trigger area for dropdown mode */
  @memoize()
  protected get $trigger(): ESLTrigger {
    return (
      <esl-trigger active-class="open" className="uip-snippets-trigger" target="::next">
        <UIPSnippetsIcon/>
        {this.$title}
      </esl-trigger>
    ) as ESLTrigger;
  }

  /** Builds dropdown/main area */
  @memoize()
  protected get $toggleable(): ESLToggleable {
    return (
      <esl-toggleable class="uip-snippets-dropdown" close-on-outside-action close-on-esc close-on="li">
        <uip-snippets-list></uip-snippets-list>
        <esl-scrollbar class="uip-snippets-scroll" target="::prev::child"></esl-scrollbar>
      </esl-toggleable>
    ) as ESLToggleable;
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    if (this.$root?.ready) this._onRootReady();
  }

  protected override attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    super.attributeChangedCallback(attrName, oldVal, newVal);
    if (attrName === 'dropdown-view') {
      this.$$off(this._onBreakpointChange);
      this.$$on(this._onBreakpointChange);
      this._onBreakpointChange();
    }
  }

  /** Renders {@link UIPSnippetsList} element */
  protected _renderSnippetsList(): void {
    switch (this.model?.snippets.length) {
      case 0: return;
      case 1:
        this.prepend(this.$title);
        break;
      default:
        this.prepend(this.$trigger, this.$toggleable);
        break;
    }
  }

  @listen({event: 'uip:root:ready', target: ($this: UIPPlugin) => $this.$root})
  protected _onRootReady(): void {
    this._renderSnippetsList();
    this._onBreakpointChange();
  }

  @listen({
    event: 'change',
    target: (snippets: UIPSnippets) => ESLMediaQuery.for(snippets.dropdownView)
  })
  protected _onBreakpointChange(): void {
    const isDropdown = ESLMediaQuery.for(this.dropdownView).matches;
    // Toggleable is open in tabs mode
    this.$toggleable.toggle(!isDropdown);
    this.$$attr('view', isDropdown ? 'dropdown' : 'tabs');
  }

  @listen('esl:before:hide')
  protected _onBeforeHide(e: Event): void {
    // Prevent hide toggleable in inactive state (tabs)
    if (e.target === this.$toggleable && !this.isDropdown) e.preventDefault();
  }
}

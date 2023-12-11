import {ESLBaseElement} from '@exadel/esl/modules/esl-base-element/core';
import {memoize, boolAttr, listen} from '@exadel/esl/modules/esl-utils/decorators';

import {UIPStateModel} from './model';

import type {UIPSnippetTemplate} from './snippet';

/**
 * UI Playground root custom element definition
 * Container element for {@link UIPPlugin} components
 * Defines the bounds of UI Playground instance
 * Shares the {@link UIPStateModel} instance between {@link UIPPlugin}-s
 */
export class UIPRoot extends ESLBaseElement {
  public static is = 'uip-root';

  /** CSS query for snippets */
  public static SNIPPET_SEL = '[uip-snippet]';

  /** Indicates that the UIP components' theme is dark */
  @boolAttr() public darkTheme: boolean;
  /** Indicates that the direction of the preview content is RTL direction */
  @boolAttr() public rtlDirection: boolean;

  @boolAttr({readonly: true}) public ready: boolean;

  /** {@link UIPStateModel} instance to store UI Playground state */
  @memoize()
  public get model(): UIPStateModel {
    return new UIPStateModel();
  }

  /** Collects snippets template-holders */
  public get $snippets(): UIPSnippetTemplate[] {
    return Array.from(this.querySelectorAll(UIPRoot.SNIPPET_SEL));
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.initSnippets();
    this.$$attr('ready', true);
    this.$$fire('uip:root:ready', {bubbles: false});
  }

  /** Initial initialization of snippets */
  protected initSnippets(): void {
    this.model.snippets = this.$snippets;
    this.model.applyCurrentSnippet(this);
  }

  @listen({event: 'uip:model:change', target: ($this: UIPRoot) => $this.model})
  protected onModelChange({detail}: CustomEvent): void {
    this.dispatchEvent(new CustomEvent('uip:change', {detail}));
  }
}

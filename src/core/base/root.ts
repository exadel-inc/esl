import {ESLBaseElement} from '@exadel/esl/modules/esl-base-element/core';
import {memoize, boolAttr} from '@exadel/esl/modules/esl-utils/decorators';

import {UIPStateModel} from './model';

import type {SnippetTemplate} from './model';
import type {AnyToVoidFnSignature} from '@exadel/esl/modules/esl-utils/misc/functions';

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

  /** {@link UIPStateModel} instance to store UI Playground state */
  @memoize()
  public get model(): UIPStateModel {
    return new UIPStateModel();
  }

  /** Collects snippets template-holders */
  public get $snippets(): SnippetTemplate[] {
    return Array.from(this.querySelectorAll(UIPRoot.SNIPPET_SEL));
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.initSnippets();
  }

  /** Alias for {@link this.model.addListener} */
  public addStateListener(listener: AnyToVoidFnSignature): void {
    this.model.addListener(listener);
  }

  /** Alias for {@link this.model.removeListener} */
  public removeStateListener(listener: AnyToVoidFnSignature): void {
    this.model.removeListener(listener);
  }

  /** Initial initialization of snippets */
  protected initSnippets(): void {
    this.model.snippets = this.$snippets;
    this.model.applySnippet(this.model.activeSnippet, this);
  }
}

import {ESLBaseElement} from '@exadel/esl/modules/esl-base-element/core';
import {
  memoize,
  boolAttr,
  listen,
  prop
} from '@exadel/esl/modules/esl-utils/decorators';

import {UIPStateModel} from './model';

import type {UIPSnippetTemplate} from './snippet';
import {UIPChangeEvent} from './model.change';
import type {UIPChangeInfo} from './model.change';

/**
 * UI Playground root custom element definition
 * Container element for {@link UIPPlugin} components
 * Defines the bounds of UI Playground instance
 * Shares the {@link UIPStateModel} instance between {@link UIPPlugin}-s
 */
export class UIPRoot extends ESLBaseElement {
  public static is = 'uip-root';
  public static observedAttributes = ['dark-theme'];

  /** Event dispatching on the {@link UIPRoot} ready state */
  @prop('uip:root:ready') public READY_EVENT: string;
  /** Event dispatching on the {@link UIPStateModel} state change */
  @prop('uip:change') public CHANGE_EVENT: string;
  /** Event dispatching on the {@link UIPStateModel} current snippet change */
  @prop('uip:snippet:change') public SNIPPET_CHANGE_EVENT: string;
  /** Event dispatching on the {@link UIPRoot} theme attribute change */
  @prop('uip:theme:change') public THEME_CHANGE_EVENT: string;

  /** CSS query for snippets */
  public static SNIPPET_SEL = '[uip-snippet]';

  /** Indicates that the UIP components' theme is dark */
  @boolAttr() public darkTheme: boolean;

  /** Indicates ready state of the uip-root */
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

  protected delyedScrollIntoView(): void {
    setTimeout(() => {
      this.scrollIntoView({behavior: 'smooth', block: 'start'});
    }, 100);
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.model.snippets = this.$snippets;
    this.model.applyCurrentSnippet(this);
    this.$$attr('ready', true);
    this.$$fire(this.READY_EVENT, {bubbles: false});

    if (this.model.anchorSnippet) {
      this.delyedScrollIntoView();
    }
  }

  protected override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.model.snippets = [];
  }

  protected attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ): void {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === 'dark-theme') {
      this.$$fire(this.THEME_CHANGE_EVENT, {
        detail: this.darkTheme,
        bubbles: false
      });
    }
  }

  @listen({event: 'uip:model:change', target: ($this: UIPRoot) => $this.model})
  protected onModelChange({detail}: CustomEvent<UIPChangeInfo[]>): void {
    this.dispatchEvent(new UIPChangeEvent(this.CHANGE_EVENT, this, detail));
  }

  @listen({
    event: 'uip:model:snippet:change',
    target: ($this: UIPRoot) => $this.model
  })
  protected onSnippetChange({detail}: CustomEvent): void {
    this.$$fire(this.SNIPPET_CHANGE_EVENT, {detail, bubbles: false});
  }
}

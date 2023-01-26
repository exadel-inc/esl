import {EventUtils} from '@exadel/esl/modules/esl-utils/dom/events';
import {boolAttr, ESLBaseElement} from '@exadel/esl/modules/esl-base-element/core';
import {memoize} from '@exadel/esl/modules/esl-utils/decorators/memoize';
import type {AnyToVoidFnSignature} from '@exadel/esl/modules/esl-utils/misc/functions';

import {SnippetTemplate, UIPStateModel} from './model';

/**
 * UI Playground root custom element definition
 * Container element for {@link UIPPlugin} components
 * Define the bounds of UI Playground instance
 * Share the {@link UIPStateModel} instance between {@link UIPPlugin}-s
 */
export class UIPRoot extends ESLBaseElement {
  public static is = 'uip-root';
  static observedAttributes = ['dark-theme', 'settings-collapsed', 'editor-collapsed', 'rtl-direction'];

  /** CSS query for snippets */
  public static SNIPPET_SEL = '[uip-snippet]';

  /** Indicates that the UIP components' theme is dark */
  @boolAttr() public darkTheme: boolean;
  /** Collapsed settings state marker */
  @boolAttr() public settingsCollapsed: boolean;
  /** Collapsed editor state marker */
  @boolAttr() public editorCollapsed: boolean;
  /** Indicates that the direction of the preview content is RTL direction */
  @boolAttr() public rtlDirection: boolean;

  /** {@link UIPStateModel} instance to store UI Playground state */
  @memoize()
  public get model(): UIPStateModel {
    return new UIPStateModel();
  }

  /** Collect snippets template-holders */
  public get $snippets(): SnippetTemplate[] {
    return Array.from(this.querySelectorAll(UIPRoot.SNIPPET_SEL));
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.initSnippets();
  }

  /** Alias for {@link this.model.addListener}. */
  public addStateListener(listener: AnyToVoidFnSignature) {
    this.model.addListener(listener);
  }

  /** Alias for {@link this.model.removeListener}. */
  public removeStateListener(listener: AnyToVoidFnSignature) {
    this.model.removeListener(listener);
  }

  /** Initial initialization of snippets */
  protected initSnippets(): void {
    this.model.snippets = this.$snippets;
    this.model.applySnippet(this.model.snippets[0], this);
  }

  protected attributeChangedCallback(attrName: string, oldVal: string | null, newVal: string | null) {
    if (oldVal === newVal) return;
    if (['rtl-direction', 'dark-theme'].includes(attrName)) {
      this.classList.toggle(attrName, newVal !== null);
    }
    // setTimeout to let other plugins init before dispatching
    setTimeout(() => {
      EventUtils.dispatch(this, 'uip:configchange', {
        bubbles: false,
        detail: {
          attribute: attrName,
          value: newVal
        }
      });
    });
  }
}

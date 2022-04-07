import {EventUtils} from '@exadel/esl/modules/esl-utils/dom/events';
import {boolAttr, ESLBaseElement} from '@exadel/esl/modules/esl-base-element/core';
import {SnippetTemplate, UIPStateModel} from './model';
import {AnyToVoidFnSignature} from '@exadel/esl/modules/esl-utils/misc/functions';

/**
 * UI Playground root custom element definition,
 * container element for {@link UIPPlugin} components.
 * Define the bounds of UI Playground instance.
 * Share the {@link UIPStateModel} instance between {@link UIPPlugin}-s.
 */
export class UIPRoot extends ESLBaseElement {
  public static is = 'uip-root';
  private _model = new UIPStateModel();

  /** CSS query for snippets. */
  public static SNIPPET_SEL = '[uip-snippet]';

  /** Indicates that the UIP components' theme is dark. */
  @boolAttr() public darkTheme: boolean;
  /** Collapsed settings state marker. */
  @boolAttr() public settingsCollapsed: boolean;
  /** Collapsed editor state marker. */
  @boolAttr() public editorCollapsed: boolean;
  /** Indicates that the direction of the preview content is RTL direction. */
  @boolAttr() public rtlDirection: boolean;

  static get observedAttributes() {
    return ['dark-theme', 'settings-collapsed', 'editor-collapsed', 'rtl-direction'];
  }

  /** {@link UIPStateModel} instance to store UI Playground state. */
  public get model(): UIPStateModel {
    return this._model;
  }

  protected connectedCallback() {
    super.connectedCallback();
    this._model.snippets = this.$snippets;
  }

  /** Alias for {@link this.model.addListener}. */
  public addStateListener(listener: AnyToVoidFnSignature) {
    this._model.addListener(listener);
  }

  /** Alias for {@link this.model.removeListener}. */
  public removeStateListener(listener: AnyToVoidFnSignature) {
    this._model.removeListener(listener);
  }

  protected attributeChangedCallback(attrName: string, oldVal: string | null, newVal: string | null) {
    if (oldVal === newVal) return;
    if (['rtl-direction', 'dark-theme'].includes(attrName)) {
      this._updateStyles(attrName, newVal);
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

  private _updateStyles(option: string, value: string | null) {
    this.classList.toggle(option, value !== null);
  }

  public get $snippets(): SnippetTemplate[] {
    return Array.from(this.querySelectorAll(UIPRoot.SNIPPET_SEL));
  }
}

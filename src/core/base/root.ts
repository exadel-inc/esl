import {EventUtils} from '@exadel/esl/modules/esl-utils/dom/events';
import {attr, ESLBaseElement} from '@exadel/esl/modules/esl-base-element/core';
import {UIPStateModel} from './model';
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

  /**
   * Attribute for controlling UIP components' theme.
   * Has two values: `uip-light` and `uip-dark`.
   */
  @attr({defaultValue: 'uip-light'}) public theme: string;

  /**
   * Attributes for settings, editor, visibility state.
   * Has two values: `expanded` and `collapsed`.
   */
  @attr({defaultValue: 'expanded'}) public settings: string;
  @attr({defaultValue: 'expanded'}) public editor: string;

  /**
   * Attribute for controlling preview's content direction.
   * Has two values: `LTR` and `RTL`.
   */
  @attr({defaultValue: 'ltr'}) public direction: string;

  static get observedAttributes() {
    return ['theme', 'settings', 'editor', 'direction'];
  }

  /** {@link UIPStateModel} instance to store UI Playground state. */
  public get model(): UIPStateModel {
    return this._model;
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.theme = String(this.theme);
    this.direction = String(this.direction);
    this._model.registerSnippets(this.$snippets);
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();
  }

  /** Alias for {@link this.model.addListener}. */
  public addStateListener(listener: AnyToVoidFnSignature) {
    this._model.addListener(listener);
  }

  /** Alias for {@link this.model.removeListener}. */
  public removeStateListener(listener: AnyToVoidFnSignature) {
    this._model.removeListener(listener);
  }

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
    if (oldVal === newVal) return;
    if (['direction', 'theme'].includes(attrName)) {
      this._updateStyles(attrName, oldVal, newVal);
    }
    EventUtils.dispatch(this, 'uip:configchange', {
      bubbles: false,
      detail: {
        attribute: attrName,
        value: newVal
      }
    });
  }

  protected _updateStyles(option: string, prev: string, next: string) {
    this.classList.remove(`${prev}-${option}`);
    this.classList.add(`${next}-${option}`);
  }

  public get $snippets(): HTMLTemplateElement[] {
    const snippets = this.querySelectorAll(UIPRoot.SNIPPET_SEL);
    return Array.from(snippets) as HTMLTemplateElement[];
  }
}

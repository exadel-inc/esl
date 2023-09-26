import {Observable} from '@exadel/esl/modules/esl-utils/abstract/observable';
import {decorate} from '@exadel/esl/modules/esl-utils/decorators';
import {microtask} from '@exadel/esl/modules/esl-utils/async';

import {UIPPlugin} from './plugin';
import {UIPRoot} from './root';
import {UIPHtmlNormalizationService} from '../utils/normalization';

/** Type for function to change attribute's current value */
export type TransformSignature = (current: string | null) => string | boolean | null;

/** Config for changing attribute's value */
export type ChangeAttrConfig = {
  /** CSS query to find target elements */
  target: string,
  /** Attribute to change */
  attribute: string,
  /** Changes initiator */
  modifier: UIPPlugin | UIPRoot
} & ({
  /** New {@link attribute} value */
  value: string | boolean
} | {
  /**
   * Function to transform(update)
   * {@link attribute} value
   */
  transform: TransformSignature
});

/** Type for both <script> or <template> containers */
export type SnippetTemplate = HTMLTemplateElement | HTMLScriptElement;


/**
 * State holder class to store current UIP markup state
 * Provides methods to modify the state
 * @extends Observable
 */
export class UIPStateModel extends Observable {
  /** Current markup state */
  private _html = new DOMParser().parseFromString('', 'text/html').body;
  /** Last {@link UIPPlugin} element which changed markup */
  private _lastModifier: UIPPlugin | UIPRoot;

  /** Snippets {@link SnippetTemplate template-holders} */
  private _snippets: SnippetTemplate[];
  /** Current active {@link SnippetTemplate template-holder} */
  private _activeSnippet: SnippetTemplate;

  /**
   * Sets current markup state to the passed one
   * @param markup - new state
   * @param modifier - plugin, that initiates the change
   */
  public setHtml(markup: string, modifier: UIPPlugin | UIPRoot) {
    const html = UIPHtmlNormalizationService.normalize(markup);
    const root = new DOMParser().parseFromString(html, 'text/html').body;
    if (!root || root.innerHTML.trim() !== this.html.trim()) {
      this._html = root;
      this._lastModifier = modifier;
      this.dispatchChange();
    }
  }

  /** Current markup state getter */
  public get html(): string {
    return this._html ? this._html.innerHTML : '';
  }

  /** Last markup state modifier */
  public get lastModifier(): UIPPlugin | UIPRoot {
    return this._lastModifier;
  }

  /** Snippets template-holders getter */
  public get snippets(): SnippetTemplate[] {
    return this._snippets;
  }

  /** Sets snippets template-holders */
  public set snippets(snippets: SnippetTemplate[]) {
    this._snippets = snippets;
  }

  /** Current active {@link SnippetTemplate} getter */
  public get activeSnippet(): SnippetTemplate {
    if (!this._activeSnippet) {
      this._activeSnippet = this.snippets
        .find((snippet: SnippetTemplate) => snippet.hasAttribute('active')) || this.snippets[0];
    }
    return this._activeSnippet;
  }

  public set activeSnippet(snippet: SnippetTemplate) {
    this._activeSnippet.removeAttribute('active');
    snippet.setAttribute('active', '');
    this._activeSnippet = snippet;
  }

  /** Changes current active snippet */
  public applySnippet(snippet: SnippetTemplate, modifier: UIPPlugin | UIPRoot) {
    if (!snippet) return;
    this.activeSnippet = snippet;
    this.setHtml(snippet.innerHTML, modifier);
  }

  /**
   * Gets attribute values for the matched set of elements
   * @param target - CSS sector to define target elements
   * @param attr - attribute name
   * @returns array of matched elements attribute value (uses the element placement order)
   */
  public getAttribute(target: string, attr: string): (string | null)[] {
    return Array.from(this._html.querySelectorAll(target)).map(el => el.getAttribute(attr));
  }

  /** Applies change config to current markup */
  public changeAttribute(cfg: ChangeAttrConfig) {
    const {target, attribute, modifier} = cfg;
    const elements = Array.from(this._html.querySelectorAll(target));
    if (!elements.length) return;

    UIPStateModel.setAttribute(elements, attribute, 'transform' in cfg ? cfg.transform : cfg.value);
    this._lastModifier = modifier;
    this.dispatchChange();
  }

  /** Plans microtask to dispatch model change event */
  @decorate(microtask)
  protected dispatchChange() {
    this.fire();
  }

  /**
   * Changes element attribute according to `transform` argument
   * @param elements - elements to apply changes
   * @param attr - attribute name
   * @param transform - value or function to change attribute value
   */
  protected static setAttribute(elements: Element[], attr: string, transform: TransformSignature | string | boolean): void {
    elements.forEach(el => {
      const transformed = typeof transform === 'function' ? transform(el.getAttribute(attr)) : transform;
      if (typeof transformed === 'string') {
        el.setAttribute(attr, transformed);
      } else {
        transformed ? el.setAttribute(attr, '') : el.removeAttribute(attr);
      }
    });
  }
}

import {Observable} from '@exadel/esl/modules/esl-utils/abstract/observable';
import {UIPPlugin} from './plugin';
import {UIPRoot} from './root';

/** Type for function to change attribute's current value. */
export type TransformSignature = (current: string | null) => string | boolean | null;

/** Config for changing attribute's value. */
export type ChangeAttrConfig = {
  /** CSS query to find target elements. */
  target: string,
  /** Attribute to change. */
  attribute: string,
  /** Changes initiator. */
  modifier: UIPPlugin | UIPRoot
} & ({
  /** New {@link attribute} value. */
  value: string | boolean
} | {
  /**
   * Function to transform(update)
   * {@link attribute} value.
   */
  transform: TransformSignature
});

/** Type for both <script> or <template> containers. */
export type SnippetTemplate = HTMLTemplateElement | HTMLScriptElement;


// TODO: ts docs!
/**
 * State holder class to store current UIP markup state.
 * Provides methods to modify the state.
 * @extends Observable
 */
export class UIPStateModel extends Observable {
  private _html = new DOMParser().parseFromString('', 'text/html').body;
  /** Last {@link UIPPlugin} element which changed markup. */
  private _lastModifier: UIPPlugin | UIPRoot;
  private _isFired = false;

  private _snippets: SnippetTemplate[];
  private _activeSnippet: SnippetTemplate;

  /**
   * Set current markup state to the passed one.
   * @param markup - new state
   * @param modifier - plugin, that initiate the change
   */
  public setHtml(markup: string, modifier: UIPPlugin | UIPRoot) {
    const root = new DOMParser().parseFromString(markup, 'text/html').body;

    if (!root || root.innerHTML !== this.html) {
      this._html = root;
      this._lastModifier = modifier;
      this.dispatchChange();
    }
  }

  public get html(): string {
    return this._html ? this._html.innerHTML : '';
  }

  public get lastModifier(): UIPPlugin | UIPRoot {
    return this._lastModifier;
  }

  public get snippets(): SnippetTemplate[] {
    return this._snippets;
  }

  public set snippets(snippets: SnippetTemplate[]) {
    this._snippets = snippets;
  }

  public get activeSnippet(): SnippetTemplate {
    return this._activeSnippet;
  }

  public applySnippet(snippet: SnippetTemplate, modifier: UIPPlugin | UIPRoot) {
    if (snippet) {
      this._activeSnippet = snippet;
      this.setHtml(snippet.innerHTML, modifier);
    }
  }

  /**
   * Get attribute values for the matched set of elements.
   * @param target - CSS sector to define target elements
   * @param attr - attribute name
   * @returns array of matched elements attribute value (uses the element placement order)
   */
  public getAttribute(target: string, attr: string): (string | null)[] {
    return Array.from(this._html.querySelectorAll(target)).map(el => el.getAttribute(attr));
  }

  /** Apply change config to current markup. */
  public changeAttribute(cfg: ChangeAttrConfig) {
    const {target, attribute, modifier} = cfg;
    const elements = Array.from(this._html.querySelectorAll(target));
    if (!elements.length) return;

    UIPStateModel.setAttribute(elements, attribute, 'transform' in cfg ? cfg.transform : cfg.value);
    this._lastModifier = modifier;
    this.dispatchChange();
  }



  /**
   * Planes microtask to dispatch model change event
   */
  protected dispatchChange() {
    if (!this._isFired) {
      this._isFired = true;
      Promise.resolve().then(() => {
        this.fire();
        this._isFired = false;
      });
    }
  }

  protected static setAttribute(elements: Element[], attr: string, transform: TransformSignature | string | boolean) {
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

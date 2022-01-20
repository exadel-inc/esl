import {Observable} from '@exadel/esl/modules/esl-utils/abstract/observable';
import {UIPPlugin} from './plugin';

/** Type for function to change attribute's current value. */
export type TransformSignature = (current: string | null) => string | boolean | null;

/** Config for changing attribute's value. */
export type ChangeAttrConfig = {
  /** CSS query to find target elements. */
  target: string,
  /** Attribute to change. */
  attribute: string,
  /** Changes initiator. */
  modifier: UIPPlugin
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

/**
 * State holder class to store current UIP markup state.
 * Provides methods to modify the state.
 * @extends Observable
 */
export class UIPStateModel extends Observable {
  private _html = new DOMParser().parseFromString('', 'text/html').body;
  /** Last {@link UIPPlugin} element which changed markup. */
  private _lastModifier: UIPPlugin;

  private _snippets: HTMLTemplateElement[];
  private _activeSnippet: HTMLTemplateElement;

  /**
   * Set current markup state to the passed one.
   * @param markup - new state
   * @param modifier - plugin, that initiate the change
   */
  public setHtml(markup: string, modifier: UIPPlugin) {
    const root = new DOMParser().parseFromString(markup, 'text/html').body;

    if (!root || root.innerHTML !== this.html) {
      this._html = root;
      this._lastModifier = modifier;
      this.fire();
    }
  }

  public get html(): string {
    return this._html ? this._html.innerHTML : '';
  }

  public get lastModifier() {
    return this._lastModifier;
  }

  public get snippets() {
    return this._snippets;
  }

  public get activeSnippet() {
    return this._activeSnippet;
  }

  public registerSnippets(snippets: HTMLTemplateElement[]) {
    this._snippets = snippets;
  }

  public applySnippet(snippet: HTMLTemplateElement, modifier: UIPPlugin) {
    this._activeSnippet = snippet;
    this.setHtml(snippet.innerHTML, modifier);
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
    this.fire();
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

import {SyntheticEventTarget} from '@exadel/esl/modules/esl-utils/dom';
import {decorate} from '@exadel/esl/modules/esl-utils/decorators';
import {microtask} from '@exadel/esl/modules/esl-utils/async';

import {
  UIPJSNormalizationPreprocessors,
  UIPHTMLNormalizationPreprocessors,
  UIPNoteNormalizationPreprocessors
} from '../processors/normalization';

import {UIPSnippetItem} from './snippet';

import type {UIPRoot} from './root';
import type {UIPPlugin} from './plugin';
import type {UIPSnippetTemplate} from './snippet';
import type {UIPChangeInfo} from './model.change';
import type {UIPEditableSource} from './source';

/** Type for function to change attribute's current value */
export type TransformSignature = (
  current: string | null
) => string | boolean | null;

/** Config for changing attribute's value */
export type ChangeAttrConfig = {
  /** CSS query to find target elements */
  target: string;
  /** Attribute to change */
  attribute: string;
  /** Changes initiator */
  modifier: UIPPlugin | UIPRoot;
} & ({
  /** New {@link attribute} value */
  value: string | boolean;
} | {
  /**
   * Function to transform(update)
   * {@link attribute} value
   */
  transform: TransformSignature;
});


/**
 * State holder class to store current UIP state
 * Provides methods to modify the state
 */
export class UIPStateModel extends SyntheticEventTarget {
  /** Snippets {@link UIPSnippetItem} value objects */
  private _snippets: UIPSnippetItem[];

  /** Current js state */
  private _js: string = '';
  /** Current note state */
  private _note: string = '';
  /** Current markup state */
  private _html = new DOMParser().parseFromString('', 'text/html').body;

  /** Last changes history (used to dispatch changes) */
  private _changes: UIPChangeInfo[] = [];

  /**
   * Sets current js state to the passed one
   * @param js - new state
   * @param modifier - plugin, that initiates the change
   */
  public setJS(js: string, modifier: UIPPlugin | UIPRoot): void {
    const script = this.normalizeJS(js);
    if (this._js === script) return;
    this._js = script;
    this._changes.push({modifier, type: 'js', force: true});
    this.dispatchChange();
  }

  protected normalizeJS(snippet: string): string {
    return UIPJSNormalizationPreprocessors.preprocess(snippet);
  }

  /**
   * Sets current note state to the passed one
   * @param text - new state
   * @param modifier - plugin, that initiates the change
   */
  public setNote(text: string, modifier: UIPPlugin | UIPRoot): void {
    const note = UIPNoteNormalizationPreprocessors.preprocess(text);
    if (this._note === note) return;
    this._note = note;
    this._changes.push({modifier, type: 'note'});
    this.dispatchChange();
  }

  /**
   * Sets current markup state to the passed one
   * @param markup - new state
   * @param modifier - plugin, that initiates the change
   * @param force - marker, that indicates if html changes require iframe rerender
   */
  public setHtml(markup: string, modifier: UIPPlugin | UIPRoot, force: boolean = false): void {
    const root = this.normalizeHTML(markup);
    if (root.innerHTML.trim() === this.html.trim()) return;
    this._html = root;
    this._changes.push({modifier, type: 'html', force});
    this.dispatchChange();
  }

  protected normalizeHTML(snippet: string): HTMLElement {
    const html = UIPHTMLNormalizationPreprocessors.preprocess(snippet);
    const {head, body: root} = new DOMParser().parseFromString(html, 'text/html');

    Array.from(head.children).reverse().forEach((el) => {
      if (el.tagName !== 'STYLE') return;
      root.innerHTML = '\n' + root.innerHTML;
      root.insertBefore(el, root.firstChild);
    });

    return root;
  }

  public isHTMLChanged(): boolean {
    if (!this.activeSnippet) return false;
    return this.normalizeHTML(this.activeSnippet.html).innerHTML.trim() !== this.html.trim();
  }

  public isJSChanged(): boolean {
    if (!this.activeSnippet) return false;
    return this.normalizeJS(this.activeSnippet.js) !== this.js;
  }

  public reset(source: UIPEditableSource, modifier: UIPPlugin | UIPRoot): void {
    if (source === 'html') this.resetHTML(modifier);
    if (source === 'js') this.resetJS(modifier);
  }

  protected resetJS(modifier: UIPPlugin | UIPRoot): void {
    if (this.activeSnippet) this.setJS(this.activeSnippet.js, modifier);
  }

  protected resetHTML(modifier: UIPPlugin | UIPRoot): void {
    if (this.activeSnippet) this.setHtml(this.activeSnippet.html, modifier);
  }


  /** Current js state getter */
  public get js(): string {
    return this._js;
  }

  /** Current markup state getter */
  public get html(): string {
    return this._html ? this._html.innerHTML : '';
  }

  /** Current note state getter */
  public get note(): string {
    return this._note;
  }

  /** Snippets template-holders getter */
  public get snippets(): UIPSnippetItem[] {
    return this._snippets;
  }

  /** Sets snippets template-holders */
  public set snippets(snippets: (UIPSnippetItem | UIPSnippetTemplate)[]) {
    this._snippets = snippets.map((snippet) => {
      if (snippet instanceof UIPSnippetItem) return snippet;
      return new UIPSnippetItem(snippet);
    });
  }

  /** Current active {@link UIPSnippetItem} getter */
  public get activeSnippet(): UIPSnippetItem | undefined {
    return this._snippets.find((snippet) => snippet.active);
  }

  /** Snippet that relates to current anchor */
  public get anchorSnippet(): UIPSnippetItem | undefined {
    const anchor = window.location.hash.slice(1);
    return this._snippets.find((snippet) => snippet.anchor === anchor);
  }

  /** Changes current active snippet */
  public applySnippet(
    snippet: UIPSnippetItem,
    modifier: UIPPlugin | UIPRoot
  ): void {
    if (!snippet) return;
    this._snippets.forEach((s) => (s.active = s === snippet));
    this.setHtml(snippet.html, modifier, true);
    this.setJS(snippet.js, modifier);
    this.setNote(snippet.note, modifier);
    this.dispatchEvent(
      new CustomEvent('uip:model:snippet:change', {detail: this})
    );
  }
  /** Applies an active snippet from DOM */
  public applyCurrentSnippet(modifier: UIPPlugin | UIPRoot): void {
    const activeSnippet = this.anchorSnippet || this.activeSnippet || this.snippets[0];
    this.applySnippet(activeSnippet, modifier);
  }

  /**
   * Gets attribute values for the matched set of elements
   * @param target - CSS sector to define target elements
   * @param attr - attribute name
   * @returns array of matched elements attribute value (uses the element placement order)
   */
  public getAttribute(target: string, attr: string): (string | null)[] {
    return Array.from(this._html.querySelectorAll(target))
      .map((el) => el.getAttribute(attr));
  }

  /** Applies change config to current markup */
  public changeAttribute(cfg: ChangeAttrConfig): void {
    const {target, attribute, modifier} = cfg;
    const elements = Array.from(this._html.querySelectorAll(target));
    if (!elements.length) return;

    UIPStateModel.setAttribute(
      elements,
      attribute,
      'transform' in cfg ? cfg.transform : cfg.value
    );
    this._changes.push({modifier, type: 'html'});
    this.dispatchChange();
  }

  /** Plans microtask to dispatch model change event */
  @decorate(microtask)
  protected dispatchChange(): void {
    if (!this._changes.length) return;
    const detail = this._changes;
    this._changes = [];
    this.dispatchEvent(
      new CustomEvent('uip:model:change', {detail})
    );
  }

  /**
   * Changes element attribute according to `transform` argument
   * @param elements - elements to apply changes
   * @param attr - attribute name
   * @param transform - value or function to change attribute value
   */
  protected static setAttribute(
    elements: Element[],
    attr: string,
    transform: TransformSignature | string | boolean
  ): void {
    elements.forEach((el) => {
      const transformed =
        typeof transform === 'function'
          ? transform(el.getAttribute(attr))
          : transform;
      if (typeof transformed === 'string') {
        el.setAttribute(attr, transformed);
      } else {
        transformed ? el.setAttribute(attr, '') : el.removeAttribute(attr);
      }
    });
  }
}

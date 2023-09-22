// Prevent Prism from auto-highlighting
window.Prism = window.Prism || {};
if (typeof Prism.manual === 'undefined') Prism.manual = true;

import React from 'jsx-dom';
import Prism from 'prismjs';

import {CodeJar} from 'codejar';

import {debounce} from '@exadel/esl/modules/esl-utils/async/debounce';
import {bind, decorate, memoize} from '@exadel/esl/modules/esl-utils/decorators';

import {UIPPlugin} from '../../core/base/plugin';

/**
 * Editor {@link UIPPlugin} custom element definition
 * Uses Codejar code editor to provide an ability to modify UIP state markup
 * @extends UIPPlugin
 */
export class UIPEditor extends UIPPlugin {
  public static override is = 'uip-editor';

  /** Highlight method declaration  */
  public static highlight = (editor: HTMLElement): void => Prism.highlightElement(editor, false);

  /** Wrapped {@link https://medv.io/codejar/ Codejar} editor instance */
  @memoize()
  protected get editor(): CodeJar {
    return CodeJar(this.$code, UIPEditor.highlight, { tab: '\t' });
  }

  @memoize()
  protected get $code(): HTMLElement {
    return (<pre class='language-html editor-content'><code/></pre>) as HTMLElement;
  }

  /** @returns editor's content */
  public get value(): string {
    return this.editor.toString();
  }

  /** Preformat and set editor's content */
  public set value(value: string) {
    this.editor.updateCode(value);
  }

  protected override connectedCallback() {
    super.connectedCallback();
    this.innerHTML = '';

    // Prefill content
    this.appendChild(this.$inner);
    this.$inner.classList.add('esl-scrollable-content');
    this.$inner.append(<esl-scrollbar target="::parent"/>);
    this.$inner.append(this.$code);

    // Initial update
    this._onRootStateChange();
    // Postpone subscription
    Promise.resolve().then(() => this.editor?.onUpdate(this._onChange));
  }

  protected override disconnectedCallback(): void {
    this.editor?.destroy();
    memoize.clear(this, 'editor');
    super.disconnectedCallback();
  }

  /** Callback to call on editor's content changes */
  @decorate(debounce, 1000)
  protected _onChange() {
    this.model!.setHtml(this.value, this);
  }

  /** Change editor's markup from markup state changes */
  @bind
  protected _onRootStateChange(): void {
    if (this.model!.lastModifier === this) return;
    this.value = this.model!.html;
  }
}

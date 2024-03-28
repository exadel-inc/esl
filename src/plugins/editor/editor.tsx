// Prevent Prism from auto-highlighting
window.Prism = window.Prism || {};
if (typeof Prism.manual === 'undefined') Prism.manual = true;

import React from 'jsx-dom';
import Prism from 'prismjs';

import {CodeJar} from 'codejar';

import {debounce} from '@exadel/esl/modules/esl-utils/async/debounce';
import {attr, boolAttr, decorate, listen, memoize} from '@exadel/esl/modules/esl-utils/decorators';

import {UIPPluginPanel} from '../../core/panel/plugin-panel';
import {CopyIcon} from '../copy/copy-button.icon';

import {EditorIcon} from './editor.icon';

import type {UIPChangeEvent} from '../../core/base/model.change';

/**
 * Editor {@link UIPPlugin} custom element definition
 * Uses Codejar code editor to provide an ability to modify UIP state markup
 */
export class UIPEditor extends UIPPluginPanel {
  public static override is = 'uip-editor';
  public static override observedAttributes = ['copy', ...UIPPluginPanel.observedAttributes];

  /** Highlight method declaration  */
  public static highlight = (editor: HTMLElement): void => Prism.highlightElement(editor, false);

  /** Source for Editor plugin (default: 'html') */
  @attr({defaultValue: 'html'}) public source: 'js' | 'javascript' | 'html';

  /** Marker to display copy widget */
  @boolAttr({name: 'copy'}) public showCopy: boolean;

  protected override get $icon(): JSX.Element {
    return <EditorIcon/>;
  }

  protected override get $label(): JSX.Element {
    return <span className={'uip-plugin-header-title' + `${this.isJsReadonly ? ' readonly' : ''}`}>
      {this.label + `${this.isJsReadonly ? ' (readonly)' : ''}`}</span>;
  }

  @memoize()
  protected override get $toolbar(): HTMLElement {
    const type = this.constructor as typeof UIPEditor;
    return (
      <div className={type.is + '-toolbar uip-plugin-header-toolbar'}>
        {this.showCopy ? <uip-copy class={type.is + '-header-copy'} source={this.source}><CopyIcon/></uip-copy> : ''}
      </div>
    ) as HTMLElement;
  }

  /** {@link UIPEditor} section wrapper */
  @memoize()
  protected get $inner(): HTMLDivElement {
    const type = this.constructor as typeof UIPPluginPanel;
    return (
      <div className={`${type.is}-inner uip-plugin-inner uip-plugin-inner-bg`}>
        <esl-scrollbar class={type.is + '-scrollbar'} target="::next"/>
        <div className={type.is + '-container esl-scrollable-content'}>
          {this.$code}
        </div>
      </div>
    ) as HTMLDivElement;
  }

  /** Code block */
  @memoize()
  protected get $code(): HTMLElement {
    const type = this.constructor as typeof UIPEditor;
    const lang = this.source === 'js' ? 'javascript' : this.source;
    return (<pre class={type.is + '-code language-' + lang}><code/></pre>) as HTMLElement;
  }

  /** Wrapped [CodeJar](https://medv.io/codejar/) editor instance */
  @memoize()
  protected get editor(): CodeJar {
    return CodeJar(this.$code, UIPEditor.highlight, {tab: '\t'});
  }

  public get isJsReadonly(): boolean {
    return !this.model?.activeSnippet?.isolated && this.source !== 'html';
  }

  /** @returns editor's content */
  public get value(): string {
    return this.editor.toString();
  }

  /** Preformat and set editor's content */
  public set value(value: string) {
    if (this.isJsReadonly) {
      this.$code.textContent = value.trim();
      UIPEditor.highlight(this.$code);
    } else this.editor.updateCode(value);
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.innerHTML = '';

    // Prefill content
    this.appendChild(this.$header);
    this.appendChild(this.$inner);
    this.appendChild(this.$resize);

    // Initial update
    this._onRootStateChange();
    // Postpone subscription
    if (!this.isJsReadonly) {
      Promise.resolve().then(() => this.editor?.onUpdate(this._onChange));
    }
  }

  protected override disconnectedCallback(): void {
    this.editor?.destroy();
    memoize.clear(this, 'editor');
    super.disconnectedCallback();
  }

  protected override attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    super.attributeChangedCallback(attrName, oldVal, newVal);
    this.$header.remove();
    this.$toolbar.remove();
    memoize.clear(this, ['$header', '$toolbar']);
    this.insertAdjacentElement('afterbegin', this.$header);
  }

  /** Callback to call on an editor's content changes */
  @decorate(debounce, 2000)
  protected _onChange(): void {
    switch (this.source) {
      case 'js':
      case 'javascript':
        this.model!.setJS(this.value, this);
        break;
      case 'html':
        this.model!.setHtml(this.value, this);
    }
  }

  /** Change editor's markup from markup state changes */
  @listen({event: 'uip:change', target: ($this: UIPEditor) => $this.$root})
  protected _onRootStateChange(e?: UIPChangeEvent): void {
    if (e && e.isOnlyModifier(this)) return;
    switch (this.source) {
      case 'js':
      case 'javascript':
        if (e && !e.jsChanges.length) return;
        this.value = this.model!.js;
        break;
      case 'html':
        if (e && !e.htmlChanges.length) return;
        this.value = this.model!.html;
    }
  }
}

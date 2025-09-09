// Prevent Prism from auto-highlighting
window.Prism = window.Prism || {};
if (typeof Prism.manual === 'undefined') Prism.manual = true;

import React from 'jsx-dom';
import Prism from 'prismjs';

import {CodeJar} from 'codejar';

import {debounce} from '@exadel/esl/modules/esl-utils/async/debounce';
import {attr, decorate, listen, memoize} from '@exadel/esl/modules/esl-utils/decorators';

import {parseBoolean, toBooleanAttribute} from '@exadel/esl/modules/esl-utils/misc/format';
import {UIPPluginPanel} from '../../core/panel/plugin-panel';
import {CopyIcon} from '../copy/copy-button.icon';
import {ResetIcon} from '../reset/reset-button.icon';
import {UIPDefaults} from '../../core/config/config';
import {EditorIcon} from './editor.icon';

import type {UIPSnippetsList} from '../snippets-list/snippets-list';
import type {UIPChangeEvent} from '../../core/base/model.change';
import type {UIPEditableSource} from '../../core/base/source';

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
  @attr({defaultValue: 'html'}) public source: UIPEditableSource;

  /** Marker to display copy widget */
  @attr({defaultValue: () => UIPDefaults.for('editor').label}) public label: string;

  /** Marker to display copy widget */
  @attr({parser: parseBoolean, serializer: toBooleanAttribute, name: 'copy', defaultValue: () => UIPDefaults.for('editor').copy})
  public showCopy: boolean;

  /** Marker to make enable toggle collapse action for section header. @see UIPPluginPanel */
  @attr({parser: parseBoolean, serializer: toBooleanAttribute, defaultValue: () => UIPDefaults.for('editor').collapsible})
  public collapsible: boolean;

  /** Marker that indicates resizable state of the panel. @see UIPPluginPanel */
  @attr({parser: parseBoolean, serializer: toBooleanAttribute, defaultValue: () => UIPDefaults.for('editor').resizable})
  public resizable: boolean;


  protected override get $icon(): JSX.Element {
    return <EditorIcon/>;
  }

  @memoize()
  protected override get $toolbar(): HTMLElement {
    const type = this.constructor as typeof UIPEditor;
    return (
      <div className={type.is + '-toolbar uip-plugin-header-toolbar'}>
        {this.showCopy ? <uip-copy class={type.is + '-header-copy'} source={this.source}><CopyIcon/></uip-copy> : ''}
        {this.$root?.storeKey ? <uip-reset class={type.is + '-header-reset'} source={this.source}><ResetIcon/></uip-reset> : ''}
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
        <div className={`uip-plugin-content ${type.is}-container esl-scrollable-content`}>
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

  /** @returns if editing is allowed */
  public get editable(): boolean {
    return !this.$$cls('readonly');
  }
  /** Changes editor readonly mode */
  public set editable(value: boolean) {
    this.$$cls('readonly', !value);
    if (value) {
      this.$code.contentEditable = 'plaintext-only';
      // FF doesn't support 'plaintext-only' mode
      if (this.$code.contentEditable !== 'plaintext-only') this.$code.contentEditable = 'true';
    } else {
      this.$code.contentEditable = 'false';
    }
  }

  /** @returns if the editor is in js readonly mode */
  public get isSnippetEditable(): boolean {
    return this.source !== 'js' || !this.model?.activeSnippet?.isJsReadonly;
  }

  /** @returns editor's content */
  public get value(): string {
    return this.editor.toString();
  }

  /** Preformat and set editor's content */
  public set value(value: string) {
    this.editor.updateCode(value);
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
    this._onSnippetChange();
    // Postpone subscription
    Promise.resolve().then(() => this.editor?.onUpdate(this._onChange));
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
    if (!this.editable) return;
    if (this.source === 'js') this.model!.setJS(this.value, this);
    if (this.source === 'html') this.model!.setHtml(this.value, this);
  }

  /** Change editor's markup from markup state changes */
  @listen({event: 'uip:change', target: ($this: UIPEditor) => $this.$root})
  protected _onRootStateChange(e?: UIPChangeEvent): void {
    if (e && e.isOnlyModifier(this)) return;

    if (
      (this.source === 'js' && (!e || e.jsChanges.length)) ||
      (this.source === 'html' && (!e || e.htmlChanges.length))
    ) this.value = this.model![this.source];
  }

  /** Handles snippet change to set readonly value */
  @listen({event: 'uip:snippet:change', target: ($this: UIPSnippetsList) => $this.$root})
  protected _onSnippetChange(): void {
    this.editable = this.isSnippetEditable;
  }
}

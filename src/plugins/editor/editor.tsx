// Prevent Prism from auto-highlighting
window.Prism = window.Prism || {};
if (typeof Prism.manual === 'undefined') Prism.manual = true;

import React from 'jsx-dom';
import Prism from 'prismjs';

import {CodeJar} from 'codejar';

import {debounce} from '@exadel/esl/modules/esl-utils/async/debounce';
import {bind, boolAttr, decorate, listen, memoize} from '@exadel/esl/modules/esl-utils/decorators';

import {UIPPlugin} from '../../core/base/plugin';
import {UIPOptionIcons} from '../header/options/option-icons';

/**
 * Editor {@link UIPPlugin} custom element definition
 * Uses Codejar code editor to provide an ability to modify UIP state markup
 */
export class UIPEditor extends UIPPlugin {
  public static override is = 'uip-editor';
  public static override observedAttributes = ['collapsible', 'copy', 'label'];

  /** Highlight method declaration  */
  public static highlight = (editor: HTMLElement): void => Prism.highlightElement(editor, false);

  /** Marker to collapse editor area */
  @boolAttr() public collapsed: boolean;

  /** Marker to make enable toggle collapse action for section header */
  @boolAttr() public collapsible: boolean;

  /** Marker to display copy widget */
  @boolAttr({name: 'copy'}) public showCopy: boolean;

  /** Header section block */
  @memoize()
  protected get $header(): HTMLElement {
    const type = this.constructor as typeof UIPEditor;
    return (
      <div class={type.is + '-header ' + (this.label ? '' : 'no-label')}>
        <span class={type.is + '-header-title'}>{this.label}</span>
        {this.showCopy ? <uip-copy class={type.is + '-header-copy'}>{UIPOptionIcons.copySVG}</uip-copy> : ''}
        {this.collapsible ? <button class={type.is + '-header-trigger'} aria-label="Collapse/expand"/> : ''}
      </div>
    ) as HTMLElement;
  }

  /** {@link UIPEditor} section wrapper */
  @memoize()
  protected get $inner(): HTMLDivElement {
    const type = this.constructor as typeof UIPPlugin;
    return (
      <div className={`${type.is}-inner uip-plugin-inner`}>
        <esl-scrollbar class={type.is + '-scrollbar'} target="::next"/>
        <div class={type.is + '-container esl-scrollable-content'}>
          {this.$code}
        </div>
      </div>
    ) as HTMLDivElement;
  }

  /** Code block */
  @memoize()
  protected get $code(): HTMLElement {
    const type = this.constructor as typeof UIPEditor;
    return (<pre class={type.is + '-code language-html'}><code/></pre>) as HTMLElement;
  }

  /** Wrapped {@link https://medv.io/codejar/ CodeJar} editor instance */
  @memoize()
  protected get editor(): CodeJar {
    return CodeJar(this.$code, UIPEditor.highlight, {tab: '\t'});
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

  protected override attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    super.attributeChangedCallback(attrName, oldVal, newVal);
    this.$header.remove();
    memoize.clear(this, '$header');
    this.insertAdjacentElement('afterbegin', this.$header);
  }

  @listen({
    event: 'click',
    selector: `.${UIPEditor.is}-header-trigger`,
  })
  protected _onClick(): void {
    if (this.collapsible) this.collapsed = !this.collapsed;
  }

  /** Callback to call on editor's content changes */
  @decorate(debounce, 1000)
  protected _onChange(): void {
    this.model!.setHtml(this.value, this);
  }

  /** Change editor's markup from markup state changes */
  @bind
  protected override _onRootStateChange(): void {
    if (this.model!.lastModifier === this) return;
    this.value = this.model!.html;
  }
}

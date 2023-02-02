import {debounce} from '@exadel/esl/modules/esl-utils/async/debounce';
import {jsonAttr} from '@exadel/esl/modules/esl-base-element/core';
import {bind, decorate, memoize, listen} from '@exadel/esl/modules/esl-utils/decorators';

import {UIPPlugin} from '../../core/registration';
import {EditorConfig, AceTheme} from './ace/utils';
import type {AceEditor} from './ace/ace-editor';

/**
 * Editor {@link UIPPlugin} custom element definition
 * Uses ACE UI code editor to provide an ability to modify UIP state markup
 * @extends UIPPlugin
 */
export class UIPEditor extends UIPPlugin {
  public static is = 'uip-editor';
  /** Attribute to trigger editor's collapsing */
  private static collapsedAttribute = 'editor-collapsed';

  /** Editor's {@link EditorConfig} passed through attribute */
  @jsonAttr({defaultValue: {}})
  public editorConfig: Partial<EditorConfig>;
  /** Wrapped {@link https://ace.c9.io/ Ace} editor instance */
  protected editor: AceEditor;

  protected connectedCallback() {
    super.connectedCallback();
    this.innerHTML = '';
    this.appendChild(this.$inner);

    if (this.root && !this.root.hasAttribute(UIPEditor.collapsedAttribute)) {
      this.initEditor();
    }
  }

  protected disconnectedCallback(): void {
    this.editor?.destroy();
    this.resizeObserver.unobserve(this);
    super.disconnectedCallback();
  }

  /** Initialize inner {@link https://ace.c9.io/ Ace} editor */
  protected initEditor(): Promise<void> {
    if (this.editor) {
      return Promise.resolve();
    }

    return import(/* webpackChunkName: "ace-editor" */ './ace/ace-editor').then((Ace) => {
      this.resizeObserver.observe(this);
      this.editor = new Ace.Editor(this.$inner);
      this.editor.setConfig(this.editorConfig);
      this._onRootStateChange();
    });
  }

  /** Callback to call on editor's content changes */
  @listen('change')
  @decorate(debounce, 1000)
  protected _onChange() {
    this.model!.setHtml(this.editor.getValue(), this);
  }

  /** Change editor's markup from markup state changes */
  @bind
  protected _onRootStateChange(): void {
    if (this.model!.lastModifier === this) return;

    const markup = this.model!.html;
    setTimeout(() => this.editor && this.editor.setValue(markup));
  }

  /**
   * Merge passed editorConfig with current editorConfig
   * @param {Partial<EditorConfig>} editorConfig - config to merge
   */
  public updateEditorConfig(editorConfig: Partial<EditorConfig>): void {
    this.editorConfig = {
      ...this.editorConfig,
      ...editorConfig,
    };

    this.editor?.setConfig(this.editorConfig);
  }

  /**
   * Observer to prevent editor's content from overflowing
   * when toggling settings section or sidebar
   */
  @memoize()
  protected get resizeObserver(): ResizeObserver {
    return new ResizeObserver(debounce(() => this.editor.resize(), 500));
  }

  /** Callback to catch theme changes from {@link UIPRoot} */
  @listen({event: 'uip:configchange', target: '::parent(.uip-root)'})
  protected _onRootConfigChange(e: CustomEvent) {
    const attr = e.detail.attribute;
    const value = e.detail.value;

    switch (attr) {
      case 'dark-theme':
        return this.updateEditorConfig({theme: value === null ? AceTheme.Light : AceTheme.Dark});
      case 'editor-collapsed':
        value === null && this.initEditor();
        return this.classList.toggle('collapsed', value !== null);
      default:
        return;
    }
  }
}

import {bind} from '@exadel/esl/modules/esl-utils/decorators/bind';
import {debounce} from '@exadel/esl/modules/esl-utils/async/debounce';
import {jsonAttr} from '@exadel/esl/modules/esl-base-element/core';
import {listen} from '@exadel/esl/modules/esl-utils/decorators/listen';

import {UIPPlugin} from '../../core/registration';
import {EditorConfig, AceTheme} from './ace/utils';
import type {AceEditor} from './ace/ace-editor';
import {decorate, memoize} from '@exadel/esl';

/**
 * Editor UIPPlugin custom element definition.
 * Uses ACE UI code editor to provide an ability to modify UIP state markup.
 * @extends UIPPlugin
 */
export class UIPEditor extends UIPPlugin {
  public static is = 'uip-editor';
  private static collapsedAttribute = 'editor-collapsed';
  /** Default [config]{@link EditorConfig} instance. */
  public static defaultOptions: EditorConfig = {
    theme: 'ace/theme/chrome',
    printMarginColumn: -1,
    wrap: true,
    minLines: 8,
    maxLines: 22,
  };

  /** Editor's {@link EditorConfig config} passed through attribute. */
  @jsonAttr({defaultValue: {}})
  public editorConfig: Partial<EditorConfig>;
  /** Wrapped {@link https://ace.c9.io/ Ace} editor instance. */
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
    this.editor.destroy();
    this.resizeObserver.unobserve(this);
    super.disconnectedCallback();
  }

  /** Initialize inner {@link https://ace.c9.io/ Ace} editor. */
  protected initEditor(): Promise<void> {
    if (this.editor) {
      return Promise.resolve();
    }

    return import(/* webpackChunkName: "ace-editor" */ './ace/ace-editor').then((Ace) => {
      this.resizeObserver.observe(this);
      this.editor = new Ace.Editor(this.$inner);
      this._onRootStateChange();
      this.editor.setConfig(this.editorConfig);
    });
  }

  /** Callback to call on editor's content changes. */
  @listen('change')
  @decorate(debounce, 1000)
  private _onChange() {
    this.model!.setHtml(this.editor.getValue(), this);
  }

  @bind
  protected _onRootStateChange(): void {
    if (this.model!.lastModifier === this) return;

    const markup = this.model!.html;
    setTimeout(() => this.editor && this.editor.setValue(markup));
  }

  /**
   * Merges passed editorConfig with current editorConfig.
   * @param {Partial<EditorConfig>} editorConfig - config to merge.
   */
  public updateEditorConfig(editorConfig: Partial<EditorConfig>): void {
    this.editorConfig = {
      ...this.editorConfig,
      ...editorConfig,
    };

    this.editor?.setConfig(this.editorConfig);
  }

  /* prevents editor content from overflowing when toggling settings section or sidebar */
  @memoize()
  protected get resizeObserver(): ResizeObserver {
    return new ResizeObserver(debounce(() => this.editor.resize(), 500));
  }

  /** Callback to catch theme changes from {@link UIPRoot}. */
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

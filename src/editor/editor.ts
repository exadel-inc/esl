import js_beautify from 'js-beautify';
import {Ace, edit} from 'ace-builds';
import 'ace-builds/src-min-noconflict/mode-html';
import 'ace-builds/src-min-noconflict/theme-chrome';
import 'ace-builds/src-min-noconflict/theme-tomorrow_night';

import {bind} from '@exadel/esl/modules/esl-utils/decorators/bind';
import {debounce} from '@exadel/esl/modules/esl-utils/async/debounce';
import {jsonAttr} from '@exadel/esl/modules/esl-base-element/core';

import {UIPPlugin} from '../core/plugin';

interface EditorConfig {
  theme: string;
  mode: string;
  printMarginColumn: number;
  wrap: number;
}

export class UIPEditor extends UIPPlugin {
  public static is = 'uip-editor';
  public static defaultOptions = {
    theme: 'ace/theme/chrome',
    mode: 'ace/mode/html',
    printMarginColumn: -1,
    wrap: true,
  };

  @jsonAttr()
  public editorConfig: EditorConfig;
  protected editor: Ace.Editor;

  protected get mergedEditorConfig(): EditorConfig {
    const type = (this.constructor as typeof UIPEditor);
    return Object.assign({}, type.defaultOptions, this.editorConfig || {});
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.initEditor();
  }

  protected initEditor() {
    this.innerHTML = '';
    this.appendChild(this.$inner);

    this.editor = edit(this.$inner);
    this.editor.setOption('useWorker', false);

    this.initEditorOptions();
  }

  protected initEditorOptions(): void {
    this.editor?.setOptions(this.mergedEditorConfig);
  }

  protected onChange = debounce(() => {
    this.model!.setHtml(this.editor.getValue(), this);
  }, 1000);

  @bind
  protected _onRootStateChange(): void {
    if (this.model!.lastModifier === this) return;

    const markup = this.model!.html;
    this.editor && this.setEditorValue(markup);
  }

  protected setEditorValue(value: string): void {
    this.editor.removeEventListener('change', this.onChange);
    this.editor.setValue(js_beautify.html(value), -1);
    this.editor.addEventListener('change', this.onChange);
  }

  public setEditorConfig(editorConfig: EditorConfig): void {
    this.editorConfig = editorConfig;
    this.initEditorOptions();
  }
}

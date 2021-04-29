import ace from 'brace';
import 'brace/theme/chrome';
import 'brace/theme/tomorrow_night';
import 'brace/mode/html';
import js_beautify from 'js-beautify';

import {debounce} from '@exadel/esl/modules/esl-utils/async/debounce';
import {jsonAttr} from '@exadel/esl/modules/esl-base-element/core';
import {UIPPlugin} from '../core/plugin';
import {bind} from '@exadel/esl';

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
    wrap: 120,
  };

  @jsonAttr()
  public editorConfig: EditorConfig;
  protected editor: ace.Editor;

  protected get mergedEditorConfig(): EditorConfig {
    const type = (this.constructor as typeof UIPEditor);
    return Object.assign({}, type.defaultOptions, this.editorConfig || {});
  }

  protected initEditorOptions(): void {
    this.editor?.setOptions(this.mergedEditorConfig);
  }

  protected onChange = debounce(() => {
    this.dispatchChange(this.editor.getValue());
  }, 1000);

  @bind
  protected handleChange(e: CustomEvent): void {
    const {markup} = e.detail;
    const $inner = document.createElement('div');
    $inner.classList.add('uip-editor-inner');
    $inner.id = 'uip-editor';
    this.innerHTML = $inner.outerHTML;
    this.editor = ace.edit('uip-editor');

    this.initEditorOptions();
    this.editor.$blockScrolling = Infinity;
    this.setEditorValue(markup);
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


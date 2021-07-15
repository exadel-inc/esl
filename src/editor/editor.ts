import js_beautify from 'js-beautify';
import {Ace, edit} from 'ace-builds';
import 'ace-builds/src-min-noconflict/mode-html';
import 'ace-builds/src-min-noconflict/theme-chrome';
import 'ace-builds/src-min-noconflict/theme-tomorrow_night';

import {bind} from '@exadel/esl/modules/esl-utils/decorators/bind';
import {debounce} from '@exadel/esl/modules/esl-utils/async/debounce';
import {jsonAttr} from '@exadel/esl/modules/esl-base-element/core';

import {UIPPlugin} from '../core/plugin';

/**
 * Config for customizing editor's behaviour
 * @property {string} theme - editor's appearance theme
 * @property {string} mode - text mode used
 * @property {number} printMarginColumn - position of the vertical line for wrapping
 * @property {number} warp - limit of characters before wrapping
 */
interface EditorConfig {
  theme: string;
  mode: string;
  printMarginColumn: number;
  wrap: number;
}

export class UIPEditor extends UIPPlugin {
  public static is = 'uip-editor';
  /** Default [config]{@link EditorConfig} used by editor */
  public static defaultOptions = {
    theme: 'ace/theme/chrome',
    mode: 'ace/mode/html',
    printMarginColumn: -1,
    wrap: true,
  };

  /** Editor's [config]{@link EditorConfig} passed through attribute */
  @jsonAttr()
  public editorConfig: EditorConfig;
  protected editor: Ace.Editor;

  /** Merges [default config]{@link defaultOptions} with editor's [config]{@link editorConfig} */
  protected get mergedEditorConfig(): EditorConfig {
    const type = (this.constructor as typeof UIPEditor);
    return Object.assign({}, type.defaultOptions, this.editorConfig || {});
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.initEditor();
  }

  /** Initialization of Ace editor */
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

  /** Setting editor's value after markup changes
   * @see [onRootStateChange]{@link UIPPlugin#_onRootStateChange} */
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

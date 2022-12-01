import js_beautify from 'js-beautify';
import {Ace, edit} from 'ace-builds';
import 'ace-builds/src-min-noconflict/mode-html';
import 'ace-builds/src-min-noconflict/theme-chrome';
import 'ace-builds/src-min-noconflict/theme-tomorrow_night';

import {EditorConfig, Theme} from './utils';

/** {@link https://ace.c9.io/ Ace} editor wrapper. */
class AceEditor {
  /** Inner {@link https://ace.c9.io/ Ace} instance. */
  private editor: Ace.Editor;
  /** Callback to run on editor's content changes. */
  private changeCallback: Function;
  /** Default ace editor's options. */
  private static defaultConfig: EditorConfig = {
    theme: Theme.Light,
    printMarginColumn: -1,
    wrap: true,
  };

  /**
   * @param {HTMLElement} element - element to place editor inside.
   * @param {Function=} changeCallback - callback to run on editor's content changes.
   */
  constructor(element: HTMLElement, changeCallback: Function = () => {}) {
    this.editor = edit(element);
    this.changeCallback = changeCallback;
    this.editor.addEventListener('change', changeCallback);  
    this.editor.setOption('useWorker', false);
    this.editor.setOption('mode', 'ace/mode/html');
  }

  /** Update editor's options.
   * @param {Partial<EditorConfig>} config - new options to set.
   */
  public setConfig(config: Partial<EditorConfig>): void {
    this.editor.setOptions({
      ...AceEditor.defaultConfig,
      ...config
    });
  }

  /** Set editor's text content.
   * @param {string} value - text content to set.
   */
  public setValue(value: string): void {
    this.editor.removeEventListener('change', this.changeCallback);
    this.editor.setValue(js_beautify.html(value), -1);
    this.editor.addEventListener('change', this.changeCallback);
  }

  /** @returns Editor's text content. */
  public getValue(): string {
    return this.editor.getValue();
  }

  /** Manually cleanup internal event listeners. */
  public destroy(): void {
    this.editor.removeEventListener('change', this.changeCallback);
  }
}

export type {AceEditor};
export const Editor = AceEditor;

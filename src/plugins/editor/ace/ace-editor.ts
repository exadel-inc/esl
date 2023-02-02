import js_beautify from 'js-beautify';
import {Ace, edit} from 'ace-builds';
import 'ace-builds/src-min-noconflict/mode-html';
import 'ace-builds/src-min-noconflict/theme-chrome';
import 'ace-builds/src-min-noconflict/theme-tomorrow_night';
import {bind} from '@exadel/esl/modules/esl-utils/decorators/bind';
import {SyntheticEventTarget} from '@exadel/esl/modules/esl-utils/dom/events/target';

import {EditorConfig, AceTheme} from './utils';

/** {@link https://ace.c9.io/ Ace} editor wrapper */
class AceEditor extends SyntheticEventTarget {
  /** Inner {@link https://ace.c9.io/ Ace} instance */
  private editor: Ace.Editor;
  /** Default {@link EditorConfig} options */
  private static defaultConfig: EditorConfig = {
    theme: AceTheme.Light,
    printMarginColumn: -1,
    wrap: true,
    minLines: 8,
    maxLines: 22,
  };

  /**
   * @param {HTMLElement} element - element to place editor inside
   */
  constructor(element: HTMLElement) {
    super();
    this.editor = edit(element);
    this.editor.addEventListener('change', this._onChange);
    this.editor.setOption('useWorker', false);
    this.editor.setOption('mode', 'ace/mode/html');
  }

  /** Merge config with the default one
   * @param {Partial<EditorConfig>} config - new options to set
   */
  public setConfig(config: Partial<EditorConfig>): void {
    this.editor.setOptions({
      ...AceEditor.defaultConfig,
      ...config
    });
  }

  /** Set editor's text content
   * @param {string} value - text content to set
   */
  public setValue(value: string): void {
    this.editor.removeEventListener('change', this._onChange);
    this.editor.setValue(js_beautify.html(value), -1);
    this.editor.addEventListener('change', this._onChange);
  }

  /** @returns editor's text content */
  public getValue(): string {
    return this.editor.getValue();
  }

  /** Manually resize editor */
  public resize(): void {
    this.editor.resize();
  }

  /** Cleanup internal event listeners */
  public destroy(): void {
    this.editor.removeEventListener('change', this._onChange);
  }

  /** Handle editor's content change */
  @bind
  private _onChange() {
    this.dispatchEvent(new CustomEvent('change'));
  }
}

export type {AceEditor};
export const Editor = AceEditor;

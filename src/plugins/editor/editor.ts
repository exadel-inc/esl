import js_beautify from 'js-beautify';
import {Ace, edit} from 'ace-builds';
import 'ace-builds/src-min-noconflict/mode-html';
import 'ace-builds/src-min-noconflict/theme-chrome';
import 'ace-builds/src-min-noconflict/theme-tomorrow_night';

import {bind} from '@exadel/esl/modules/esl-utils/decorators/bind';
import {debounce} from '@exadel/esl/modules/esl-utils/async/debounce';
import {jsonAttr} from '@exadel/esl/modules/esl-base-element/core';

import {UIPPlugin} from '../../core/registration';
import {listen} from '@exadel/esl/modules/esl-utils/decorators/listen';

/** Config interface to define inner ACE editor settings. */
interface EditorConfig {
  /** Editor's appearance theme. */
  theme?: string;
  /** Position of the vertical line for wrapping. */
  printMarginColumn?: number;
  /** Limit of characters before wrapping. */
  wrap?: number | boolean;
}

/** Interface to represent {@link UIPEditor's} theme. */
interface Theme {
  [index: string]: string;
}

/**
 * Editor UIPPlugin custom element definition.
 * Uses ACE UI code editor to provide an ability to modify UIP state markup.
 * @extends UIPPlugin
 */
export class UIPEditor extends UIPPlugin {
  public static is = 'uip-editor';
  /** Default [config]{@link EditorConfig} instance. */
  public static defaultOptions: EditorConfig = {
    theme: 'ace/theme/chrome',
    printMarginColumn: -1,
    wrap: true,
  };

  /** Object to map dark/light themes to [Ace]{@link https://ace.c9.io/} themes. */
  static themesMapping: Theme = {
    'uip-light': 'ace/theme/chrome',
    'uip-dark': 'ace/theme/tomorrow_night'
  };

  /** Editor's [config]{@link EditorConfig} passed through attribute. */
  @jsonAttr()
  public editorConfig: EditorConfig;
  /** Wrapped [Ace]{@link https://ace.c9.io/} editor instance. */
  protected editor: Ace.Editor;

  /** {@link editorConfig} merged with {@link defaultOptions}. */
  protected get mergedEditorConfig(): EditorConfig {
    const type = (this.constructor as typeof UIPEditor);
    return Object.assign({}, type.defaultOptions, this.editorConfig || {});
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.initEditor();
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();
  }

  /** Initialize [Ace]{@link https://ace.c9.io/} editor. */
  protected initEditor() {
    this.innerHTML = '';
    this.appendChild(this.$inner);

    this.editor = edit(this.$inner);
    this.editor.setOption('useWorker', false);
    this.editor.setOption('mode', 'ace/mode/html');
    this.initEditorOptions();

    this._handlePageResize();
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
    setTimeout(() => this.editor && this.setEditorValue(markup));
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

  /* prevents editor content from overflowing when toggling settings section or sidebar */
  protected _handlePageResize() {
    const obs = new ResizeObserver(debounce(() => this.editor.resize(),500));

    obs.observe(this);
  }


  /** Callback to catch theme changes from {@link UIPRoot}. */
  @listen({event: 'uip:configchange', target: '::parent(.uip-root)'})
  protected _onRootConfigChange(e: CustomEvent) {
    const attr = e.detail.attribute;
    const value = e.detail.value;

    switch (attr) {
      case 'dark-theme':
        return this.setEditorConfig({theme: value === null ?
            UIPEditor.defaultOptions.theme : UIPEditor.themesMapping['uip-dark']});
      case 'editor-collapsed':
        return this.classList.toggle('collapsed', value !== null);
      default:
        return;
    }
  }
}

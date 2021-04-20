import ace from 'brace';
import 'brace/theme/chrome';
import 'brace/theme/tomorrow_night';
import 'brace/mode/html';
import js_beautify from 'js-beautify';

import {debounce} from '@exadel/esl/modules/esl-utils/async/debounce';
import {jsonAttr, attr} from '@exadel/esl/modules/esl-base-element/core';
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
    wrap: 120,
  };

  @jsonAttr()
  public editorConfig: EditorConfig;
  protected editor: ace.Editor;

  @attr({defaultValue: 'Editor'}) public label: string;

  protected connectedCallback(): void {
    super.connectedCallback();

    this.editor = ace.edit(this);
    this.initEditorOptions();

    this.editor.$blockScrolling = Infinity;
    this.editor.addEventListener('change', this.onChange);

    this.setEditorValue(this.root?.state || '');
  }

  protected disconnectedCallback() {
    this.editor.removeEventListener('change', this.onChange);
    super.disconnectedCallback();
  }

  protected get mergedEditorConfig() {
    const type = (this.constructor as typeof UIPEditor);
    return Object.assign({}, type.defaultOptions, this.editorConfig || {});
  }

  protected initEditorOptions(): void {
    this.editor.setOptions(this.mergedEditorConfig);
  }

  protected onChange = debounce(() => {
    this.dispatchChange(this.editor.getValue());
  }, 1000);

  protected handleChange(e: CustomEvent) {
    const {markup} = e.detail;
    this.setEditorValue(markup);

    if (!this.closest('.editor-wrapper')) {
      this.renderWrapper();
    }
  }

  protected renderWrapper() {
    const $wrapper = document.createElement('div');
    $wrapper.className = 'editor-wrapper';

    $wrapper.innerHTML = `
        <span class="section-name">${this.label}</span>
        <uip-editor editor-config='{wrap: 70}'></uip-editor>`;
    this.parentElement?.replaceChild($wrapper, this);
  }

  protected setEditorValue(value: string): void {
    this.editor.removeEventListener('change', this.onChange);
    this.editor.setValue(js_beautify.html(value), -1);
    this.editor.addEventListener('change', this.onChange);
  }

  public setEditorConfig(editorConfig: EditorConfig) {
    this.editorConfig = editorConfig;
    this.initEditorOptions();
  }
}


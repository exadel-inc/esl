import * as ace from 'brace';
import 'brace/theme/chrome';
import 'brace/theme/tomorrow_night';
import 'brace/mode/html';
import js_beautify from 'js-beautify';

import {debounce} from '@exadel/esl/modules/esl-utils/async/debounce';
import {bind} from '@exadel/esl/modules/esl-utils/decorators/bind';
import {UIPRoot} from '../core/root';
import {ESLBaseElement, jsonAttr, attr} from '@exadel/esl/modules/esl-base-element/core';
import {EventUtils} from '@exadel/esl/modules/esl-utils/dom/events';

interface EditorConfig {
  theme: string;
  mode: string;
  printMarginColumn: number;
  wrap: number;
}

export class UIPEditor extends ESLBaseElement {
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
  protected playground: UIPRoot;

  @attr({defaultValue: 'Editor'}) public label: string;

  protected connectedCallback(): void {
    super.connectedCallback();
    this.playground = this.closest(`${UIPRoot.is}`) as UIPRoot;

    if (!this.playground) return;

    this.playground.addEventListener('state:change', this.setMarkup);

    this.editor = ace.edit(this);
    this.initEditorOptions();

    this.editor.$blockScrolling = Infinity;
    this.editor.addEventListener('change', this.onChange);

    this.setEditorValue(this.playground.state);
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();
    this.editor.removeEventListener('change', this.onChange);
    this.playground && this.playground.removeEventListener('state:change', this.setMarkup);
  }

  protected get mergedEditorConfig() {
    const type = (this.constructor as typeof UIPEditor);
    return Object.assign({}, type.defaultOptions, this.editorConfig || {});
  }

  protected initEditorOptions(): void {
    this.editor.setOptions(this.mergedEditorConfig);
  }

  protected onChange = debounce(() => {
    EventUtils.dispatch(this, 'request:change', {detail: {source: UIPEditor.is, markup: this.editor.getValue()}});
  }, 1000);

  @bind
  protected setMarkup(e: CustomEvent): void {
    const {markup, source} = e.detail;
    if (source === UIPEditor.is) return;
    this.setEditorValue(markup);
    if (!this.closest('.editor-wrapper')) {
      this.renderWrapper();
    }
  }

  protected renderWrapper() {
    const $wrapper = document.createElement('div');
    $wrapper.className = 'editor-wrapper';

    if (this.label) $wrapper.innerHTML = `<span class="section-name">${this.label}</span>`;
    $wrapper.innerHTML += `<uip-editor></uip-editor>`;
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


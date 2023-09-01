import React from 'jsx-dom';

import {debounce} from '@exadel/esl/modules/esl-utils/async/debounce';
import {bind, decorate, jsonAttr} from '@exadel/esl/modules/esl-utils/decorators';

import {UIPPlugin} from '../../core/registration';
import {JarEditor} from './jar/jar-editor';
import {EditorConfig} from './jar/jar-utils';

/**
 * Editor {@link UIPPlugin} custom element definition
 * Uses Codejar code editor to provide an ability to modify UIP state markup
 * @extends UIPPlugin
 */
export class UIPEditor extends UIPPlugin {
  public static is = 'uip-editor';
  /** Wrapped {@link https://medv.io/codejar/ Codejar} editor instance */
  protected editor: JarEditor;
  /** Editor's {@link EditorConfig} passed through attribute */
  @jsonAttr({defaultValue: {wrap: 60}})
  private editorConfig: Partial<EditorConfig>;

  protected connectedCallback() {
    super.connectedCallback();
    this.innerHTML = '';
    this.appendChild(this.$inner);
    this.initEditor();
  }

  protected disconnectedCallback(): void {
    this.editor.removeEventListener(this._onChange);
    this.editor?.destroy();
    super.disconnectedCallback();
  }

  /** Initialize inner {@link https://medv.io/codejar/ Codejar} editor */
  protected initEditor(): void {
    const codeBlock = (<pre class='language-html editor-content'><code/></pre>) as HTMLPreElement;
    this.$inner.classList.add('esl-scrollable-content');
    this.$inner.append(<esl-scrollbar target="::parent"></esl-scrollbar> as HTMLElement);
    this.$inner.append(codeBlock);

    this.editor = new JarEditor(codeBlock, this.editorConfig);
    this.editor.addEventListener('uip:editor-change', this._onChange);
    this._onRootStateChange();
  }

  /** Callback to call on editor's content changes */
  @decorate(debounce, 1000)
  protected _onChange() {
    this.model!.setHtml(this.editor.getValue(), this);
  }

  /** Change editor's markup from markup state changes */
  @bind
  protected _onRootStateChange(): void {
    if (this.model!.lastModifier === this) return;
    const markup = this.model!.html;
    setTimeout(() => this.editor?.setValue(markup));
  }
}

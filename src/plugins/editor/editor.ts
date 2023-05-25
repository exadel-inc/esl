import {debounce} from '@exadel/esl/modules/esl-utils/async/debounce';
import {bind, decorate, listen} from '@exadel/esl/modules/esl-utils/decorators';

import {UIPPlugin} from '../../core/registration';
import {EditorConfig, AceTheme} from './jar/utils';
import {JarEditor} from './jar/jar-editor';

/**
 * Editor {@link UIPPlugin} custom element definition
 * @extends UIPPlugin
 */
export class UIPEditor extends UIPPlugin {
  public static is = 'uip-editor';
  protected editor: JarEditor;

  protected connectedCallback() {
    super.connectedCallback();
    this.innerHTML = '';
    this.appendChild(this.$inner);
    this.initEditor();
  }

  protected disconnectedCallback(): void {
    this.editor?.destroy();
    super.disconnectedCallback();
  }

  protected initEditor(): void {
    const codeBlock = document.createElement('pre');
    codeBlock.classList.add('language-html');
    codeBlock.append(document.createElement('code'));
    this.$inner.append(codeBlock);

    this.editor = new JarEditor(codeBlock);
    this.editor.addEventListener('editor-change', this._onChange);
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

  /**
   * Merge passed editorConfig with current editorConfig
   * @param {Partial<EditorConfig>} editorConfig - config to merge
   */
  public updateEditorConfig(editorConfig: Partial<EditorConfig>): void {
  }

  /** Callback to catch theme changes from {@link UIPRoot} */
  @listen({event: 'uip:configchange', target: '::parent(.uip-root)'})
  protected _onRootConfigChange(e: CustomEvent) {
    const attr = e.detail.attribute;
    const value = e.detail.value;

    if (attr === 'dark-theme') {
      return this.updateEditorConfig({theme: value === null ? AceTheme.Light : AceTheme.Dark});
    }
  }
}

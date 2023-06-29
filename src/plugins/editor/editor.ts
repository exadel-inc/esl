import {debounce} from '@exadel/esl/modules/esl-utils/async/debounce';
import {bind, decorate} from '@exadel/esl/modules/esl-utils/decorators';

import {UIPPlugin} from '../../core/registration';
import {JarEditor} from './jar/jar-editor';

/**
 * Editor {@link UIPPlugin} custom element definition
 * Uses Codejar code editor to provide an ability to modify UIP state markup
 * @extends UIPPlugin
 */
export class UIPEditor extends UIPPlugin {
  public static is = 'uip-editor';
  /** Wrapped {@link https://medv.io/codejar/ Codejar} editor instance */
  protected editor: JarEditor;

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
}

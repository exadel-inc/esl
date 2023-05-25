import {CodeJar} from 'codejar';
import {withLineNumbers} from 'codejar/linenumbers';
import Prism from 'prismjs';
import 'prismjs/plugins/normalize-whitespace/prism-normalize-whitespace';
import {bind} from '@exadel/esl/modules/esl-utils/decorators/bind';
import {SyntheticEventTarget} from '@exadel/esl/modules/esl-utils/dom/events/target';

export class JarEditor extends SyntheticEventTarget {
  private editor: CodeJar;

  /**
   * @param {HTMLElement} element - element to place editor inside
   */
  constructor(element: HTMLElement) {
    super();
    this.editor = CodeJar(element, withLineNumbers(Prism.highlightElement as any), {tab: '\t'});
    this.editor.onUpdate(this._onChange);
  }

  /** Set editor's text content
   * @param {string} value - text content to set
   */
  public setValue(value: string): void {
    value = this.normalize(value);
    this.editor.updateCode(value);
  }

  /** @returns editor's text content */
  public getValue(): string {
    return this.editor.toString();
  }

  /** Cleanup internal event listeners */
  public destroy(): void {
    this.editor.destroy();
  }

  private normalize(markup: string): string {
    return Prism.plugins.NormalizeWhitespace.normalize(markup);
  }

  /** Handle editor's content change */
  @bind
  private _onChange() {
    this.dispatchEvent(new CustomEvent('editor-change'));
  }
}

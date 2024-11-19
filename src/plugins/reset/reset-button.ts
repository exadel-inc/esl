import './reset-button.shape';

import {listen, attr} from '@exadel/esl/modules/esl-utils/decorators';

import {UIPPluginButton} from '../../core/button/plugin-button';
import {UIPRoot} from '../../core/base/root';
import {UIPHTMLNormalizationPreprocessors, UIPJSNormalizationPreprocessors} from '../../core/processors/normalization';

/** Button-plugin to reset snippet to default settings */
export class UIPReset extends UIPPluginButton {
  public static override is = 'uip-reset';

  /** Source type to copy (html | js) */
  @attr({defaultValue: 'html'}) public source: string;

  protected override connectedCallback(): void {
    super.connectedCallback();
  }

  public override onAction(): void {
    const {model} = this;
    if (!model || !model.activeSnippet || !this.$root) return;
    switch (this.source) {
      case 'js':
      case 'javascript':
        model.setJS(model.activeSnippet.js, this.$root);
        break;
      case 'html':
        model.setHtml(model.activeSnippet.html, this.$root);
        break;
    }
    model.storage?.resetState();
  }

  @listen({event: 'uip:model:change', target: ($this: UIPRoot) => $this.model})
  protected onModelChange(): void {
    if (!this.model || !this.model.activeSnippet) return;
    switch (this.source) {
      case 'js':
      case 'javascript':
        const processedJs = this.preprocessJs();
        const isJsUnchanged = this.model.js === processedJs;
        this.toggleButton(isJsUnchanged);
        break;
      case 'html':
        const processedHtml = this.preprocessHtml();
        const isHtmlUnchanged = this.model.html === processedHtml;
        this.toggleButton(isHtmlUnchanged);
        break;
    }
  }

  private preprocessJs(): string | undefined {
    if (!this.model || !this.model.activeSnippet) return;
    return UIPJSNormalizationPreprocessors.preprocess(this.model.activeSnippet.js);
  }

  private preprocessHtml(): string | undefined {
    if (!this.model || !this.model.activeSnippet) return;

    const html = UIPHTMLNormalizationPreprocessors.preprocess(this.model.activeSnippet.html);
    const { head, body: root } = new DOMParser().parseFromString(html, 'text/html');

    Array.from(head.children).reverse().forEach((el) => {
        if (el.tagName !== 'STYLE') return;
        root.innerHTML = '\n' + root.innerHTML;
        root.insertBefore(el, root.firstChild);
    });

    return root.innerHTML;
  }

  protected toggleButton(state?: boolean): void {
    this.$$cls('uip-reset-hidden', state);
  }
}

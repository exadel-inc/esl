import './reset-button.shape';

import {listen, attr} from '@exadel/esl/modules/esl-utils/decorators';

import {UIPPluginButton} from '../../core/button/plugin-button';
import {UIPRoot} from '../../core/base/root';

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
    if (this.source === 'js' || this.source === 'javascript') 
      model.setJS(model.activeSnippet.js, this.$root);
    else if (this.source === 'html')
      model.setHtml(model.activeSnippet.html, this.$root);
    
    model.storage?.resetState();
  }

  @listen({event: 'uip:model:change', target: ($this: UIPRoot) => $this.model})
  protected onModelChange(): void {
    if (!this.model || !this.model.activeSnippet) return;
    if (this.source === 'js' || this.source === 'javascript') 
      this.toggleButton(!this.model.isJSChanged());
    else if (this.source === 'html')
      this.toggleButton(!this.model.isHTMLChanged());
  }

  protected toggleButton(state?: boolean): void {
    this.$$cls('uip-reset-hidden', state);
  }
}

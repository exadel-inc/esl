import './reset-button.shape';

import {listen, attr} from '@exadel/esl/modules/esl-utils/decorators';

import {UIPPluginButton} from '../../core/button/plugin-button';
import {UIPRoot} from '../../core/base/root';

/** Button-plugin to reset snippet to default settings */
export class UIPReset extends UIPPluginButton {
  public static override is = 'uip-reset';

  /** Source type to copy (html | js) */
  @attr({defaultValue: 'html'}) public source: 'js' | 'javascript' | 'html';

  protected override connectedCallback(): void {
    super.connectedCallback();
  }

  public override onAction(): void {
    if (this.$root) this.model?.resetSnippet(this.source, this.$root);
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

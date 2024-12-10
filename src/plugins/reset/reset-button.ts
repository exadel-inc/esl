import './reset-button.shape';

import {listen, attr, boolAttr} from '@exadel/esl/modules/esl-utils/decorators';

import {UIPPluginButton} from '../../core/button/plugin-button';
import {UIPRoot} from '../../core/base/root';

/** Button-plugin to reset snippet to default settings */
export class UIPReset extends UIPPluginButton {
  public static override is = 'uip-reset';

  @boolAttr() public disabled: boolean;

  /** Source type to copy (html | js) */
  @attr({defaultValue: 'html'}) public source: 'js' | 'javascript' | 'html';

  protected get actualSrc(): 'js' | 'html' {
    return this.source === 'javascript' ? 'js' : this.source;
  }

  public override onAction(): void {
    this.$root?.resetSnippet(this.actualSrc);
  }

  @listen({event: 'uip:model:change', target: ($this: UIPRoot) => $this.model})
  protected onModelChange(): void {
    if (!this.model || !this.model.activeSnippet) return;
    if (this.actualSrc === 'js')  this.disabled = !this.model.isJSChanged();
    if (this.actualSrc === 'html') this.disabled = !this.model.isHTMLChanged();
  }
}

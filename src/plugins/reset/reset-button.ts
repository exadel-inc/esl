import './reset-button.shape';

import {listen, attr, boolAttr} from '@exadel/esl/modules/esl-utils/decorators';

import {UIPPluginButton} from '../../core/button/plugin-button';
import {UIPRoot} from '../../core/base/root';

import type {UIPEditableSource} from '../../core/base/source';

/** Button-plugin to reset snippet to default settings */
export class UIPReset extends UIPPluginButton {
  public static override is = 'uip-reset';

  @boolAttr() public disabled: boolean;

  /** Source type to copy (html | js) */
  @attr({defaultValue: 'html'}) public source: UIPEditableSource;

  public override onAction(): void {
    this.$root?.storage!.resetState(this.source);
  }

  @listen({event: 'uip:model:change', target: ($this: UIPRoot) => $this.model})
  protected _onModelChange(): void {
    if (!this.model || !this.model.activeSnippet) return;
    if (this.source === 'js')  this.disabled = !this.model.isJSChanged();
    if (this.source === 'html') this.disabled = !this.model.isHTMLChanged();
  }
}

import './reset-button.shape';

import {UIPPluginButton} from '../../core/button/plugin-button';

/** Button-plugin to reset snippet to default settings */
export class UIPReset extends UIPPluginButton {
  public static override is = 'uip-reset';

  protected override connectedCallback(): void {
    super.connectedCallback();
  }

  public override onAction(): void {
    const {model} = this;
    if (!model) return;
    model.storage?.resetState();
    this.$root && model.applyCurrentSnippet(this.$root);
  }
}

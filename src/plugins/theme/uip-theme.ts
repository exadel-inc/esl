import './uip-theme.shape';

import {UIPPluginButton} from '../../core/button/plugin-button';

export class UIPThemeSwitcher extends UIPPluginButton {
  public static override is = 'uip-toggle-theme';
  public static override defaultTitle = 'Switch theme';

  protected override onAction(): void {
    this.root?.toggleAttribute('dark-theme');
  }
}

import './theme-toggle.shape';
import React from 'jsx-dom';

import {UIPPluginButton} from '../../core/button/plugin-button';
import {ThemeToggleIcon} from './theme-toggle.icon';

export class UIPThemeSwitcher extends UIPPluginButton {
  public static override is = 'uip-theme-toggle';
  public static override defaultTitle = 'Switch theme';

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.appendChild(<ThemeToggleIcon/>);
  }

  protected override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.innerHTML = '';
  }

  protected override onAction(): void {
    this.$root?.toggleAttribute('dark-theme');
  }
}

import './theme-toggle.shape';
import {listen} from '@exadel/esl/modules/esl-utils/decorators';
import {UIPPluginButton} from '../../core/button/plugin-button';
import {ThemeToggleIcon} from './theme-toggle.icon';

/** Theme switcher button-plugin for UI Playground widget */
export class UIPThemeSwitcher extends UIPPluginButton {
  public static override is = 'uip-theme-toggle';
  public static override defaultTitle = 'Switch theme';

  protected override connectedCallback(): void {
    super.connectedCallback();
    this._onThemeChange();
    this.appendChild(<ThemeToggleIcon/>);
  }

  protected override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.innerHTML = '';
  }

  protected override onAction(): void {
    this.$root?.toggleAttribute('dark-theme');
  }

  @listen({event: 'uip:theme:change', target: ($this: UIPThemeSwitcher) => $this.$root})
  protected _onThemeChange(): void {
    this.$$attr('theme', this.$root?.hasAttribute('dark-theme') ? 'dark' : 'light');
  }
}

import {bind} from '@exadel/esl/modules/esl-utils/decorators/bind';

import {UIPPlugin} from '../../core/registration';
import {OptionConfig, UIPOption} from './option/option';

/**
 * Custom element to provide controls for changing UIP visual appearance.
 * @extends UIPPlugin
 */
export class UIPOptions extends UIPPlugin {
  static is = 'uip-options';
  options: Map<string, UIPOption>;
  UIPOptionsConfig: OptionConfig[] = [
    {
      attribute: 'dark-theme',
      iconUrl: '../../static/icons/theme.svg',
    },
    {
      attribute: 'rtl-direction',
      iconUrl: '../../static/icons/rtl.svg'
    },
    {
      attribute: 'settings-collapsed',
      iconUrl: '../../static/icons/settings.svg',
      canActivate: () => !!this.root?.querySelector('uip-settings')
    },
    {
      attribute: 'editor-collapsed',
      iconUrl: '../../static/icons/editor.svg',
      canActivate: () => !!this.root?.querySelector('uip-editor')
    }
  ];

  protected connectedCallback() {
    super.connectedCallback();
    this.bindEvents();
    this.render();
  }

  protected disconnectedCallback() {
    this.innerHTML = '';
    this.unbindEvents();
    super.disconnectedCallback();
  }

  protected bindEvents() {
    this.addEventListener('uip:optionclick', this._onOptionClick);
    this.root?.addEventListener('uip:configchange', this._onRootConfigChange);
  }

  protected unbindEvents() {
    this.removeEventListener('uip:optionclick', this._onOptionClick);
    this.root?.removeEventListener('uip:configchange', this._onRootConfigChange);
  }

  protected render() {
    this.options = new Map(
      this.UIPOptionsConfig.filter(option => !option.canActivate || option.canActivate())
      .map(option => [option.attribute, UIPOption.create(option)])
      );
    this.options.forEach(option => this.append(option));
  }

  @bind
  protected _onRootConfigChange(e: CustomEvent) {
    const option = this.options.get(e.detail.attribute);
    option?.toggleState(e.detail.value !== null);
  }

  @bind
  protected _onOptionClick(e: Event) {
    e.stopPropagation();
    const option = e.target as UIPOption;
    this.root?.toggleAttribute(option.attribute, option.active);
  }

  public static register(tagName?: string) {
    UIPOption.register();
    UIPOption.registered.then(() => super.register.call(this, tagName));
  }
}

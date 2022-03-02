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
  optionsConfig: OptionConfig[] = [
    {
      attribute: 'dark-theme',
      iconConfig: {
        iconUrl: '../../static/icons/moon.svg',
        activeIconUrl: '../../static/icons/sun.svg'
      }
    },
    {
      attribute: 'rtl-direction',
      iconConfig: {
        iconUrl: '../../static/icons/rtl.svg'
      }
    },
    {
      attribute: 'settings-collapsed',
      iconConfig: {
        iconUrl: '../../static/icons/settings.svg'
      },
      canActivate: () => !!this.root?.querySelector('uip-settings')
    },
    {
      attribute: 'editor-collapsed',
      iconConfig: {
        iconUrl: '../../static/icons/editor.svg'
      },
      canActivate: () => !!this.root?.querySelector('uip-editor')
    }
  ];

  protected connectedCallback() {
    super.connectedCallback();
    this.options = new Map(
      this.optionsConfig.filter(option => !option.canActivate || option.canActivate())
      .map(option => [option.attribute, UIPOption.create(option)])
      );
    this.bindEvents();
    this.render();
  }

  protected disconnectedCallback() {
    this.innerHTML = '';
    this.unbindEvents();
    super.disconnectedCallback();
  }

  protected bindEvents() {
    this.addEventListener('click', this.onOptionClick);
    this.root?.addEventListener('uip:configchange', this._onRootConfigChange);
  }

  protected unbindEvents() {
    this.removeEventListener('click', this.onOptionClick);
    this.root?.removeEventListener('uip:configchange', this._onRootConfigChange);
  }

  protected render() {
    this.options.forEach(option => this.append(option));
  }

  @bind
  protected _onRootConfigChange(e: CustomEvent) {
    const option = this.options.get(e.detail.attribute);
    option?.toggleState(e.detail.value !== null);
  }

  @bind
  protected onOptionClick(e: Event) {
    const option = e.target;
    if (!(option instanceof UIPOption)) return;
    this.root?.toggleAttribute(option.attribute, option.active);
  }

  public static register(tagName?: string) {
    UIPOption.register();
    customElements.whenDefined(UIPOption.is).then(() => super.register.call(this, tagName));
  }
}

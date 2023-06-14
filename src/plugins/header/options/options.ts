import {listen} from '@exadel/esl/modules/esl-utils/decorators/listen';

import {UIPPlugin} from '../../../core/base/plugin';
import {OptionConfig, UIPOption} from './option/option';
import {UIPOptionIcons} from './OptionIcons';

/**
 * Options {@link UIPPlugin} custom element definition
 * Custom element to provide controls for changing UIP visual appearance.
 * @extends UIPPlugin
 */
export class UIPOptions extends UIPPlugin {
  public static is = 'uip-options';
  public static observedAttributes = ['hide-theme', 'hide-direction', 'hide-settings', 'hide-editor'];

  /** Map that stores {@link UIPOption} instances */
  public options = new Map<string, UIPOption>();

  /** List of configs to create options */
  protected static UIPOptionsConfig: OptionConfig[] = [
    {
      attrName: 'hide-theme',
      optionValue: 'dark-theme',
      canActivate: (component) => !component.hasAttribute('hide-theme'),
      svg: UIPOptionIcons.themeSVG
    },
    {
      attrName: 'hide-direction',
      optionValue: 'rtl-direction',
      canActivate: (component) => !component.hasAttribute('hide-direction'),
      svg: UIPOptionIcons.rtlDirectionSVG
    },
    {
      attrName: 'hide-settings',
      optionValue: 'settings-collapsed',
      canActivate: (component) => !component.hasAttribute('hide-settings') &&
        !!component.root?.querySelector('uip-settings'),
      svg: UIPOptionIcons.settingsCollapsedSVG
    },
    {
      attrName: 'hide-editor',
      optionValue: 'editor-collapsed',
      canActivate: (component) => !component.hasAttribute('hide-editor') &&
        !!component.root?.querySelector('uip-editor'),
      svg: UIPOptionIcons.editorCollapsedSVG
    }
  ];

  protected connectedCallback() {
    super.connectedCallback();
    this.render();
  }

  protected disconnectedCallback() {
    this.innerHTML = '';
    super.disconnectedCallback();
  }

  protected attributeChangedCallback(attrName: string, oldVal: string | null, newVal: string | null) {
    if (oldVal === newVal || !this.options) return;

    const config = UIPOptions.UIPOptionsConfig.find(elem => elem.attrName === attrName);
    if (!config) return;

    if (newVal === null) this.render([config]); // case to add option icon
    if (newVal !== null) { // case to remove option icon
      const option = this.options.get(config.optionValue);
      if (!option) return;
      this.options.delete(config.optionValue);
      option.remove();
    }
  }

  /**
   * Renders options from passed configs array or
   * by default from {@link UIPOptions.UIPOptionsConfig}
   */
  protected render(optionsCfg = UIPOptions.UIPOptionsConfig) {
    optionsCfg = optionsCfg.filter(option => !option.canActivate || option.canActivate(this));
    optionsCfg.forEach((option) => this.options.set(option.optionValue, UIPOption.createEl(option)));
    this.options.forEach(option => this.append(option));
  }

  /**
   * Handles {@link UIPRoot} `uip:configchange` event to
   * manage {@link UIPOption} active state
   */
  @listen({event: 'uip:configchange', target: '::parent(.uip-root)'})
  protected _onRootConfigChange(e: CustomEvent) {
    const option = this.options.get(e.detail.attribute);
    option?.toggleState(e.detail.value !== null);
  }

  /**
   * Handles {@link UIPOption} `click` event
   * to manage {@link UIPRoot} options attributes
   */
  @listen({event: 'click', selector: '.uip-option'})
  protected _onOptionClick(e: Event) {
    const option = e.target as UIPOption;
    this.root?.toggleAttribute(option.attribute, option.active);
  }

  public static register(tagName?: string) {
    UIPOption.register();
    UIPOption.registered.then(() => super.register.call(this, tagName));
  }
}

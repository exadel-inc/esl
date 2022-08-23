import {listen} from '@exadel/esl/modules/esl-utils/decorators/listen';

import {UIPPlugin} from '../../../core/base/plugin';
import {OptionConfig, UIPOption} from './option/option';

/**
 * Custom element to provide controls for changing UIP visual appearance.
 * @extends UIPPlugin
 */
export class UIPOptions extends UIPPlugin {
  static is = 'uip-options';
  public options = new Map<string, UIPOption>();

  static observedAttributes = ['hide-theme', 'hide-direction', 'hide-settings', 'hide-editor'];

  /** List of configs to create options. */
  protected static UIPOptionsConfig: OptionConfig[] = [
    {
      attrName: 'hide-theme',
      rootControlledAttr: 'dark-theme',
      canActivate: (component) => !component.hasAttribute('hide-theme')
    },
    {
      attrName: 'hide-direction',
      rootControlledAttr: 'rtl-direction',
      canActivate: (component) => !component.hasAttribute('hide-direction')
    },
    {
      attrName: 'hide-settings',
      rootControlledAttr: 'settings-collapsed',
      canActivate: (component) => !component.hasAttribute('hide-settings') &&
        !!component.root?.querySelector('uip-settings')
    },
    {
      attrName: 'hide-editor',
      rootControlledAttr: 'editor-collapsed',
      canActivate: (component) => !component.hasAttribute('hide-editor') &&
        !!component.root?.querySelector('uip-editor')
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

    const config = UIPOptions.UIPOptionsConfig.find((elem) => elem.attrName === attrName);
    if (!config) return;
    if (newVal === null) {
      this.render([config]);
    } else {
      const option = this.options.get(config.rootControlledAttr);
      if (!option) return;
      this.options.delete(config.rootControlledAttr);
      option.remove();
    }
  }

  protected render(options = UIPOptions.UIPOptionsConfig) {
    options = options.filter(option => !option.canActivate || option.canActivate(this));
    const entries: [string, UIPOption][] = options.map(option => [option.rootControlledAttr, UIPOption.create(option)]);
    this.options = new Map(entries);
    this.options.forEach(option => this.append(option));
  }

  @listen({event: 'uip:configchange', target: '::parent(.uip-root)'})
  protected _onRootConfigChange(e: CustomEvent) {
    const option = this.options.get(e.detail.attribute);
    option?.toggleState(e.detail.value !== null);
  }

  @listen('click')
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

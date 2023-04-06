import {ESLBaseElement} from '../../esl-base-element/core';
import {attr, bind, boolAttr, prop} from '../../esl-utils/decorators';

import {ESLShareButton} from './esl-share-button';

/** {@link ShareConfig} provider type definition */
export type ESLShareConfigProviderType = () => Promise<ShareConfig>;

/** The definition of the sharing button */
export interface ShareButtonConfig {
  /** Name of the share action, which is performed after the button is pressed */
  action: string;
  /** HTML content of the share icon */
  icon: string;
  /** Color of the icon background (the value - CSS data type represents a color) */
  iconBackground: string;
  /**
   * URL link (with placeholders) to share. Can contain the following placeholders:
   * - `{u}` or `{url}` - URL to share (`shareUrl` property on the {@link ESLShareButton} instance)
   * - `{t}` or `{title}` - title to share (`shareTitle` property on the {@link ESLShareButton} instance)
   */
  link: string;
  /** String identifier of the button (no spaces) */
  name: string;
  /** Button title */
  title: string;
  /** Additional params to pass into a button */
  additional?: Record<string, any>;
}

/** The definition of share buttons groups (named sets of share buttons) */
export interface ShareGroupConfig {
  /** Name of the group. The group can be accessed with the `group:` prefix in the component configuration */
  name: string;
  /** A list of button names separated by space */
  list: string;
}

/** The definition of `ESLShare` component configuration */
export interface ShareConfig {
  /** List of sharing buttons configuration */
  buttons: ShareButtonConfig[];
  /** List of share button groups configurations */
  groups: ShareGroupConfig[];
}

function getConfigSectionItem<T extends ShareButtonConfig | ShareGroupConfig>(section: T[], name: string): T | undefined {
  return section.find((item) => item.name === name);
}

function getButtonsList(config: ShareConfig, list: string): ShareButtonConfig[] {
  return list.split(' ').reduce((res, item) => {
    const [btnName, groupName] = item.split('group:');
    if (groupName) {
      const groupConfig = getConfigSectionItem(config.groups, groupName);
      if (groupConfig) return res.concat(getButtonsList(config, groupConfig.list));
    } else {
      const btnConfig = getConfigSectionItem(config.buttons, btnName);
      if (btnConfig) res.push(btnConfig);
    }
    return res;
  }, [] as ShareButtonConfig[]);
}

/**
 * ESLShare
 * @author Dmytro Shovchko
 *
 * ESLShare is a custom element to dynamically draw {@link ESLShareButton}s using simplified shared config
 */
export class ESLShare extends ESLBaseElement {
  public static override is = 'esl-share';
  protected static _config: Promise<ShareConfig> = Promise.reject('Configuration is not set');

  /** Register {@link ESLShare} component and dependent {@link ESLShareButton} */
  public static override register(): void {
    ESLShareButton.register();
    super.register();
  }

  /** Event to dispatch on ready state of {@link ESLShare} */
  @prop('esl:share:ready') public SHARE_READY_EVENT: string;

  /**
   * List of social networks or groups of them to display (all by default).
   * The value - a string containing the names of the buttons or groups (specified with
   * the prefix group:) separated by spaces.
   * @example "facebook reddit group:default"
   * */
  @attr({defaultValue: 'all'}) public list: string;
  /** URL to share (current page URL by default) */
  @attr() public shareUrl: string;
  /** Title to share (current document title by default) */
  @attr() public shareTitle: string;
  /** Rendering mode of the share buttons ('list' by default) */
  @attr() public mode: 'list';

  /** @readonly Ready state marker */
  @boolAttr({readonly: true}) public ready: boolean;

  /**
   * Gets or updates config with a promise of a new config object or using a config provider function.
   * @returns Promise of the current config
   */
  public static config(provider?: ESLShareConfigProviderType | ShareConfig): Promise<ShareConfig> {
    if (typeof provider === 'function') ESLShare._config = provider();
    if (typeof provider === 'object') ESLShare._config = Promise.resolve(provider);
    return ESLShare._config;
  }

  /** @returns config of buttons specified by the list attribute */
  public get buttonsConfig(): Promise<ShareButtonConfig[]> {
    return (this.constructor as typeof ESLShare).config().then((config) => {
      return (this.list !== 'all') ? getButtonsList(config, this.list) : config.buttons;
    });
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    if (!this.ready) {
      this.init();
    }
  }

  protected init(): void {
    if (!this.mode) this.mode = 'list';
    this.buttonsConfig.then(this.build)
      .then(() => this.$$fire(this.SHARE_READY_EVENT, {bubbles: false}))
      .catch((e) => console.error(`[${this.baseTagName}]: ${e}`));
  }

  /** Builds content of component */
  @bind
  public build(config: ShareButtonConfig[]): void {
    this.innerHTML = '';
    config.forEach((btnCfg) => {
      const btn = this.buildButton(btnCfg);
      btn && this.appendChild(btn);
    });

    this.toggleAttribute('ready', true);
  }

  protected buildButton(cfg: ShareButtonConfig): ESLShareButton | null {
    const $button = ESLShareButton.create();
    Object.assign($button, cfg);
    const $icon = document.createElement('span');
    $icon.title = cfg.title;
    $icon.classList.add('esl-share-icon');
    $icon.innerHTML = cfg.icon;
    $icon.setAttribute('style', `background-color:${cfg.iconBackground};`);
    $button.appendChild($icon);
    return $button;
  }
}

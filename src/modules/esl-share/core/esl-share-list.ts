import {ESLBaseElement} from '../../esl-base-element/core';
import {attr, bind, boolAttr, prop} from '../../esl-utils/decorators';

import {ESLShareButton} from './esl-share-button';

/** ShareConfig provider type definition */
export type ESLShareConfigProviderType = () => Promise<ShareConfig>;

/** ShareButtonConfig type definition */
export interface ShareButtonConfig {
  action: string;
  icon: string;
  iconBackground: string;
  link: string;
  name: string;
  title: string;
  additional?: Record<string, any>;
}

/** ShareGroupConfig type definition */
export interface ShareGroupConfig {
  name: string;
  list: string;
}

/** ShareConfig type definition */
export interface ShareConfig {
  buttons: ShareButtonConfig[];
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
 * ESLShareList
 * @author Dmytro Shovchko
 *
 * ESLShareList is a custom element that is used to show the list of social media buttons.
 */
export class ESLShareList extends ESLBaseElement {
  public static override is = 'esl-share-list';
  protected static _config: Promise<ShareConfig> = Promise.reject('Configuration is not set');

  /**  */
  public static override register(): void {
    ESLShareButton.register();
    super.register();
  }

  /** Event to dispatch on ready state of {@link ESLShareList} */
  @prop('esl:share:ready') public SHARE_READY_EVENT: string;

  /**
   * @readonly List of social networks or groups of them to display (all by default).
   * The value - a string containing the names of the buttons or groups (specified with
   * the prefix group:) separated by spaces. For example: "facebook reddit group:default"
   * */
  @attr({readonly: true, defaultValue: 'all'}) public list: string;
  /** URL to share on social network (current page URL by default) */
  @attr({dataAttr: true}) public shareUrl: string;
  /** Title to share on social network (current document title by default) */
  @attr({dataAttr: true}) public shareTitle: string;

  /** @readonly Ready state marker */
  @boolAttr({readonly: true}) public ready: boolean;

  /** Returns element tag name */
  public get alias(): string {
    return (this.constructor as typeof ESLBaseElement).is;
  }

  /** Sets config by a config object or a config provider function */
  public static config(provider?: ESLShareConfigProviderType | ShareConfig): Promise<ShareConfig> {
    if (typeof provider === 'function') ESLShareList._config = provider();
    if (typeof provider === 'object') ESLShareList._config = Promise.resolve(provider);
    return ESLShareList._config;
  }

  /** Returns config of buttons specified by the list attribute */
  public get buttonsConfig(): Promise<ShareButtonConfig[]> {
    return (this.constructor as typeof ESLShareList).config().then((config) => {
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
    this.buttonsConfig.then(this.build)
      .then(() => this.$$fire(this.SHARE_READY_EVENT, {bubbles: false}))
      .catch((e) => console.error(`[${this.alias}]: ${e}`));
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

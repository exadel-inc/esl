import {ESLBaseElement} from '../../esl-base-element/core';
import {attr, bind, boolAttr, prop} from '../../esl-utils/decorators';

import {ESLShareButton} from './esl-share-button';

export type ESLShareConfigProviderType = () => Promise<ShareConfig>;

export interface ShareButtonConfig {
  action: string;
  icon: string;
  iconBackground: string;
  link: string;
  name: string;
  title: string;
  additional?: Record<string, any>;
}

export interface ShareGroupConfig {
  name: string;
  list: string;
}

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

export class ESLShareList extends ESLBaseElement {
  public static override is = 'esl-share-list';
  protected static _config: Promise<ShareConfig> = Promise.reject('Configuration is not set');

  public static override register(): void {
    ESLShareButton.register();
    super.register();
  }

  /** Event to dispatch on ready state of {@link ESLShareList} */
  @prop('esl:share:ready') public SHARE_READY_EVENT: string;

  @attr({readonly: true, defaultValue: 'all'}) public list: string;
  @attr({dataAttr: true}) public shareUrl: string;
  @attr({dataAttr: true}) public shareTitle: string;

  @boolAttr({readonly: true}) public ready: boolean;

  public get alias(): string {
    return (this.constructor as typeof ESLBaseElement).is;
  }

  public static config(provider?: ESLShareConfigProviderType | ShareConfig): Promise<ShareConfig> {
    if (typeof provider === 'function') ESLShareList._config = provider();
    if (typeof provider === 'object') ESLShareList._config = Promise.resolve(provider);
    return ESLShareList._config;
  }

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

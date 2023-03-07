import {ESLBaseElement} from '../../esl-base-element/core';
import {attr, bind, boolAttr, prop} from '../../esl-utils/decorators';

import {ESLShareButton} from './esl-share-button';
import {ESLShareActionRegistry} from './esl-share-action-registry';

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
  id: string;
  list: string;
}

export interface ShareConfig {
  buttons: ShareButtonConfig[];
  groups: ShareGroupConfig[];
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

  @attr({readonly: true}) public list: string;
  @attr({readonly: true}) public group: string;
  @attr({dataAttr: true}) public shareUrl: string;
  @attr({dataAttr: true}) public shareTitle: string;

  @boolAttr({readonly: true}) public ready: boolean;

  public get alias(): string {
    return (this.constructor as typeof ESLBaseElement).is;
  }

  public static config(provider?: ESLShareConfigProviderType): Promise<ShareConfig> {
    if (provider) {
      ESLShareList._config = provider();
    }
    return ESLShareList._config;
  }

  public get buttonsConfig(): Promise<ShareButtonConfig[]> {
    return (this.constructor as typeof ESLShareList).config().then((config) => {
      const list = this.getList(config);
      return list.length ? this.getButtons(config, list) : config.buttons;
    });
  }

  protected getButtons(config: ShareConfig, idList: string[]): ShareButtonConfig[] {
    const {buttons} = config;
    const res: ShareButtonConfig[] = [];
    idList.forEach((name) => {
      const btnConfig = buttons.find((btn) => btn.name === name);
      btnConfig && res.push(btnConfig);
    });
    return res;
  }

  protected getList(config: ShareConfig): string[] {
    const {group} = this;
    let {list} = this;
    if (group) {
      const groupCfg = config.groups.find((e) => e.id === group);
      if (groupCfg) {
        list = groupCfg.list;
      }
    }
    return list ? list.split(',').map((id) => id.trim()) : [];
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
    // const shareAction = ESLShareActionRegistry.instance.get(cfg.action);
    // if (!shareAction) return null;

    const $button = ESLShareButton.create();
    Object.assign($button, cfg);
    const $icon = document.createElement('span');
    $icon.title = cfg.title;
    $icon.classList.add('esl-share-icon');
    $icon.innerHTML = cfg.icon;
    $icon.setAttribute('style', `background-color:${cfg.iconBackground || $button.defaultBackground};`);
    $button.appendChild($icon);
    return $button;
  }
}

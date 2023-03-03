import {ESLBaseElement} from '../../esl-base-element/core';
import {attr, bind, boolAttr, memoize, prop} from '../../esl-utils/decorators';

import {ESLShareConfig} from './esl-share-config';
import {ESLShareButton} from './esl-share-button';
import {ESLShareActionRegistry} from './esl-share-action-registry';

import type {ShareConfig} from './esl-share-config';


export interface ShareButtonConfig {
  'action': string;
  'icon': string;
  'iconBackground': string;
  'link': string;
  'name': string;
  'title': string;
}

export class ESLShareList extends ESLBaseElement {
  public static override is = 'esl-share-list';

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

  protected _ready: Promise<void>;

  public get alias(): string {
    return (this.constructor as typeof ESLBaseElement).is;
  }

  public get ready$(): Promise<void> {
    return this._ready ?? Promise.reject(`[${this.alias}]: is not ready`);
  }

  @memoize()
  public get config(): Promise<ShareConfig> {
    return ESLShareConfig.get();
  }

  @memoize()
  public get buttonsConfig(): Promise<ShareButtonConfig[]> {
    return this.config.then((config) => {
      const list = this.getList(config);
      return list.length ? this.getButtons(config, list) : config.buttons;
    });
  }

  protected getButtons(config: ShareConfig, idList: string[]): ShareButtonConfig[] {
    const {buttons} = config;
    const ret: ShareButtonConfig[] = [];
    idList.forEach((name) => {
      const btnConfig = buttons.find((btn) => btn.name === name);
      btnConfig && ret.push(btnConfig);
    });
    return ret;
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
    if (!this._ready) {
      this.init();
    }
  }

  protected init(): void {
    this._ready = this.buttonsConfig.then(this.buildContent);
    this._ready.then(() => this.$$fire(this.SHARE_READY_EVENT, {bubbles: false}));
    this._ready.catch((e) => console.error(`[${this.alias}]: ${e}`));
  }

  @bind
  protected buildContent(config: ShareButtonConfig[]): void {
    this.innerHTML = '';
    config.forEach((btnCfg) => {
      const btn = this.buildButton(btnCfg);
      btn && this.appendChild(btn);
    });

    this.toggleAttribute('ready', true);
  }

  protected buildButton(cfg: ShareButtonConfig): ESLShareButton | null {
    const shareAction = ESLShareActionRegistry.instance.get(cfg.action);
    if (!shareAction) return null;

    const $button = ESLShareButton.create();
    Object.assign($button, cfg, {'unavailable': !shareAction.isAvailable});
    const $icon = document.createElement('span');
    $icon.title = cfg.title;
    $icon.classList.add('esl-share-icon');
    $icon.innerHTML = cfg.icon;
    $icon.setAttribute('style', `background-color:${cfg.iconBackground || $button.defaultBackground};`);
    $button.appendChild($icon);
    return $button;
  }
}

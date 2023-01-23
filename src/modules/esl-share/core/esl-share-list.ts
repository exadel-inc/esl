import {ESLBaseElement} from '../../esl-base-element/core';
import {attr, bind, boolAttr, memoize, prop} from '../../esl-utils/decorators';

import {ESLShareConfig} from './esl-share-config';
import {ESLShareButton} from './esl-share-button';

import type {ShareButtonConfig} from './esl-share-button';
import type {ShareConfig} from './esl-share-config';

export class ESLShareList extends ESLBaseElement {
  public static is = 'esl-share-list';

  public static register(): void {
    ESLShareButton.register();
    super.register();
  }

  /** Event to dispatch on ready state of {@link ESLShareList} */
  @prop('esl:share:ready') public SHARE_READY_EVENT: string;

  @attr({readonly: true}) public list: string;
  @attr({readonly: true}) public group: string;
  @attr({dataAttr: true}) public url: string;
  @attr({dataAttr: true}) public title: string;

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
    idList.forEach((buttonId) => {
      const btnConfig = buttons.find((btn) => btn.id === buttonId);
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

  public connectedCallback(): void {
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
      const btn = ESLShareButton.build(btnCfg);
      btn && this.appendChild(btn);
    });

    this.toggleAttribute('ready', true);
  }
}

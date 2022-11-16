import {ESLBaseElement} from '../../esl-base-element/core';
import {attr, bind, boolAttr, memoize} from '../../esl-utils/decorators';
import {ESLEventUtils} from '../../esl-utils/dom/events';

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

  @attr({readonly: true}) public list: string;
  @attr({readonly: true}) public group: string;
  @attr({dataAttr: true}) public url: string;
  @attr({dataAttr: true}) public title: string;

  @boolAttr({readonly: true}) public ready: boolean;

  protected _ready: Promise<void>;

  public get ready$(): Promise<void> {
    return this._ready ? this._ready : Promise.reject('ESL Share is not defined');
  }

  @memoize()
  public get config(): Promise<ShareConfig> {
    return ESLShareConfig.get();
  }

  @memoize()
  public get buttonsConfig(): Promise<ShareButtonConfig[]> {
    return this.config.then((config) => {
      const filterPredicate = this.getFilterPredicate(config);
      return config.buttons.filter(filterPredicate);
    });
  }

  protected getFilterPredicate(config: ShareConfig): (btn: ShareButtonConfig) => boolean {
    const {group} = this;
    let {list} = this;
    if (group) {
      const groupCfg = config.groups.find((e) => e.id === group);
      if (groupCfg) {
        list = groupCfg.list;
      }
    }
    if (list) {
      const buttons = list.split(',').map((id) => id.trim());
      return (btn: ShareButtonConfig): boolean => buttons.includes(btn.id);
    }
    return (): boolean => true;
  }

  public connectedCallback(): void {
    super.connectedCallback();
    if (!this._ready) {
      this.init();
    }
  }

  protected init(): void {
    this._ready = this.buttonsConfig.then(this.buildContent);
    this._ready.then(() => ESLEventUtils.dispatch(this, 'esl:share:ready'));
    this._ready.catch((e) => console.error(`[${(this.constructor as typeof ESLBaseElement).is}]: ${e}`));
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

import {ESLBaseElement} from '../../esl-base-element/core';
import {attr, boolAttr, listen, memoize} from '../../esl-utils/decorators';
import {ENTER, SPACE} from '../../esl-utils/dom/keys';
import {ESLShareActionRegistry} from './esl-share-action-registry';

import type {ESLShareList} from './esl-share-list';

export interface ShareButtonConfig {
  'action': string;
  'id': string;
  'icon': string;
  'iconBackground': string;
  'link': string;
  'name': string;
  'title': string;
}

export interface ShareData {
  url: string;
  title: string;
}

export class ESLShareButton extends ESLBaseElement {
  public static is = 'esl-share-button';

  public static DEFAULT_ICON_BG_COLOR: string = '#FFF';

  @attr() public action: string;
  @attr() public buttonId: string;
  @attr() public link: string;
  @attr() public name: string;
  @boolAttr() public unavailable: boolean;

  public static build(cfg: ShareButtonConfig): ESLShareButton | null {
    const shareAction = ESLShareActionRegistry.instance.get(cfg.action);
    if (!shareAction) return null;

    const {isAvailable} = shareAction;
    const $button = ESLShareButton.create();
    $button.$$attr('action', cfg.action);
    $button.$$attr('button-id', cfg.id);
    $button.$$attr('link', cfg.link);
    $button.$$attr('name', cfg.name);
    $button.$$attr('tabindex', '0');
    $button.$$attr('role', 'button');
    $button.$$attr('aria-label', cfg.title);
    $button.$$attr('unavailable', !isAvailable);
    const $icon = document.createElement('span');
    $icon.title = cfg.title;
    $icon.classList.add('esl-share-icon');
    $icon.innerHTML = cfg.icon;
    $icon.setAttribute('style', `background-color:${cfg.iconBackground || ESLShareButton.DEFAULT_ICON_BG_COLOR};`);
    $button.appendChild($icon);
    return $button;
  }

  protected static convertToAbsolutePath(path: string): string {
    return new URL(path, document.baseURI).href;
  }

  @memoize()
  public get host(): ESLShareList | null {
    return this.closest('esl-share-list');
  }

  public get shareData(): ShareData {
    const {host} = this;

    return {
      url: (host && host.url) ? ESLShareButton.convertToAbsolutePath(host.url) : window.location.href,
      title: (host && host.title) ? host.title : document.title
    };
  }

  protected beforeAction(): void {}

  protected doAction(): void {
    this.beforeAction();
    ESLShareActionRegistry.instance.doAction(this);
    this.afterAction();
  }

  protected afterAction(): void {}

  @listen('click')
  protected onClick(e: MouseEvent): void {
    this.doAction();
  }

  @listen('keydown')
  protected onKeydown(e: KeyboardEvent): void {
    if ([ENTER, SPACE].includes(e.key)) {
      this.click();
      e.preventDefault();
    }
  }
}

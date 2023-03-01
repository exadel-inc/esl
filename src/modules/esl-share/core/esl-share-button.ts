import {ESLBaseElement} from '../../esl-base-element/core';
import {attr, boolAttr, listen} from '../../esl-utils/decorators';
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

export class ESLShareButton extends ESLBaseElement {
  public static override is = 'esl-share-button';

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

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.initA11y();
  }

  public initA11y(): void {
    if (!this.hasAttribute('role')) this.setAttribute('role', 'button');
    if (this.getAttribute('role') === 'button' && !this.hasAttribute('tabindex')) {
      this.tabIndex = 0;
    }
  }

  protected onBeforeShare(): void {}

  public share(): void {
    this.onBeforeShare();
    ESLShareActionRegistry.instance.share(this);
    this.onAfterShare();
  }

  protected onAfterShare(): void {}

  @listen('click')
  protected _onClick(e: MouseEvent): void {
    this.share();
  }

  @listen('keydown')
  protected _onKeydown(e: KeyboardEvent): void {
    if ([ENTER, SPACE].includes(e.key)) {
      this.click();
      e.preventDefault();
    }
  }
}

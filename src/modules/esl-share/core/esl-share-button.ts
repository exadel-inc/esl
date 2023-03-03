import {ESLBaseElement} from '../../esl-base-element/core';
import {attr, boolAttr, listen, prop} from '../../esl-utils/decorators';
import {ENTER, SPACE} from '../../esl-utils/dom/keys';
import {toAbsoluteUrl} from '../../esl-utils/misc/url';
import {ESLShareActionRegistry} from './esl-share-action-registry';

import type {ESLShareList} from './esl-share-list';

export interface ShareButtonConfig {
  'action': string;
  'icon': string;
  'iconBackground': string;
  'link': string;
  'name': string;
  'title': string;
}

export class ESLShareButton extends ESLBaseElement {
  public static override is = 'esl-share-button';

  @attr() public action: string;
  @attr() public link: string;
  @attr() public name: string;
  @attr({dataAttr: true}) public shareUrl: string;
  @attr({dataAttr: true}) public shareTitle: string;
  @boolAttr() public unavailable: boolean;
  @prop('transparent') public defaultBackground: string;

  public static build(cfg: ShareButtonConfig): ESLShareButton | null {
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

  public get host(): ESLShareList | null {
    return this.closest('esl-share-list');
  }

  public get titleToShare(): string {
    return this.shareTitle.length
      ? this.shareTitle
      : this.host?.shareTitle.length
        ? this.host?.shareTitle
        : document.title;
  }

  public get urlToShare(): string {
    return toAbsoluteUrl(this.shareUrl.length
      ? this.shareUrl
      : this.host?.shareUrl.length
        ? this.host?.shareUrl
        : window.location.href);
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

  public share(): void {
    ESLShareActionRegistry.instance.share(this);
  }

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

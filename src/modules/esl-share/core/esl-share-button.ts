import {ESLBaseElement} from '../../esl-base-element/core';
import {attr, listen} from '../../esl-utils/decorators';
import {ENTER, SPACE} from '../../esl-utils/dom/keys';
import {ESLShareActionRegistry} from './esl-share-action-registry';

export interface ShareButtonConfig {
  'action': string;
  'id': string;
  'icon': string;
  'iconBackground': string;
  'link': string;
  'name': string;
  'name_en': string;
}

export class ESLShareButton extends ESLBaseElement {
  public static is = 'esl-share-button';

  public static DEFAULT_ICON_BG_COLOR: string = '#FFF';

  @attr() public action: string;
  @attr() public netId: string;
  @attr() public name: string;
  @attr() public icon: string;
  @attr() public link: string;

  public static build(cfg: ShareButtonConfig): ESLShareButton | null {
    if (!ESLShareActionRegistry.instance.has(cfg.action)) return null;
    const $button = ESLShareButton.create();
    $button.$$attr('action', cfg.action);
    $button.$$attr('net-id', cfg.id);
    $button.$$attr('link', cfg.link);
    $button.$$attr('name', cfg['name_en']);
    $button.$$attr('tabIndex', '0');
    $button.$$attr('role', 'button');
    $button.$$attr('aria-label', cfg.name);
    const wrapper = document.createElement('span');
    wrapper.title = cfg.name;
    wrapper.classList.add('esl-share-button-icon');
    wrapper.innerHTML = cfg.icon;
    wrapper.setAttribute('style', `background-color:${cfg.iconBackground || ESLShareButton.DEFAULT_ICON_BG_COLOR};`);
    $button.appendChild(wrapper);
    return $button;
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

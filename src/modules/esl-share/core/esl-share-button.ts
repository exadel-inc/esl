import {ESLBaseElement} from '../../esl-base-element/core';
import {attr, boolAttr, jsonAttr, listen} from '../../esl-utils/decorators';
import {ENTER, SPACE} from '../../esl-utils/dom/keys';
import {toAbsoluteUrl} from '../../esl-utils/misc/url';
import {ESLShareActionRegistry} from './esl-share-action-registry';

import type {ESLShareBaseAction} from './esl-share-action';
import type {ESLShareList} from './esl-share-list';

function getProp<T>(name: string, targets: Record<string, any>[], fallback: T, predicate: (val: T) => boolean): T {
  const find = targets.find((target) => predicate(target[name]));
  return find ? find[name] : fallback;
}

export class ESLShareButton extends ESLBaseElement {
  public static override is = 'esl-share-button';
  public static observedAttributes = ['action'];

  @attr() public action: string;
  @attr() public link: string;
  @attr() public name: string;
  @jsonAttr({dataAttr: true}) public additional: Record<string, any>;
  @attr({dataAttr: true}) public shareUrl: string;
  @attr({dataAttr: true}) public shareTitle: string;
  @boolAttr() public unavailable: boolean;

  protected get actionInstance(): ESLShareBaseAction | null {
    return ESLShareActionRegistry.instance.get(this.action);
  }

  public get host(): ESLShareList | null {
    return this.closest('esl-share-list');
  }

  public get titleToShare(): string {
    return this._getPropFromRelatedEls('shareTitle', document.title);
  }

  public get urlToShare(): string {
    return toAbsoluteUrl(this._getPropFromRelatedEls('shareUrl', window.location.href));
  }

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    if (!this.connected || oldVal === newVal) return;
    if (attrName === 'action') this.updateAction();
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.initA11y();
    this.updateAction();
  }

  public initA11y(): void {
    if (!this.hasAttribute('role')) this.setAttribute('role', 'button');
    if (this.getAttribute('role') === 'button' && !this.hasAttribute('tabindex')) {
      this.tabIndex = 0;
    }
  }

  public share(): void {
    this.actionInstance?.share(this);
  }

  protected updateAction(): void {
    this.$$attr('unavailable', !this.actionInstance?.isAvailable);
  }

  protected _getPropFromRelatedEls(name: string, fallback: string): string {
    return getProp(name, [this, this.host ?? {}], fallback, (val: string) => !!val.length);
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
